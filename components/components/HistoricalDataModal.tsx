
import React, { useState, useMemo } from 'react';
import { Transaction, CashFlow, Account, HistoricalData, Market, Currency } from '../types';
import { getPortfolioStateAtDate, formatCurrency } from '../utils/calculations';
import { fetchHistoricalYearEndData } from '../services/geminiService';

interface Props {
  transactions: Transaction[];
  cashFlows: CashFlow[];
  accounts: Account[];
  historicalData: HistoricalData;
  onSave: (data: HistoricalData) => void;
  onClose: () => void;
}

const HistoricalDataModal: React.FC<Props> = ({ 
  transactions, 
  cashFlows, 
  accounts, 
  historicalData, 
  onSave, 
  onClose 
}) => {
  // Identify available years from data
  const years = useMemo(() => {
    const allYears = new Set([
        ...transactions.map(t => new Date(t.date).getFullYear()),
        ...cashFlows.map(c => new Date(c.date).getFullYear())
    ]);
    const currentYear = new Date().getFullYear();
    // Filter out current year and future years
    return Array.from(allYears).filter(y => y < currentYear).sort((a, b) => b - a);
  }, [transactions, cashFlows]);

  const [selectedYear, setSelectedYear] = useState<number>(years[0] || new Date().getFullYear() - 1);
  const [localData, setLocalData] = useState<HistoricalData>(historicalData);
  const [loading, setLoading] = useState(false);

  // Determine tickers for selected year
  const activeTickers = useMemo(() => {
      const yearEndDate = new Date(`${selectedYear}-12-31`);
      const { holdings } = getPortfolioStateAtDate(yearEndDate, transactions, cashFlows, accounts);
      return Object.keys(holdings).filter(k => holdings[k] > 0.000001).map(k => {
          const [market, ticker] = k.split('-');
          return { market, ticker };
      });
  }, [selectedYear, transactions, cashFlows, accounts]);

  // Calculate Total Assets dynamically based on local inputs
  const calculatedTotalAssets = useMemo(() => {
    const yearEndDate = new Date(`${selectedYear}-12-31`);
    const { holdings, cashBalances } = getPortfolioStateAtDate(yearEndDate, transactions, cashFlows, accounts);
    
    const currentYearData = localData[selectedYear] || { prices: {}, exchangeRate: 30 };
    const currentPrices = currentYearData.prices || {};
    const currentRate = currentYearData.exchangeRate || 30;

    let stockValueTWD = 0;
    Object.entries(holdings).forEach(([key, qty]) => {
        if (qty > 0.000001) {
            const [market, ticker] = key.split('-');
            const displayTicker = market === Market.TW && !ticker.includes('TPE:') ? `TPE:${ticker}` : ticker;
            
            // Try to find price with display ticker (TPE:XXX) or raw ticker
            const priceKey = market === Market.TW ? displayTicker : ticker;
            const price = currentPrices[priceKey] || currentPrices[ticker] || 0;
            
            if (market === Market.US) {
                stockValueTWD += qty * price * currentRate;
            } else {
                stockValueTWD += qty * price;
            }
        }
    });

    let cashValueTWD = 0;
    Object.entries(cashBalances).forEach(([accId, bal]) => {
        const acc = accounts.find(a => a.id === accId);
        if (acc) {
            if (acc.currency === Currency.USD) cashValueTWD += bal * currentRate;
            else cashValueTWD += bal;
        }
    });

    return stockValueTWD + cashValueTWD;
  }, [selectedYear, localData, transactions, cashFlows, accounts]);

  // Handle data updates
  const handlePriceChange = (ticker: string, value: string) => {
      const num = parseFloat(value);
      setLocalData(prev => ({
          ...prev,
          [selectedYear]: {
              ...prev[selectedYear],
              prices: {
                  ...prev[selectedYear]?.prices,
                  [ticker]: isNaN(num) ? 0 : num
              },
              exchangeRate: prev[selectedYear]?.exchangeRate || 30
          }
      }));
  };

  const handleRateChange = (value: string) => {
      const num = parseFloat(value);
      setLocalData(prev => ({
          ...prev,
          [selectedYear]: {
              ...prev[selectedYear],
              prices: prev[selectedYear]?.prices || {},
              exchangeRate: isNaN(num) ? 30 : num
          }
      }));
  };

  const handleAiFetch = async () => {
      // 1. Get current data for selected year
      const currentYearData = localData[selectedYear] || { prices: {}, exchangeRate: 0 };

      // 2. Filter out tickers that already have non-zero data
      const missingTickers = activeTickers.filter(t => {
          const displayTicker = t.market === Market.TW && !t.ticker.includes('TPE:') ? `TPE:${t.ticker}` : t.ticker;
          // Check if price exists and is non-zero
          const val = currentYearData.prices[displayTicker] || currentYearData.prices[t.ticker];
          return !val || val === 0;
      });

      // 3. Check if exchange rate needs update
      // Rule: Allow update if it's missing (0/undefined) OR it is exactly 30 (default).
      // If it is any other number (e.g. 31.5), assume user set it and do not overwrite.
      const currentRate = currentYearData.exchangeRate;
      const rateNeedsUpdate = !currentRate || currentRate === 0 || currentRate === 30;

      if (missingTickers.length === 0 && !rateNeedsUpdate) {
          alert('所有持股與匯率皆已有數據，無須 AI 更新。\n若需重新抓取，請先將數值歸零或設為 30。');
          return;
      }

      setLoading(true);
      try {
          // If no tickers are missing but rate needs update, we still need to call API.
          // We'll query one ticker to trigger the prompt logic if list is empty.
          let queryTickers: string[] = [];
          if (missingTickers.length > 0) {
              queryTickers = missingTickers.map(t => 
                 t.market === Market.TW && !t.ticker.includes('TPE:') ? `TPE:${t.ticker}` : t.ticker
              );
          } else if (activeTickers.length > 0) {
              // Fetch rate only case: query first ticker
              const t = activeTickers[0];
              queryTickers = [t.market === Market.TW && !t.ticker.includes('TPE:') ? `TPE:${t.ticker}` : t.ticker];
          }
          
          const result = await fetchHistoricalYearEndData(selectedYear, queryTickers);
          
          setLocalData(prev => {
              const prevData = prev[selectedYear] || { prices: {}, exchangeRate: 0 };
              
              // Only update exchange rate if it was missing (0) or default (30)
              const curRate = prevData.exchangeRate;
              const shouldUpdateRate = !curRate || curRate === 0 || curRate === 30;
              
              const newRate = shouldUpdateRate 
                  ? (result.exchangeRate || 30) // Use fetched rate, or fallback to 30
                  : curRate; // Keep existing manual rate

              return {
                  ...prev,
                  [selectedYear]: {
                      ...prevData,
                      prices: {
                          ...prevData.prices,
                          ...result.prices // This merge is safe because we only queried missing tickers
                      },
                      exchangeRate: newRate
                  }
              };
          });
      } catch (e) {
          alert('AI 更新失敗，請稍後再試');
          console.error(e);
      } finally {
          setLoading(false);
      }
  };

  const handleSave = () => {
      onSave(localData);
      onClose();
  };

  const currentYearData = localData[selectedYear] || { prices: {}, exchangeRate: 30 };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 animate-fade-in">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl h-[85vh] flex flex-col overflow-hidden">
        <div className="bg-slate-900 p-4 flex justify-between items-center shrink-0">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <span>🕰️</span> 歷史股價校正 (Time Machine)
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white text-2xl">&times;</button>
        </div>
        
        <div className="p-6 flex-1 overflow-y-auto space-y-6">
           <div className="flex gap-4 items-center bg-slate-50 p-4 rounded-lg border border-slate-200">
               <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">選擇年份</label>
                   <select 
                     value={selectedYear} 
                     onChange={(e) => setSelectedYear(Number(e.target.value))}
                     className="border border-slate-300 rounded p-2 text-sm font-bold min-w-[100px]"
                   >
                       {years.map(y => <option key={y} value={y}>{y} 年</option>)}
                       {years.length === 0 && <option disabled>無歷史資料</option>}
                   </select>
               </div>
               
               <div className="flex-1 text-right">
                   <button 
                     onClick={handleAiFetch}
                     disabled={loading || years.length === 0}
                     className={`px-4 py-2 rounded shadow text-sm font-bold text-white transition flex items-center gap-2 ml-auto
                       ${loading ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                   >
                       {loading ? 'AI 搜尋中...' : '🤖 AI 自動補齊缺漏數據'}
                   </button>
               </div>
           </div>

           {/* Total Assets Summary */}
           <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r shadow-sm">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-xs text-blue-500 font-bold uppercase tracking-wider mb-1">該年度總資產 (Total Assets)</p>
                        <p className="text-2xl font-bold text-blue-800 font-mono">
                            {formatCurrency(calculatedTotalAssets, 'TWD')}
                        </p>
                    </div>
                    <div className="text-right text-xs text-blue-600 space-y-1">
                         <p>總資產 = 股票市值 + 現金餘額</p>
                         <p className="opacity-80">*基於下方設定的匯率: {currentYearData.exchangeRate}</p>
                    </div>
                </div>
            </div>

           <div className="bg-white border rounded-lg overflow-hidden">
               <div className="p-4 bg-slate-100 border-b flex justify-between items-center">
                   <h3 className="font-bold text-slate-700">{selectedYear} 年底數據</h3>
                   <div className="flex items-center gap-2">
                       <label className="text-sm text-slate-600">匯率 (USD/TWD):</label>
                       <input 
                         type="number" 
                         step="0.1"
                         value={currentYearData.exchangeRate}
                         onChange={(e) => handleRateChange(e.target.value)}
                         className="w-20 border rounded p-1 text-right font-mono"
                       />
                   </div>
               </div>
               
               <table className="min-w-full text-sm text-left">
                   <thead className="bg-slate-50 text-slate-500">
                       <tr>
                           <th className="px-4 py-2">市場</th>
                           <th className="px-4 py-2">代號</th>
                           <th className="px-4 py-2 text-right">收盤價 ({selectedYear}/12/31)</th>
                       </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                       {activeTickers.length === 0 ? (
                           <tr><td colSpan={3} className="p-8 text-center text-slate-400">該年份無持股</td></tr>
                       ) : (
                           activeTickers.map(t => {
                               const displayTicker = t.market === Market.TW && !t.ticker.includes('TPE:') ? `TPE:${t.ticker}` : t.ticker;
                               const priceKey = t.market === Market.TW ? displayTicker : t.ticker;
                               const val = currentYearData.prices[priceKey] || currentYearData.prices[t.ticker] || 0;
                               const hasData = val > 0;
                               
                               return (
                                   <tr key={t.ticker} className="hover:bg-slate-50">
                                       <td className="px-4 py-2">
                                           <span className={`px-2 py-0.5 rounded text-xs ${t.market === Market.US ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                               {t.market}
                                           </span>
                                       </td>
                                       <td className="px-4 py-2 font-bold text-slate-700">
                                           {t.ticker}
                                           {hasData && <span className="text-green-500 ml-1 text-xs">✓</span>}
                                       </td>
                                       <td className="px-4 py-2 text-right">
                                           <input 
                                             type="number" 
                                             step="0.01"
                                             value={val}
                                             onChange={(e) => handlePriceChange(priceKey, e.target.value)}
                                             className={`w-32 border rounded p-1 text-right focus:ring-2 focus:ring-accent ${hasData ? 'border-green-200 bg-green-50' : 'border-slate-300'}`}
                                             placeholder="輸入股價"
                                           />
                                       </td>
                                   </tr>
                               );
                           })
                       )}
                   </tbody>
               </table>
           </div>
           
           <div className="text-xs text-slate-500 bg-yellow-50 p-3 rounded border border-yellow-100">
               💡 說明：
               <ul className="list-disc pl-5 mt-1 space-y-1">
                   <li>AI 僅會自動補齊<strong className="text-slate-800">數值為 0</strong> 的缺漏資料，已存在的數據不會被覆蓋。</li>
                   <li>若匯率為預設值 (30)，AI 會嘗試更新；若您已手動設定其他匯率 (如 31.5)，則不會被覆蓋。</li>
               </ul>
           </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
          <button onClick={onClose} className="px-6 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-white transition">取消</button>
          <button onClick={handleSave} className="px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition shadow-lg">儲存並更新圖表</button>
        </div>
      </div>
    </div>
  );
};

export default HistoricalDataModal;
