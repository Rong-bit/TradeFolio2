
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Transaction, Holding, PortfolioSummary, ChartDataPoint, Market, 
  Account, CashFlow, TransactionType, AssetAllocationItem, 
  AnnualPerformanceItem, AccountPerformance, CashFlowType, Currency, HistoricalData 
} from './types';
import { 
  calculateHoldings, calculateAccountBalances, generateAdvancedChartData, 
  calculateAssetAllocation, calculateAnnualPerformance, calculateAccountPerformance, 
  calculateXIRR 
} from './utils/calculations';
import TransactionForm from './components/TransactionForm';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import FundManager from './components/FundManager';
import RebalanceView from './components/RebalanceView';
import HelpView from './components/HelpView';
import BatchImportModal from './components/BatchImportModal';
import HistoricalDataModal from './components/HistoricalDataModal';
import BatchUpdateMarketModal from './components/BatchUpdateMarketModal';
import AssetAllocationSimulator from './components/AssetAllocationSimulator';
import { fetchCurrentPrices } from './services/yahooFinanceService';
import { ADMIN_EMAIL, SYSTEM_ACCESS_CODE, GLOBAL_AUTHORIZED_USERS } from './config';
import { Language, getLanguage, setLanguage as saveLanguage, t, translate } from './utils/i18n';

type View = 'dashboard' | 'history' | 'funds' | 'accounts' | 'rebalance' | 'simulator' | 'help';

