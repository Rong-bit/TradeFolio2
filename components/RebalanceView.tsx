
import React, { useEffect, useMemo, useState } from 'react';
import { PortfolioSummary, Holding, Market } from '../types';
import { formatCurrency } from '../utils/calculations';

interface Props {
  summary: PortfolioSummary;
  holdings: Holding[];
  exchangeRate: number;
  targets: Record<string, number>;
  onUpdateTargets: (targets: Record<string, number>) => void;
}

const RebalanceView: React.FC<Props> = ({ summary, holdings, exchangeRate, targets, onUpdateTargets }) => {
  const totalPortfolioValue = summary.totalValueTWD + summary.cashBalanceTWD;
  
  // 追蹤哪些項目需要再平衡（包括現金）
  const [enabledItems, setEnabledItems] = useState<Set<string>>(new Set());
  
  const handleTargetChange = (key: string, val: string) => {
    const num = parseFloat(val);
    onUpdateTargets({
      ...targets,
      [key]: isNaN(num) ? 0 : num
    });
  };

  const handleResetToCurrent = () => {
    const newTargets: Record<string, number> = {};
    holdings.forEach(h => {
      const valTwd = h.market === Market.US ? h.currentValue * exchangeRate : h.currentValue;
      const pct = totalPortfolioValue > 0 ? (valTwd / totalPortfolioValue) * 100 : 0;
      // Key by Account+Ticker to support multi-account holding targets
      const key = `${h.accountId}-${h.ticker}`;
      newTargets[key] = parseFloat(pct.toFixed(1));
    });
    onUpdateTargets(newTargets);
  };
  
  // 初始化：預設所有項目都啟用
  useEffect(() => {
    if (enabledItems.size === 0 && holdings.length > 0) {
      const initialEnabled = new Set<string>();
      holdings.forEach(h => {
        const key = `${h.accountId}-${h.ticker}`;
        initialEnabled.add(key);
      });
      initialEnabled.add('cash'); // 預設現金也啟用
      setEnabledItems(initialEnabled);
    }
  }, [holdings.length, enabledItems.size]);

  // If targets are completely empty, auto-populate with current weights once
  useEffect(() => {
    if (Object.keys(targets).length === 0 && holdings.length > 0) {
      handleResetToCurrent();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdings.length]); // Only check when holdings loaded/changed length, avoid loop

  const handleToggleItem = (key: string) => {
    setEnabledItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  const rebalanceRows = useMemo(() => {
    return holdings.map(h => {
      const valTwd = h.market === Market.US ? h.currentValue * exchangeRate : h.currentValue;
      const currentPct = totalPortfolioValue > 0 ? (valTwd / totalPortfolioValue) * 100 : 0;
      
      const key = `${h.accountId}-${h.ticker}`;
      const isEnabled = enabledItems.has(key);
      const targetPct = isEnabled ? (targets[key] || 0) : 0;
      
      const targetValTwd = totalPortfolioValue * (targetPct / 100);
      const diffValTwd = targetValTwd - valTwd;
      
      let diffShares = 0;
      if (h.currentPrice > 0 && isEnabled) {
        if (h.market === Market.US) {
           diffShares = diffValTwd / exchangeRate / h.currentPrice;
        } else {
           diffShares = diffValTwd / h.currentPrice;
        }
      }

      return {
        ...h,
        valTwd,
        currentPct,
        targetPct,
        targetValTwd,
        diffValTwd,
        diffShares,
        isEnabled
      };
    });
  }, [holdings, targets, totalPortfolioValue, exchangeRate, enabledItems]);

  // Calculate totals - 只計算啟用的項目
  const enabledRows = rebalanceRows.filter(row => {
    const key = `${row.accountId}-${row.ticker}`;
    return enabledItems.has(key);
  });
  const totalTargetPct = enabledRows.reduce((acc, row) => acc + row.targetPct, 0);
  const isCashEnabled = enabledItems.has('cash');
  const cashTargetPct = isCashEnabled ? (100 - totalTargetPct) : 0;
  const targetCashTwd = isCashEnabled ? (totalPortfolioValue * (cashTargetPct / 100)) : summary.cashBalanceTWD;
  const diffCashTwd = isCashEnabled ? (targetCashTwd - summary.cashBalanceTWD) : 0;

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg text-slate-800">個股再平衡 (Stock Rebalancing)</h3>
          <div className="flex flex-col items-end">
             <div className="flex items-center gap-4">
               <button 
                  onClick={handleResetToCurrent}
                  className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-1.5 rounded border border-slate-300 transition"
               >
                 ↺ 帶入目前比重
               </button>
               <div>
                 <p className="text-xs text-slate-500 text-right">總資產 (含現金)</p>
                 <p className="text-xl font-bold font-mono text-slate-800">
                   {formatCurrency(totalPortfolioValue, 'TWD')}
                 </p>
               </div>
             </div>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
              <tr>
                <th className="px-4 py-3 w-12">平衡</th>
                <th className="px-4 py-3">標的 (帳戶)</th>
                <th className="px-4 py-3 text-right">現價</th>
                <th className="px-4 py-3 text-right">現值 (TWD)</th>
                <th className="px-4 py-3 text-right">目前佔比</th>
                <th className="px-4 py-3 text-right w-36">目標佔比 %</th>
                <th className="px-4 py-3 text-right">目標價值</th>
                <th className="px-4 py-3 text-right">調整金額</th>
                <th className="px-4 py-3 text-right">建議操作 (股)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rebalanceRows.map(row => {
                const isBuy = row.diffValTwd > 0;
                const uniqueKey = `${row.accountId}-${row.ticker}`;
                const isEnabled = row.isEnabled;
                return (
                  <tr key={uniqueKey} className={`hover:bg-slate-50 ${!isEnabled ? 'opacity-50' : ''}`}>
                    <td className="px-4 py-3 text-center">
                      <input
                        type="checkbox"
                        checked={isEnabled}
                        onChange={() => handleToggleItem(uniqueKey)}
                        className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                      />
                    </td>
                    <td className="px-4 py-3 font-semibold text-slate-700">
                      <span className={`text-xs px-1.5 py-0.5 rounded mr-2 ${row.market === Market.US ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'}`}>
                        {row.market}
                      </span>
                      {row.ticker}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {row.currentPrice.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 text-right font-mono">
                      {formatCurrency(row.valTwd, 'TWD')}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-500">
                      {row.currentPct.toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end items-center">
                        <input 
                          type="number" 
                          className={`w-24 text-right border-2 rounded px-2 py-1 focus:ring-2 focus:ring-accent focus:border-accent font-bold ${
                            isEnabled 
                              ? 'border-indigo-100 text-slate-700 bg-white' 
                              : 'border-slate-200 text-slate-400 bg-slate-50'
                          }`}
                          value={row.targetPct}
                          onChange={(e) => handleTargetChange(uniqueKey, e.target.value)}
                          step="0.1"
                          min="0"
                          max="100"
                          disabled={!isEnabled}
                        />
                      </div>
                    </td>
                    <td className={`px-4 py-3 text-right ${isEnabled ? 'text-slate-500' : 'text-slate-300'}`}>
                       {formatCurrency(row.targetValTwd, 'TWD')}
                    </td>
                    <td className={`px-4 py-3 text-right font-medium ${isEnabled ? (isBuy ? 'text-red-600' : 'text-green-600') : 'text-slate-300'}`}>
                      {formatCurrency(row.diffValTwd, 'TWD')}
                    </td>
                    <td className={`px-4 py-3 text-right font-bold ${isEnabled ? (isBuy ? 'text-red-600' : 'text-green-600') : 'text-slate-300'}`}>
                      {isEnabled ? (
                        <span>
                          {isBuy ? '買' : '賣'} {Math.abs(row.diffShares).toFixed(row.market === Market.US ? 2 : 0)}
                        </span>
                      ) : (
                        <span className="text-slate-300">-</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              
              {/* Cash Row */}
              <tr className={`bg-slate-50 font-medium border-t-2 border-slate-200 ${!isCashEnabled ? 'opacity-50' : ''}`}>
                <td className="px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={isCashEnabled}
                    onChange={() => handleToggleItem('cash')}
                    className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                </td>
                <td className="px-4 py-3 text-slate-700">現金 (Cash)</td>
                <td className="px-4 py-3 text-right">-</td>
                <td className="px-4 py-3 text-right font-mono">{formatCurrency(summary.cashBalanceTWD, 'TWD')}</td>
                <td className="px-4 py-3 text-right">{((summary.cashBalanceTWD / totalPortfolioValue) * 100).toFixed(1)}%</td>
                <td className={`px-4 py-3 text-right font-bold ${isCashEnabled ? (cashTargetPct < 0 ? 'text-red-500' : 'text-slate-700') : 'text-slate-300'}`}>
                  {isCashEnabled ? cashTargetPct.toFixed(1) : '0.0'}%
                </td>
                <td className={`px-4 py-3 text-right ${isCashEnabled ? '' : 'text-slate-300'}`}>
                  {formatCurrency(targetCashTwd, 'TWD')}
                </td>
                <td className={`px-4 py-3 text-right ${isCashEnabled ? (diffCashTwd > 0 ? 'text-blue-600' : 'text-slate-500') : 'text-slate-300'}`}>
                  {formatCurrency(diffCashTwd, 'TWD')}
                </td>
                <td className="px-4 py-3 text-right text-xs text-slate-400">
                  {isCashEnabled ? '(剩餘資金)' : '(不參與平衡)'}
                </td>
              </tr>
            </tbody>
            <tfoot className="bg-slate-100 font-bold border-t-2 border-slate-300">
               <tr>
                 <td colSpan={5} className="px-4 py-3 text-right">Total (已啟用項目)</td>
                 <td className={`px-4 py-3 text-right ${Math.abs(totalTargetPct + cashTargetPct - 100) > 0.1 ? 'text-red-600' : 'text-slate-800'}`}>
                   {(totalTargetPct + cashTargetPct).toFixed(0)}%
                 </td>
                 <td colSpan={3}></td>
               </tr>
            </tfoot>
          </table>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-800">
           <p className="font-bold mb-1">💡 說明：</p>
           <ul className="list-disc pl-5 space-y-1">
             <li>勾選「平衡」欄位來選擇哪些股債需要再平衡，未勾選的項目將不參與再平衡計算。</li>
             <li>現金部分也可以勾選，若勾選現金，剩餘比例將自動分配給現金；若不勾選，現金將維持現狀。</li>
             <li>目標佔比會自動儲存。若總和不為 100%，剩餘比例將自動分配給已勾選的現金。</li>
             <li>若「現金」目標比例為負值，代表您的股票目標配置超過 100%，請調降部分持股目標。</li>
             <li>點擊「帶入目前比重」可快速重置所有目標值為當前現況。</li>
           </ul>
        </div>
      </div>
    </div>
  );
};

export default RebalanceView;