const App: React.FC = () => {
  // --- Auth State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isGuest, setIsGuest] = useState(false);
  const [loginEmail, setLoginEmail] = useState(''); 
  const [loginPassword, setLoginPassword] = useState('');
  const [currentUser, setCurrentUser] = useState(''); 
  
  // --- Core Data State ---
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [priceDetails, setPriceDetails] = useState<Record<string, { change: number, changePercent: number }>>({});
  const [exchangeRate, setExchangeRate] = useState<number>(32.5);
  const [jpyExchangeRate, setJpyExchangeRate] = useState<number>(0.22);
  const [rebalanceTargets, setRebalanceTargets] = useState<Record<string, number>>({});
  const [rebalanceEnabledItems, setRebalanceEnabledItems] = useState<string[]>([]);
  const [historicalData, setHistoricalData] = useState<HistoricalData>({});
  
  // --- UI State ---
  const [view, setView] = useState<View>('dashboard');
  const [language, setLanguage] = useState<Language>(getLanguage());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isHistoricalModalOpen, setIsHistoricalModalOpen] = useState(false);
  const [isBatchUpdateMarketOpen, setIsBatchUpdateMarketOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<Transaction | null>(null);

  // --- Filtering State ---
  const [filterAccount, setFilterAccount] = useState<string>('');
  const [filterTicker, setFilterTicker] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [includeCashFlow, setIncludeCashFlow] = useState<boolean>(true);

  // --- Custom Dialog State ---
  const [alertDialog, setAlertDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    type: 'info' | 'success' | 'error';
  }>({ isOpen: false, title: '', message: '', type: 'info' });

  const [confirmDialog, setConfirmDialog] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning';
  } | null>(null);

  // --- Persistence Logic ---
  useEffect(() => {
    const lastUser = localStorage.getItem('tf_last_user');
    const isAuth = localStorage.getItem('tf_is_auth');
    const guestStatus = localStorage.getItem('tf_is_guest');
    
    if (isAuth === 'true' && lastUser) {
      setCurrentUser(lastUser);
      setIsGuest(guestStatus === 'true');
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    const getKey = (key: string) => `tf_${currentUser}_${key}`;
    
    const load = (key: string, defaultVal: any) => {
        const item = localStorage.getItem(getKey(key));
        return item ? JSON.parse(item) : defaultVal;
    };
    
    setTransactions(load('transactions', []));
    setAccounts(load('accounts', []));
    setCashFlows(load('cashFlows', []));
    setCurrentPrices(load('prices', {}));
    setPriceDetails(load('priceDetails', {}));
    setExchangeRate(parseFloat(localStorage.getItem(getKey('exchangeRate')) || '32.5'));
    setJpyExchangeRate(parseFloat(localStorage.getItem(getKey('jpyExchangeRate')) || '0.22'));
    setHistoricalData(load('historicalData', {}));
    setRebalanceTargets(load('rebalanceTargets', {}));
    setRebalanceEnabledItems(load('rebalanceEnabledItems', []));
  }, [isAuthenticated, currentUser]);

  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    const getKey = (key: string) => `tf_${currentUser}_${key}`;
    localStorage.setItem(getKey('transactions'), JSON.stringify(transactions));
    localStorage.setItem(getKey('accounts'), JSON.stringify(accounts));
    localStorage.setItem(getKey('cashFlows'), JSON.stringify(cashFlows));
    localStorage.setItem(getKey('prices'), JSON.stringify(currentPrices));
    localStorage.setItem(getKey('priceDetails'), JSON.stringify(priceDetails));
    localStorage.setItem(getKey('exchangeRate'), exchangeRate.toString());
    localStorage.setItem(getKey('jpyExchangeRate'), jpyExchangeRate.toString());
    localStorage.setItem(getKey('historicalData'), JSON.stringify(historicalData));
    localStorage.setItem(getKey('rebalanceTargets'), JSON.stringify(rebalanceTargets));
    localStorage.setItem(getKey('rebalanceEnabledItems'), JSON.stringify(rebalanceEnabledItems));
  }, [transactions, accounts, cashFlows, currentPrices, priceDetails, exchangeRate, jpyExchangeRate, historicalData, rebalanceTargets, rebalanceEnabledItems, isAuthenticated, currentUser]);

  // --- Derived Calculations ---
  const baseHoldings = useMemo(() => calculateHoldings(transactions, currentPrices, priceDetails), [transactions, currentPrices, priceDetails]);
  const computedAccounts = useMemo(() => calculateAccountBalances(accounts, cashFlows, transactions), [accounts, cashFlows, transactions]);

  const summary = useMemo<PortfolioSummary>(() => {
    let netInvestedTWD = 0;
    cashFlows.forEach(cf => {
      if (cf.type === CashFlowType.DEPOSIT || cf.type === CashFlowType.WITHDRAW) {
        const account = accounts.find(a => a.id === cf.accountId);
        let rate = 1;
        if (account?.currency === Currency.USD) rate = cf.exchangeRate || exchangeRate;
        else if (account?.currency === Currency.JPY) rate = cf.exchangeRate || jpyExchangeRate;
        
        const amountTWD = cf.amountTWD || (cf.amount * rate);
        if (cf.type === CashFlowType.DEPOSIT) netInvestedTWD += amountTWD;
        else netInvestedTWD -= amountTWD;
      }
    });

    const stockValueTWD = baseHoldings.reduce((sum, h) => {
      let rate = 1;
      if (h.market === Market.US || h.market === Market.UK) rate = exchangeRate;
      else if (h.market === Market.JP) rate = jpyExchangeRate;
      return sum + (h.currentValue * rate);
    }, 0);

    const cashValueTWD = computedAccounts.reduce((sum, a) => {
      let rate = 1;
      if (a.currency === Currency.USD) rate = exchangeRate;
      else if (a.currency === Currency.JPY) rate = jpyExchangeRate;
      return sum + (a.balance * rate);
    }, 0);

    const totalAssets = stockValueTWD + cashValueTWD;
    const totalPLTWD = totalAssets - netInvestedTWD;

    return {
      totalCostTWD: netInvestedTWD,
      totalValueTWD: stockValueTWD,
      totalPLTWD,
      totalPLPercent: netInvestedTWD > 0 ? (totalPLTWD / netInvestedTWD) * 100 : 0,
      cashBalanceTWD: cashValueTWD,
      netInvestedTWD,
      annualizedReturn: calculateXIRR(cashFlows, accounts, totalAssets, exchangeRate),
      exchangeRateUsdToTwd: exchangeRate,
      jpyExchangeRate: jpyExchangeRate,
      accumulatedCashDividendsTWD: 0,
      accumulatedStockDividendsTWD: 0,
      avgExchangeRate: 0
    };
  }, [baseHoldings, computedAccounts, cashFlows, exchangeRate, jpyExchangeRate, accounts]);

  const holdings = useMemo(() => {
    const totalAssets = summary.totalValueTWD + summary.cashBalanceTWD;
    return baseHoldings.map(h => {
      let valTwd = h.currentValue;
      if (h.market === Market.US || h.market === Market.UK) valTwd = h.currentValue * exchangeRate;
      else if (h.market === Market.JP) valTwd = h.currentValue * jpyExchangeRate;
      
      return {
        ...h,
        weight: totalAssets > 0 ? (valTwd / totalAssets) * 100 : 0
      };
    });
  }, [baseHoldings, summary, exchangeRate, jpyExchangeRate]);

  const chartData = useMemo(() => generateAdvancedChartData(transactions, cashFlows, accounts, summary.totalValueTWD + summary.cashBalanceTWD, exchangeRate, historicalData, jpyExchangeRate), [transactions, cashFlows, accounts, summary, exchangeRate, historicalData, jpyExchangeRate]);
  const assetAllocation = useMemo(() => calculateAssetAllocation(holdings, summary.cashBalanceTWD, exchangeRate, jpyExchangeRate), [holdings, summary, exchangeRate, jpyExchangeRate]);
  const annualPerformance = useMemo(() => calculateAnnualPerformance(chartData), [chartData]);
  const accountPerformance = useMemo(() => calculateAccountPerformance(computedAccounts, holdings, cashFlows, transactions, exchangeRate, jpyExchangeRate), [computedAccounts, holdings, cashFlows, transactions, exchangeRate, jpyExchangeRate]);

  // --- Merged Transaction History Logic ---
  const combinedRecords = useMemo(() => {
    const transactionRecords = transactions.map(tx => ({
      id: tx.id, date: tx.date, accountId: tx.accountId, type: 'TRANSACTION' as const, subType: tx.type,
      ticker: tx.ticker, market: tx.market, price: tx.price, quantity: tx.quantity,
      amount: tx.amount || (tx.type === 'BUY' ? tx.price * tx.quantity + tx.fees : tx.price * tx.quantity - tx.fees),
      fees: tx.fees || 0, description: `${tx.market}-${tx.ticker}`
    }));

    const cashFlowRecords: any[] = [];
    cashFlows.forEach(cf => {
      cashFlowRecords.push({
        id: cf.id, date: cf.date, accountId: cf.accountId, type: 'CASHFLOW' as const, subType: cf.type,
        ticker: '', market: '', price: 0, quantity: 0, amount: cf.amount, fees: cf.fee || 0,
        description: cf.note || cf.type, isSource: true
      });
      if (cf.type === 'TRANSFER' && cf.targetAccountId) {
        const targetAmount = cf.exchangeRate ? cf.amount * cf.exchangeRate : cf.amount;
        cashFlowRecords.push({
          id: `${cf.id}-target`, date: cf.date, accountId: cf.targetAccountId, type: 'CASHFLOW' as const,
          subType: 'TRANSFER_IN', ticker: '', market: '', price: 0, quantity: 0, amount: targetAmount,
          fees: 0, description: `轉入自 ${accounts.find(a => a.id === cf.accountId)?.name || '未知'}`
        });
      }
    });

    return [...transactionRecords, ...cashFlowRecords].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
  }, [transactions, cashFlows, accounts]);

  const filteredRecords = useMemo(() => {
    return combinedRecords.filter(r => {
      if (filterAccount && r.accountId !== filterAccount) return false;
      if (!includeCashFlow && r.type === 'CASHFLOW') return false;
      if (filterTicker && r.type === 'TRANSACTION' && !r.ticker.toUpperCase().includes(filterTicker.toUpperCase())) return false;
      if (filterDateFrom && r.date < filterDateFrom) return false;
      if (filterDateTo && r.date > filterDateTo) return false;
      return true;
    });
  }, [combinedRecords, filterAccount, filterTicker, filterDateFrom, filterDateTo, includeCashFlow]);

  // --- Handlers ---
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email) return;

    if (email === ADMIN_EMAIL && loginPassword === SYSTEM_ACCESS_CODE) {
      loginSuccess(email, false);
    } else if (GLOBAL_AUTHORIZED_USERS.includes(email)) {
      loginSuccess(email, false);
    } else {
      loginSuccess(email, true);
      showAlert("進入「非會員模式」：無法使用圖表、年度績效與再平衡功能。", "登入成功", "info");
    }
  };

  const loginSuccess = (user: string, isGuestUser: boolean) => {
    setCurrentUser(user);
    setIsAuthenticated(true);
    setIsGuest(isGuestUser);
    localStorage.setItem('tf_is_auth', 'true');
    localStorage.setItem('tf_last_user', user);
    localStorage.setItem('tf_is_guest', isGuestUser ? 'true' : 'false');
  };

  const handleLogout = () => {
    const translations = t(language);
    setConfirmDialog({
      isOpen: true,
      title: translations.nav.logout,
      message: translations.common.logoutConfirm,
      type: 'warning',
      onConfirm: () => {
        localStorage.removeItem('tf_is_auth');
        localStorage.removeItem('tf_last_user');
        localStorage.removeItem('tf_is_guest');
        setIsAuthenticated(false);
        setCurrentUser('');
        setIsGuest(false);
        setTransactions([]);
        setAccounts([]);
        setCashFlows([]);
        setCurrentPrices({});
        setPriceDetails({});
        setLoginEmail('');
        setLoginPassword('');
        setView('dashboard');
        setConfirmDialog(null);
      }
    });
  };

  const showAlert = (message: string, title = '提示', type: 'info' | 'success' | 'error' = 'info') => {
    setAlertDialog({ isOpen: true, title, message, type });
  };

  const handleAutoUpdate = async () => {
    const tickers = Array.from(new Set(holdings.map(h => h.ticker)));
    const markets = Array.from(new Set(holdings.map(h => h.market as any)));
    try {
      const result = await fetchCurrentPrices(tickers, markets);
      const newPrices: Record<string, number> = {};
      Object.entries(result.prices).forEach(([key, val]) => {
         const h = holdings.find(item => item.ticker === key);
         if (h) newPrices[`${h.market}-${h.ticker}`] = (val as any).price;
      });
      setCurrentPrices(prev => ({ ...prev, ...newPrices }));
      if (result.exchangeRate) setExchangeRate(result.exchangeRate);
      if (result.jpyExchangeRate) setJpyExchangeRate(result.jpyExchangeRate);
      showAlert("股價與匯率已同步更新", "更新成功", "success");
    } catch (e) {
      showAlert("更新失敗，請檢查網路連線", "錯誤", "error");
    }
  };

  const updatePrice = (key: string, price: number) => { 
    setCurrentPrices(p => ({ ...p, [key]: price })); 
  };

  const handleDeleteTransaction = (id: string) => {
    setConfirmDialog({
      isOpen: true,
      title: "刪除交易",
      message: "確定要刪除這筆交易記錄嗎？此操作無法復原。",
      type: 'danger',
      onConfirm: () => {
        setTransactions(prev => prev.filter(t => t.id !== id));
        setConfirmDialog(null);
      }
    });
  };

  const handleClearTransactions = (scope: 'all' | 'ticker' | 'account') => {
    let msg = "確定要清空所有交易紀錄嗎？";
    if (scope === 'ticker') msg = `確定要清空證券「${filterTicker}」的所有交易紀錄嗎？`;
    if (scope === 'account') {
      const name = accounts.find(a => a.id === filterAccount)?.name || "此帳戶";
      msg = `確定要清空帳戶「${name}」的所有交易紀錄嗎？`;
    }

    setConfirmDialog({
      isOpen: true,
      title: "清空紀錄",
      message: msg,
      type: 'danger',
      onConfirm: () => {
        if (scope === 'all') setTransactions([]);
        else if (scope === 'ticker') setTransactions(prev => prev.filter(t => !t.ticker.includes(filterTicker.toUpperCase())));
        else if (scope === 'account') setTransactions(prev => prev.filter(t => t.accountId !== filterAccount));
        setConfirmDialog(null);
        showAlert("已成功清空指定範圍的紀錄", "操作完成", "success");
      }
    });
  };

  const handleSaveHistoricalData = (data: HistoricalData) => {
    setHistoricalData(data);
    showAlert("歷史股價已校正並儲存", "儲存成功", "success");
  };

  const handleBatchUpdateMarket = (updates: { id: string; market: Market }[]) => {
    setTransactions(prev => prev.map(tx => {
      const update = updates.find(u => u.id === tx.id);
      return update ? { ...tx, market: update.market } : tx;
    }));
    showAlert(`已更新 ${updates.length} 筆交易的市場資訊`, "操作成功", "success");
  };

  // --- Render ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in">
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                T
              </div>
              <h1 className="mt-4 text-2xl font-bold text-slate-800">TradeFolio</h1>
              <p className="mt-2 text-slate-500 text-sm">台美日股資產管理系統</p>
            </div>
            <form onSubmit={handleLogin} className="space-y-4">
              <input 
                type="email" required placeholder="Email 信箱" 
                value={loginEmail} onChange={e => setLoginEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              {loginEmail === ADMIN_EMAIL && (
                <input 
                  type="password" placeholder="管理員代碼" 
                  value={loginPassword} onChange={e => setLoginPassword(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              )}
              <button className="w-full bg-slate-900 text-white font-bold py-3 rounded-lg hover:bg-slate-800 transition shadow-lg">登入系統</button>
            </form>

            <div className="mt-8">
              <div className="p-4 bg-blue-50 border-2 border-dashed border-blue-200 rounded-xl text-center">
                  <p className="text-xs font-bold text-blue-900 flex flex-col items-center gap-1">
                      <span className="flex items-center gap-1 text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        {t(language).login.privacy}
                      </span>
                      <span>{t(language).login.privacyDesc}</span>
                  </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const translations = t(language);
  const availableViews: View[] = isGuest 
    ? ['dashboard', 'history', 'funds', 'accounts', 'simulator', 'help']
    : ['dashboard', 'history', 'funds', 'accounts', 'rebalance', 'simulator', 'help'];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
             {/* 手機版漢堡按鈕 */}
             <button 
               onClick={() => setIsMobileMenuOpen(true)}
               className="md:hidden p-2 -ml-2 text-slate-300 hover:text-white transition-colors"
               aria-label="Open Menu"
             >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                </svg>
             </button>

             <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold cursor-pointer" onClick={() => setView('dashboard')}>T</div>
             <nav className="hidden md:flex gap-1">
                {availableViews.map(v => (
                  <button 
                    key={v} onClick={() => setView(v)}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition ${view === v ? 'bg-indigo-600' : 'text-slate-300 hover:bg-slate-800'}`}
                  >
                    {translations.nav[v as keyof typeof translations.nav]}
                  </button>
                ))}
             </nav>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={() => {
               const newLang = language === 'zh-TW' ? 'en' : 'zh-TW';
               setLanguage(newLang);
               saveLanguage(newLang);
             }} className="text-xs bg-slate-800 px-2 py-1 rounded border border-slate-700">
               {language === 'zh-TW' ? 'EN' : '中文'}
             </button>
             <div className="hidden sm:flex items-center bg-slate-800 rounded px-2 py-1 border border-slate-700">
                <span className="text-[10px] text-slate-400 mr-2 font-bold">USD</span>
                <input 
                  type="number" step="0.1" value={exchangeRate} onChange={e => setExchangeRate(parseFloat(e.target.value))}
                  className="w-12 bg-transparent text-sm font-bold text-emerald-400 text-right focus:outline-none"
                />
             </div>
             <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-[10px] font-bold">
                {currentUser.substring(0,2).toUpperCase()}
             </div>
             <button onClick={handleLogout} className="p-2 text-slate-400 hover:text-red-400" title={translations.nav.logout}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                </svg>
             </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-8">
        {view === 'dashboard' && (
          <Dashboard 
            summary={summary} holdings={holdings} chartData={chartData} 
            assetAllocation={assetAllocation} annualPerformance={annualPerformance}
            accountPerformance={accountPerformance} cashFlows={cashFlows} accounts={computedAccounts}
            onUpdatePrice={updatePrice} onAutoUpdate={handleAutoUpdate}
            isGuest={isGuest} onUpdateHistorical={() => setIsHistoricalModalOpen(true)}
            language={language}
          />
        )}

        {view === 'history' && (
           <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow border border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
                 <h2 className="text-xl font-bold">{translations.nav.history}</h2>
                 <div className="flex flex-wrap gap-2">
                    <button onClick={() => setIsBatchUpdateMarketOpen(true)} className="bg-purple-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-md hover:bg-purple-700">批次修改市場</button>
                    <button onClick={() => handleClearTransactions('all')} className="bg-red-50 text-red-600 px-3 py-1.5 rounded text-sm font-bold border border-red-200">清空全部紀錄</button>
                    <button onClick={() => setIsImportOpen(true)} className="bg-indigo-600 text-white px-3 py-1.5 rounded text-sm font-bold shadow-md">批次匯入交易</button>
                    <button onClick={() => setIsFormOpen(true)} className="bg-slate-900 text-white px-4 py-2 rounded text-sm font-bold shadow-lg">新增交易</button>
                 </div>
              </div>

              {/* 篩選與清空特定範圍功能 */}
              <div className="bg-white p-6 rounded-xl shadow border border-slate-100 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">查詢與快速清理</h3>
                  <button onClick={() => { setFilterAccount(''); setFilterTicker(''); }} className="text-xs text-indigo-600 hover:underline">清除篩選</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">帳戶篩選</label>
                    <div className="flex gap-2">
                      <select value={filterAccount} onChange={e => setFilterAccount(e.target.value)} className="flex-1 border rounded p-2 text-sm">
                        <option value="">所有帳戶</option>
                        {accounts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                      </select>
                      {filterAccount && <button onClick={() => handleClearTransactions('account')} className="bg-red-50 text-red-600 px-2 rounded text-xs border border-red-100">清空</button>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 mb-1">代號搜尋</label>
                    <div className="flex gap-2">
                      <input type="text" value={filterTicker} onChange={e => setFilterTicker(e.target.value)} placeholder="例如: 0050" className="flex-1 border rounded p-2 text-sm" />
                      {filterTicker && <button onClick={() => handleClearTransactions('ticker')} className="bg-red-50 text-red-600 px-2 rounded text-xs border border-red-100">清空</button>}
                    </div>
                  </div>
                  <div className="flex items-center pt-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={includeCashFlow} onChange={e => setIncludeCashFlow(e.target.checked)} className="rounded text-indigo-600" />
                      <span className="text-sm text-slate-600">包含現金流</span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow overflow-hidden overflow-x-auto">
                <table className="min-w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase font-medium">
                    <tr>
                      <th className="px-6 py-4">日期</th>
                      <th className="px-6 py-4">標的</th>
                      <th className="px-6 py-4">類別</th>
                      <th className="px-6 py-4 text-right">單價</th>
                      <th className="px-6 py-4 text-right">數量</th>
                      <th className="px-6 py-4 text-right">金額</th>
                      <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.length === 0 ? <tr><td colSpan={7} className="p-10 text-center text-slate-400">尚無符合條件的紀錄</td></tr> :
                      filteredRecords.map(r => (
                        <tr key={r.id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 text-slate-500 whitespace-nowrap">{r.date}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-bold text-slate-700">{r.description}</span>
                              <span className="text-[10px] text-slate-400">{accounts.find(a => a.id === r.accountId)?.name}</span>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold 
                              ${r.subType === 'BUY' ? 'bg-red-50 text-red-600' : 
                                r.subType === 'SELL' ? 'bg-green-50 text-green-600' : 
                                r.subType === 'DEPOSIT' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'}`}>
                              {r.subType}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right font-mono">{r.price > 0 ? r.price.toLocaleString() : '-'}</td>
                          <td className="px-6 py-4 text-right font-mono">{r.quantity > 0 ? r.quantity.toLocaleString() : '-'}</td>
                          <td className="px-6 py-4 text-right font-bold font-mono">
                            {r.amount.toLocaleString(undefined, { maximumFractionDigits: 1 })}
                          </td>
                          <td className="px-6 py-4 text-right">
                             <div className="flex justify-end gap-2">
                               {r.type === 'TRANSACTION' && (
                                 <button onClick={() => { setTransactionToEdit(transactions.find(t => t.id === r.id)!); setIsFormOpen(true); }} className="text-indigo-400 hover:underline">編輯</button>
                               )}
                               <button onClick={() => handleDeleteTransaction(r.id)} className="text-red-400 hover:underline">刪除</button>
                             </div>
                          </td>
                        </tr>
                      ))
                    }
                  </tbody>
                </table>
              </div>
           </div>
        )}

        {view === 'funds' && (
          <FundManager 
            accounts={accounts} cashFlows={cashFlows} onAdd={cf => setCashFlows(p => [...p, cf])}
            onUpdate={cf => setCashFlows(p => p.map(x => x.id === cf.id ? cf : x))}
            onBatchAdd={cfs => setCashFlows(p => [...p, ...cfs])}
            onDelete={id => setConfirmDialog({
              isOpen: true,
              title: "刪除紀錄",
              message: "確定要刪除這筆資金紀錄嗎？",
              type: 'danger',
              onConfirm: () => { setCashFlows(p => p.filter(x => x.id !== id)); setConfirmDialog(null); }
            })}
            onClearAll={() => setConfirmDialog({
              isOpen: true,
              title: "清空全部",
              message: "確定要清空所有入金、出金紀錄嗎？",
              type: 'danger',
              onConfirm: () => { setCashFlows([]); setConfirmDialog(null); }
            })} 
            currentExchangeRate={exchangeRate}
            currentJpyExchangeRate={jpyExchangeRate}
            language={language}
          />
        )}

        {view === 'accounts' && (
          <AccountManager 
            accounts={computedAccounts} onAdd={a => setAccounts(p => [...p, a])}
            onUpdate={a => setAccounts(p => p.map(x => x.id === a.id ? a : x))}
            onDelete={id => removeAccount(id)}
            language={language}
          />
        )}

        {view === 'rebalance' && !isGuest && (
           <RebalanceView 
             summary={summary} holdings={holdings} exchangeRate={exchangeRate}
             jpyExchangeRate={jpyExchangeRate}
             targets={rebalanceTargets} onUpdateTargets={setRebalanceTargets}
             enabledItems={rebalanceEnabledItems} onUpdateEnabledItems={setRebalanceEnabledItems}
             language={language}
           />
        )}

        {view === 'simulator' && <AssetAllocationSimulator language={language} holdings={holdings} />}
        
        {view === 'help' && (
          <HelpView 
            onExport={handleExportData} onImport={handleImportData}
            authorizedUsers={GLOBAL_AUTHORIZED_USERS} currentUser={currentUser} language={language}
          />
        )}
      </main>

      {/* Desktop Footer */}
      <footer className="hidden md:block bg-slate-900 text-slate-400 py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm font-bold">TradeFolio 台美日股資產管家</p>
          <p className="text-[10px] mt-2 opacity-60">
            所有交易數據皆加密儲存於本地端 (LocalStorage)，保障您的隱私與安全。<br/>
            建議定期匯出備份 JSON 檔案，避免瀏覽器清除快取導致資料遺失。
          </p>
        </div>
      </footer>


      {/* Mobile More Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex flex-col justify-end bg-black bg-opacity-50 animate-fade-in" onClick={() => setIsMobileMenuOpen(false)}>
           <div className="bg-slate-900 rounded-t-3xl p-6 pb-24 space-y-4 shadow-2xl transform transition-transform animate-slide-up" onClick={e => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-2">
                 <h3 className="text-white font-bold text-lg">{language === 'zh-TW' ? '功能選單' : 'App Menu'}</h3>
                 <button onClick={() => setIsMobileMenuOpen(false)} className="text-slate-400 text-2xl">&times;</button>
              </div>
              <div className="grid grid-cols-1 gap-2">
                 {/* 在選單中加入所有功能按鈕 */}
                 {availableViews.map(v => (
                   <button 
                    key={v}
                    onClick={() => { setView(v); setIsMobileMenuOpen(false); }}
                    className={`flex items-center gap-3 p-4 rounded-xl text-left transition ${view === v ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300'}`}
                   >
                     <span className="font-bold">{translations.nav[v as keyof typeof translations.nav]}</span>
                   </button>
                 ))}
              </div>
              <button 
                onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                className="w-full flex items-center justify-center gap-2 p-4 rounded-xl bg-red-900/30 text-red-400 font-bold border border-red-900/50"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                {translations.nav.logout}
              </button>
           </div>
        </div>
      )}

      {/* Global Alert Dialog */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 text-center">
            <h3 className={`text-xl font-bold mb-2 ${alertDialog.type === 'error' ? 'text-red-600' : alertDialog.type === 'success' ? 'text-green-600' : 'text-slate-800'}`}>
              {alertDialog.title}
            </h3>
            <p className="text-slate-600 mb-6 text-sm leading-relaxed whitespace-pre-line">{alertDialog.message}</p>
            <button onClick={() => setAlertDialog(p => ({...p, isOpen: false}))} className="w-full bg-slate-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-800 transition">
              確定
            </button>
          </div>
        </div>
      )}

      {/* Global Confirm Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-60 animate-fade-in">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6">
            <h3 className="text-xl font-bold text-slate-800 mb-2">{confirmDialog.title}</h3>
            <p className="text-slate-600 mb-8 text-sm leading-relaxed">{confirmDialog.message}</p>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => setConfirmDialog(null)} className="py-3 px-4 rounded-xl border border-slate-200 text-slate-600 font-bold hover:bg-slate-50 transition">
                取消
              </button>
              <button onClick={confirmDialog.onConfirm} className={`py-3 px-4 rounded-xl text-white font-bold transition shadow-lg ${confirmDialog.type === 'danger' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-200'}`}>
                確認執行
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Existing Modals */}
      {isFormOpen && (
        <TransactionForm 
          accounts={accounts} holdings={holdings}
          onAdd={addTransaction} onUpdate={updateTransaction}
          editingTransaction={transactionToEdit} onClose={() => { setIsFormOpen(false); setTransactionToEdit(null); }}
        />
      )}
      {isImportOpen && <BatchImportModal accounts={accounts} onImport={addBatchTransactions} onClose={() => setIsImportOpen(false)} />}
      {isHistoricalModalOpen && <HistoricalDataModal transactions={transactions} cashFlows={cashFlows} accounts={accounts} historicalData={historicalData} onSave={handleSaveHistoricalData} onClose={() => setIsHistoricalModalOpen(false)} />}
      {isBatchUpdateMarketOpen && <BatchUpdateMarketModal transactions={transactions} onUpdate={handleBatchUpdateMarket} onClose={() => setIsBatchUpdateMarketOpen(false)} />}
    </div>
  );

  function addTransaction(tx: Transaction) { setTransactions(p => [...p, tx]); }
  function updateTransaction(tx: Transaction) { setTransactions(p => p.map(x => x.id === tx.id ? tx : x)); }
  function addBatchTransactions(txs: Transaction[]) { setTransactions(p => [...p, ...txs]); }
  
  function removeAccount(id: string) {
    const acc = accounts.find(a => a.id === id);
    setConfirmDialog({
      isOpen: true,
      title: "刪除帳戶",
      message: `確定要刪除「${acc?.name}」嗎？這不會刪除該帳戶下的歷史交易。`,
      type: 'danger',
      onConfirm: () => { setAccounts(p => p.filter(x => x.id !== id)); setConfirmDialog(null); }
    });
  }

  function handleExportData() {
    const data = { transactions, accounts, cashFlows, currentPrices, priceDetails, exchangeRate, jpyExchangeRate, rebalanceTargets, rebalanceEnabledItems, historicalData };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tradefolio_backup_${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  }

  function handleImportData(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.transactions) setTransactions(data.transactions);
        if (data.accounts) setAccounts(data.accounts);
        if (data.cashFlows) setCashFlows(data.cashFlows);
        if (data.historicalData) setHistoricalData(data.historicalData);
        if (data.exchangeRate) setExchangeRate(data.exchangeRate);
        if (data.jpyExchangeRate) setJpyExchangeRate(data.jpyExchangeRate);
        showAlert("資料已成功還原", "匯入成功", "success");
      } catch(err) { showAlert("檔案格式不正確", "匯入失敗", "error"); }
    };
    reader.readAsText(file);
  }
};

export default App;
