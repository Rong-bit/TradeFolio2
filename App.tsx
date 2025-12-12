import React, { useState, useEffect, useMemo } from 'react';
import { Transaction, Holding, PortfolioSummary, ChartDataPoint, Market, Account, CashFlow, TransactionType, AssetAllocationItem, AnnualPerformanceItem, AccountPerformance, CashFlowType, Currency } from './types';
import { calculateHoldings, calculateAccountBalances, generateAdvancedChartData, calculateAssetAllocation, calculateAnnualPerformance, calculateAccountPerformance } from './utils/calculations';
import TransactionForm from './components/TransactionForm';
import HoldingsTable from './components/HoldingsTable';
import Dashboard from './components/Dashboard';
import AccountManager from './components/AccountManager';
import FundManager from './components/FundManager';
import RebalanceView from './components/RebalanceView';
import HelpView from './components/HelpView';
import BatchImportModal from './components/BatchImportModal';
import { fetchCurrentPrices } from './services/geminiService';

type View = 'dashboard' | 'history' | 'funds' | 'accounts' | 'rebalance' | 'help';

// 全局覆蓋 confirm 函數，在組件外部立即執行
const originalConfirm = window.confirm;
const originalAlert = window.alert;

// 創建全局日誌數組
let globalDebugLogs: string[] = [];
let globalSetDebugLogs: ((logs: string[]) => void) | null = null;

// 立即覆蓋 confirm 函數
window.confirm = function(message?: string): boolean {
  const errorInfo = {
    message: message || '',
    stack: new Error().stack || '',
    timestamp: new Date().toISOString(),
    url: window.location.href
  };
  
  console.error('🚨 CONFIRM() 被調用了！');
  console.error('📍 調用訊息:', message);
  console.error('🕐 調用時間:', errorInfo.timestamp);
  console.error('📋 完整堆疊追蹤:');
  console.error(errorInfo.stack);
  console.error('🌐 當前頁面:', errorInfo.url);
  
  // 嘗試找到調用的具體位置
  const stackLines = errorInfo.stack.split('\n');
  const relevantLine = stackLines.find(line => 
    line.includes('.tsx') || line.includes('.js') || line.includes('handleFileChange')
  );
  if (relevantLine) {
    console.error('📌 可能的調用位置:', relevantLine.trim());
  }
  
  // 保存到全局日誌
  const logEntry = `🚨 CONFIRM() 調用
時間: ${errorInfo.timestamp}
訊息: ${message}
位置: ${relevantLine?.trim() || '未知'}
堆疊: ${errorInfo.stack}`;
  
  globalDebugLogs = [...globalDebugLogs.slice(-9), logEntry];
  if (globalSetDebugLogs) {
    globalSetDebugLogs([...globalDebugLogs]);
  }
  
  // 返回 false 以避免錯誤
  return false;
};

// 覆蓋 alert 函數
window.alert = function(message?: string): void {
  console.warn('⚠️ ALERT() 被調用了！');
  console.warn('📍 調用訊息:', message);
  console.warn('🕐 調用時間:', new Date().toISOString());
  // 不執行原始 alert，避免沙盒錯誤
};

const App: React.FC = () => {
  // --- 連接全局日誌到組件狀態 ---
  useEffect(() => {
    // 設定全局日誌更新函數
    globalSetDebugLogs = setDebugLogs;
    
    // 初始化時設定現有的日誌
    setDebugLogs([...globalDebugLogs]);
    
    return () => {
      globalSetDebugLogs = null;
    };
  }, []);


  // --- State ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginEmail, setLoginEmail] = useState(''); // Changed from loginUser to loginEmail
  const [currentUser, setCurrentUser] = useState(''); // Actual logged-in user (email)
  const [authorizedUsers, setAuthorizedUsers] = useState<string[]>([]); // Whitelist
  
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [cashFlows, setCashFlows] = useState<CashFlow[]>([]);
  const [currentPrices, setCurrentPrices] = useState<Record<string, number>>({});
  const [priceDetails, setPriceDetails] = useState<Record<string, { change: number, changePercent: number }>>({});
  const [exchangeRate, setExchangeRate] = useState<number>(31.5);
  const [rebalanceTargets, setRebalanceTargets] = useState<Record<string, number>>({});
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isMigrationConfirmOpen, setIsMigrationConfirmOpen] = useState(false);
  const [isTransactionDeleteConfirmOpen, setIsTransactionDeleteConfirmOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);
  const [alertDialog, setAlertDialog] = useState<{isOpen: boolean, title: string, message: string, type: 'info' | 'success' | 'error'}>({
    isOpen: false,
    title: '',
    message: '',
    type: 'info'
  });
  const [debugLogs, setDebugLogs] = useState<string[]>([]);
  const [showDebugPanel, setShowDebugPanel] = useState(false);
  const [view, setView] = useState<View>('dashboard');
  
  // 篩選狀態
  const [filterAccount, setFilterAccount] = useState<string>('');
  const [filterTicker, setFilterTicker] = useState<string>('');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');
  const [includeCashFlow, setIncludeCashFlow] = useState<boolean>(true);

  // --- 專門處理 HelpView 的 confirm() 調用 ---
  useEffect(() => {
    if (view === 'help') {
      console.log('🔧 進入 HelpView，設置安全的 confirm 覆蓋');
      
      const tempConfirm = window.confirm;
      window.confirm = (message?: string) => {
        console.log('🛡️ HelpView confirm() 被安全攔截');
        console.log('📍 攔截訊息:', message);
        
        // 對於匯入確認，自動返回 true
        if (message && (message.includes('匯入') || message.includes('覆蓋') || message.includes('警告'))) {
          console.log('✅ 自動確認匯入操作');
          return true;
        }
        
        // 其他確認也自動返回 true
        console.log('✅ 自動確認操作');
        return true;
      };
      
      return () => {
        console.log('🔧 離開 HelpView，恢復原始 confirm 函數');
        window.confirm = tempConfirm;
      };
    }
  }, [view]);

  // --- Initialize Auth List ---
  useEffect(() => {
    const storedUsers = localStorage.getItem('tf_authorized_users');
    if (storedUsers) {
      setAuthorizedUsers(JSON.parse(storedUsers));
    }
  }, []);

  // --- Auth Check ---
  useEffect(() => {
    // Check if a user was previously logged in
    const lastUser = localStorage.getItem('tf_last_user');
    const isAuth = localStorage.getItem('tf_is_auth');
    if (isAuth === 'true' && lastUser) {
      // Re-validate against whitelist just in case permissions were revoked
      // But we need authorizedUsers to be loaded first. 
      // For simplicity, we assume if local session exists, it's valid, 
      // or we could check authorizedUsers if we want strict session revocation.
      setCurrentUser(lastUser);
      setIsAuthenticated(true);
    }
  }, []);

  // --- Persist Auth List ---
  useEffect(() => {
    localStorage.setItem('tf_authorized_users', JSON.stringify(authorizedUsers));
  }, [authorizedUsers]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const email = loginEmail.trim();
    if (!email) {
      showAlert("請輸入 Email 信箱", "登入錯誤", "error");
      return;
    }

    if (authorizedUsers.length === 0) {
      // First user becomes Admin automatically
      const newAuthList = [email];
      setAuthorizedUsers(newAuthList);
      setCurrentUser(email);
      setIsAuthenticated(true);
      localStorage.setItem('tf_is_auth', 'true');
      localStorage.setItem('tf_last_user', email);
      showAlert(`歡迎！您是第一位使用者，已自動設定為系統管理員。\n未來請使用此信箱登入。`, "歡迎使用", "success");
    } else {
      // Check whitelist
      if (authorizedUsers.includes(email)) {
        setCurrentUser(email);
        setIsAuthenticated(true);
        localStorage.setItem('tf_is_auth', 'true');
        localStorage.setItem('tf_last_user', email);
      } else {
        showAlert("此信箱未獲授權，無法登入。\n請聯繫管理員新增權限。", "登入失敗", "error");
      }
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser('');
    setLoginEmail('');
    localStorage.removeItem('tf_is_auth');
    localStorage.removeItem('tf_last_user');
    // Clear state to prevent flashing old data
    setTransactions([]);
    setAccounts([]);
    setCashFlows([]);
  };

  const handleAddAuthorizedUser = (email: string) => {
    if (authorizedUsers.includes(email)) return;
    setAuthorizedUsers([...authorizedUsers, email]);
  };

  const handleRemoveAuthorizedUser = (email: string) => {
    if (email === currentUser) {
      showAlert("無法移除自己的管理權限。", "操作錯誤", "error");
      return;
    }
    setAuthorizedUsers(authorizedUsers.filter(u => u !== email));
  };

  // --- Persistence (Multi-user aware) ---
  useEffect(() => {
    if (!isAuthenticated || !currentUser) return;
    
    // Helper to get namespaced key
    const getKey = (key: string) => `tf_${currentUser}_${key}`;
    const load = (key: string) => JSON.parse(localStorage.getItem(getKey(key)) || '[]');
    
    setTransactions(load('transactions'));
    setAccounts(load('accounts'));
    setCashFlows(load('cashFlows'));
    
    const prices = localStorage.getItem(getKey('prices'));
    if (prices) setCurrentPrices(JSON.parse(prices));

    const pDetails = localStorage.getItem(getKey('priceDetails'));
    if (pDetails) setPriceDetails(JSON.parse(pDetails));
    
    const rate = localStorage.getItem(getKey('exchangeRate'));
    if (rate) setExchangeRate(parseFloat(rate));
    
    const targets = localStorage.getItem(getKey('rebalanceTargets'));
    if (targets) setRebalanceTargets(JSON.parse(targets));
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
    localStorage.setItem(getKey('rebalanceTargets'), JSON.stringify(rebalanceTargets));
  }, [transactions, accounts, cashFlows, currentPrices, priceDetails, exchangeRate, rebalanceTargets, isAuthenticated, currentUser]);

  // --- Legacy Migration ---
  const handleMigrateLegacyData = () => {
    setIsMigrationConfirmOpen(true);
  };

  const confirmMigrateLegacyData = () => {
    setIsMigrationConfirmOpen(false);

    try {
      // Keys used in the single-user version
      const legacyTx = JSON.parse(localStorage.getItem('transactions') || '[]');
      const legacyAcc = JSON.parse(localStorage.getItem('accounts') || '[]');
      const legacyFlows = JSON.parse(localStorage.getItem('cashFlows') || '[]');
      const legacyPrices = JSON.parse(localStorage.getItem('prices') || '{}');
      const legacyPriceDetails = JSON.parse(localStorage.getItem('priceDetails') || '{}');
      const legacyRate = localStorage.getItem('exchangeRate');
      const legacyTargets = JSON.parse(localStorage.getItem('rebalanceTargets') || '{}');

      if (legacyTx.length === 0 && legacyAcc.length === 0) {
        showAlert("找不到舊版資料 (LocalStorage 為空)。", "匯入失敗", "error");
        return;
      }

      setTransactions(legacyTx);
      setAccounts(legacyAcc);
      setCashFlows(legacyFlows);
      setCurrentPrices(legacyPrices);
      setPriceDetails(legacyPriceDetails);
      if (legacyRate) setExchangeRate(parseFloat(legacyRate));
      setRebalanceTargets(legacyTargets);

      showAlert(`匯入成功！\n共匯入 ${legacyTx.length} 筆交易、${legacyAcc.length} 個帳戶。`, "匯入成功", "success");
    } catch (e) {
      console.error(e);
      showAlert("匯入失敗：舊版資料格式可能不符。", "匯入失敗", "error");
    }
  };

  const cancelMigrateLegacyData = () => {
    setIsMigrationConfirmOpen(false);
  };

  // 自定義 alert 函數
  const showAlert = (message: string, title: string = '提示', type: 'info' | 'success' | 'error' = 'info') => {
    setAlertDialog({
      isOpen: true,
      title,
      message,
      type
    });
  };

  const closeAlert = () => {
    setAlertDialog(prev => ({ ...prev, isOpen: false }));
  };

  // --- Handlers ---
  const addTransaction = (tx: Transaction) => {
    setTransactions(prev => [...prev, tx]);
    const key = `${tx.market}-${tx.ticker}`;
    if (!currentPrices[key]) updatePrice(key, tx.price);
  };

  const addBatchTransactions = (txs: Transaction[]) => {
    setTransactions(prev => [...prev, ...txs]);
    const newPrices = { ...currentPrices };
    txs.forEach(tx => {
      const key = `${tx.market}-${tx.ticker}`;
      if (!newPrices[key] && tx.price > 0) {
        newPrices[key] = tx.price;
      }
    });
    setCurrentPrices(newPrices);
  };

  const removeTransaction = (id: string) => {
    setTransactionToDelete(id);
    setIsTransactionDeleteConfirmOpen(true);
  };

  const confirmRemoveTransaction = () => {
    if (transactionToDelete) {
      setTransactions(prev => prev.filter(t => t.id !== transactionToDelete));
      showAlert("交易記錄已刪除", "刪除成功", "success");
    }
    setIsTransactionDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };

  const cancelRemoveTransaction = () => {
    setIsTransactionDeleteConfirmOpen(false);
    setTransactionToDelete(null);
  };
  
  const handleClearAllTransactions = () => {
    console.log("handleClearAllTransactions 被呼叫"); // 除錯用
    setIsDeleteConfirmOpen(true);
  };

  const confirmDeleteAllTransactions = () => {
    console.log("確認刪除所有交易紀錄，目前筆數:", transactions.length);
    const count = transactions.length;
    setTransactions([]);
    setIsDeleteConfirmOpen(false);
    
    setTimeout(() => {
      showAlert(`✅ 成功清空 ${count} 筆交易紀錄！`, "刪除成功", "success");
    }, 100);
  };

  const cancelDeleteAllTransactions = () => {
    console.log("使用者取消了刪除操作");
    setIsDeleteConfirmOpen(false);
  };
  
  const addAccount = (acc: Account) => setAccounts(prev => [...prev, acc]);
  // 包裝刪除函數，避免使用 confirm()
  const removeAccount = (id: string) => {
    const account = accounts.find(a => a.id === id);
    const accountName = account?.name || '未知帳戶';
    console.log('🚨 removeAccount 被調用，帳戶:', accountName);
    // 直接刪除，不使用 confirm()
    setAccounts(prev => prev.filter(a => a.id !== id));
    showAlert(`帳戶「${accountName}」已刪除`, "刪除成功", "success");
  };
  
  const addCashFlow = (cf: CashFlow) => setCashFlows(prev => [...prev, cf]);
  const addBatchCashFlows = (cfs: CashFlow[]) => setCashFlows(prev => [...prev, ...cfs]);
  
  const removeCashFlow = (id: string) => {
    const cashFlow = cashFlows.find(c => c.id === id);
    const flowInfo = cashFlow ? `${cashFlow.type} ${cashFlow.amount}` : '未知現金流';
    console.log('🚨 removeCashFlow 被調用，現金流:', flowInfo);
    // 直接刪除，不使用 confirm()
    setCashFlows(prev => prev.filter(c => c.id !== id));
    showAlert(`現金流「${flowInfo}」已刪除`, "刪除成功", "success");
  };

  const updatePrice = (key: string, price: number) => setCurrentPrices(prev => ({ ...prev, [key]: price }));

  const updateRebalanceTargets = (newTargets: Record<string, number>) => setRebalanceTargets(newTargets);

  // --- Data Backup / Restore ---
  const handleExportData = () => {
    const data = {
      version: "2.0",
      user: currentUser,
      timestamp: new Date().toISOString(),
      transactions,
      accounts,
      cashFlows,
      currentPrices,
      priceDetails,
      exchangeRate,
      rebalanceTargets
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tradefolio_${currentUser}_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // 安全的文件導入處理函數
  const handleImportData = (file: File) => {
    console.log('🔄 handleImportData 被調用，文件:', file.name);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const data = JSON.parse(text);
        
        // Basic validation
        if (!data.transactions && !data.accounts) {
          throw new Error("Invalid format");
        }

        if (data.accounts) setAccounts(data.accounts);
        if (data.transactions) setTransactions(data.transactions);
        if (data.cashFlows) setCashFlows(data.cashFlows);
        if (data.currentPrices) setCurrentPrices(data.currentPrices);
        if (data.priceDetails) setPriceDetails(data.priceDetails);
        if (data.exchangeRate) setExchangeRate(data.exchangeRate);
        if (data.rebalanceTargets) setRebalanceTargets(data.rebalanceTargets);

        showAlert(`成功還原 ${currentUser} 的資料！\n交易: ${data.transactions?.length || 0} 筆\n帳戶: ${data.accounts?.length || 0} 個`, "還原成功", "success");
      } catch (err) {
        console.error('文件導入錯誤:', err);
        showAlert("匯入失敗：檔案格式錯誤或損毀。", "匯入失敗", "error");
      }
    };
    reader.readAsText(file);
  };

  const handleAutoUpdatePrices = async () => {
    const holdingKeys = holdings.map(h => ({
       market: h.market,
       ticker: h.ticker, 
       key: `${h.market}-${h.ticker}` 
    }));

    const queryList: string[] = [];
    const queryToKeyMap: Record<string, string> = {};

    holdingKeys.forEach(h => {
       let queryTicker = h.ticker;
       if (h.market === Market.TW && !queryTicker.includes('TPE:')) {
          queryTicker = `TPE:${queryTicker}`;
       }
       if (h.market === Market.TW && /^\d{4}$/.test(queryTicker)) {
          queryTicker = `TPE:${queryTicker}`;
       }
       
       queryList.push(queryTicker);
       queryToKeyMap[queryTicker] = h.key;
       if(queryTicker.startsWith("TPE:")) {
         queryToKeyMap[queryTicker.replace("TPE:", "")] = h.key;
       }
    });

    const uniqueQueries = Array.from(new Set(queryList));
    if (uniqueQueries.length === 0) return;

    try {
      const result = await fetchCurrentPrices(uniqueQueries);
      
      // 1. 更新股價
      setCurrentPrices(prev => {
        const updated = { ...prev };
        Object.entries(result.prices).forEach(([returnedTicker, priceData]) => {
           // Handle case where fetchCurrentPrices returns objects {price, change, ...} but state expects numbers
           const price = (priceData as any).price ?? priceData;
           
           const internalKey = queryToKeyMap[returnedTicker] || queryToKeyMap[`TPE:${returnedTicker}`];
           if (internalKey) {
             updated[internalKey] = typeof price === 'number' ? price : 0;
           } else {
             if (prev[`US-${returnedTicker}`] !== undefined) updated[`US-${returnedTicker}`] = typeof price === 'number' ? price : 0;
             if (prev[`TW-${returnedTicker}`] !== undefined) updated[`TW-${returnedTicker}`] = typeof price === 'number' ? price : 0;
             if (prev[`TW-TPE:${returnedTicker}`] !== undefined) updated[`TW-TPE:${returnedTicker}`] = typeof price === 'number' ? price : 0;
           }
        });
        return updated;
      });
      
      // 2. 更新詳細價格資料 (漲跌)
      setPriceDetails(prev => {
         const updated = { ...prev };
         Object.entries(result.prices).forEach(([returnedTicker, priceData]) => {
            const data = priceData as any;
            if (typeof data === 'object' && data.change !== undefined) {
               const internalKey = queryToKeyMap[returnedTicker] || queryToKeyMap[`TPE:${returnedTicker}`];
               if (internalKey) {
                 updated[internalKey] = { change: data.change, changePercent: data.changePercent };
               } else {
                 if (currentPrices[`US-${returnedTicker}`] !== undefined) updated[`US-${returnedTicker}`] = { change: data.change, changePercent: data.changePercent };
                 if (currentPrices[`TW-${returnedTicker}`] !== undefined) updated[`TW-${returnedTicker}`] = { change: data.change, changePercent: data.changePercent };
               }
            }
         });
         return updated;
      });

      // 3. 更新匯率 (如果 AI 有回傳)
      if (result.exchangeRate && result.exchangeRate > 0) {
        setExchangeRate(result.exchangeRate);
      }

    } catch (e) {
      console.error(e);
      throw e;
    }
  };

  // --- 篩選邏輯（整合交易和現金流） - 重新設計 ---
  const combinedRecords = useMemo(() => {
    // 將交易記錄轉換為統一格式
    const transactionRecords = transactions.map(tx => {
      // 優先使用提供的金額欄位，否則根據交易類型計算
      let calculatedAmount = 0;
      if ((tx as any).amount !== undefined && (tx as any).amount !== null) {
        calculatedAmount = (tx as any).amount;
      } else {
        // 根據交易類型計算金額
        if (tx.type === TransactionType.BUY || tx.type === TransactionType.TRANSFER_OUT) {
          // 買入或轉出：價格 × 數量 + 手續費（支出）
          calculatedAmount = tx.price * tx.quantity + (tx.fees || 0);
        } else if (tx.type === TransactionType.SELL) {
          // 賣出：價格 × 數量 - 手續費（收入）
          calculatedAmount = tx.price * tx.quantity - (tx.fees || 0);
        } else {
          // 股息、轉入等：價格 × 數量（收入）
          calculatedAmount = tx.price * tx.quantity;
        }
      }
      
      return {
        id: tx.id,
        date: tx.date,
        accountId: tx.accountId,
        type: 'TRANSACTION' as const,
        subType: tx.type,
        ticker: tx.ticker,
        market: tx.market,
        price: tx.price,
        quantity: tx.quantity,
        amount: calculatedAmount,
        fees: tx.fees || 0,
        description: `${tx.market}-${tx.ticker}`,
        originalRecord: tx
      };
    });

    // 將現金流記錄轉換為統一格式
    const cashFlowRecords: any[] = [];
    
    cashFlows.forEach(cf => {
      // 來源帳戶記錄（支出）
      cashFlowRecords.push({
        id: cf.id,
        date: cf.date,
        accountId: cf.accountId,
        type: 'CASHFLOW' as const,
        subType: cf.type,
        ticker: '',
        market: '',
        price: 0,
        quantity: 0,
        amount: cf.amount,
        fees: 0,
        description: cf.note || cf.type,
        originalRecord: cf,
        targetAccountId: cf.targetAccountId,
        exchangeRate: cf.exchangeRate,
        isSourceRecord: true
      });
      
      // 如果是轉帳，為目標帳戶創建對應的收入記錄
      if (cf.type === 'TRANSFER' && cf.targetAccountId) {
        const targetAccount = accounts.find(a => a.id === cf.targetAccountId);
        const targetAmount = cf.exchangeRate ? cf.amount * cf.exchangeRate : cf.amount;
        
        cashFlowRecords.push({
          id: `${cf.id}-target`,
          date: cf.date,
          accountId: cf.targetAccountId,
          type: 'CASHFLOW' as const,
          subType: 'TRANSFER_IN' as const,
          ticker: '',
          market: '',
          price: 0,
          quantity: 0,
          amount: targetAmount,
          fees: 0,
          description: `轉入自 ${accounts.find(a => a.id === cf.accountId)?.name || '未知帳戶'}`,
          originalRecord: cf,
          sourceAccountId: cf.accountId,
          exchangeRate: cf.exchangeRate,
          isTargetRecord: true
        });
      }
    });

    // === 第一步：按顯示順序排列（日期倒序 + 同日內按類型排序） ===
    const displayOrderRecords = [...transactionRecords, ...cashFlowRecords].sort((a, b) => {
      // 日期倒序：最新日期在上
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (dateA !== dateB) {
        return dateB - dateA;
      }
      
      // 同日內按顯示類型排序：提款 → 買入 → 股息 → 賣出 → 存款
      const getDisplayTypeOrder = (record: any) => {
        if (record.type === 'CASHFLOW') {
          if (record.subType === 'WITHDRAW') return 1;
          if (record.subType === 'TRANSFER') return 1;
          if (record.subType === 'INTEREST') return 3;
          if (record.subType === 'DEPOSIT') return 5;
          if (record.subType === 'TRANSFER_IN') return 5;
        }
        if (record.type === 'TRANSACTION') {
          if (record.subType === 'BUY') return 2;
          if (record.subType === 'CASH_DIVIDEND' || record.subType === 'DIVIDEND') return 3;
          if (record.subType === 'INTEREST') return 3;
          if (record.subType === 'SELL') return 4;
        }
        return 6;
      };
      
      const orderA = getDisplayTypeOrder(a);
      const orderB = getDisplayTypeOrder(b);
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // 同類型按ID排序
      const getNumericId = (id: string) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      
      return getNumericId(a.id.toString()) - getNumericId(b.id.toString());
    });

    // === 第二步：按時間正序 + 同日內按邏輯順序計算餘額 ===
    
    // 計算每筆記錄的餘額變化
    const calculateBalanceChange = (record: any) => {
      let balanceChange = 0;
      
      if (record.type === 'TRANSACTION') {
        const tx = record.originalRecord as Transaction;
        // 優先使用 record.amount（已正確計算），否則計算
        const recordAmount = record.amount !== undefined && record.amount !== null 
          ? record.amount 
          : (tx.price * tx.quantity + (tx.fees || 0));
        
        if (tx.type === TransactionType.BUY) {
          // 買入：支出金額（負數），amount 已包含手續費
          balanceChange = -recordAmount;
        } else if (tx.type === TransactionType.SELL) {
          // 賣出：價格 × 數量 - 手續費（收入）
          balanceChange = recordAmount;
        } else if (tx.type === TransactionType.CASH_DIVIDEND) {
          // 現金股息：收入金額（正數）
          balanceChange = recordAmount;
        } else if (tx.type === TransactionType.DIVIDEND) {
          // 股票股息/再投入：不影響現金餘額（股數增加但現金不變，或者視為現金進出相抵）
          balanceChange = 0;
        } else if (tx.type === TransactionType.TRANSFER_IN) {
          balanceChange = recordAmount;
        } else if (tx.type === TransactionType.TRANSFER_OUT) {
          balanceChange = -recordAmount;
        } else if (tx.type === 'INTEREST' as any) {
          balanceChange = recordAmount;
        }
      } else if (record.type === 'CASHFLOW') {
        if (record.subType === 'DEPOSIT') {
          balanceChange = record.amount;
        } else if (record.subType === 'WITHDRAW') {
          balanceChange = -record.amount;
        } else if (record.subType === 'TRANSFER') {
          balanceChange = -record.amount;
        } else if (record.subType === 'TRANSFER_IN') {
          balanceChange = record.amount;
        } else if (record.subType === 'INTEREST') {
          balanceChange = record.amount;
        }
      }
      
      return balanceChange;
    };
    
    // 按時間正序 + 同日內按邏輯順序排列（用於計算餘額）
    const timeOrderRecords = [...displayOrderRecords].sort((a, b) => {
      // 時間正序：最早日期在前
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (dateA !== dateB) {
        return dateA - dateB;
      }
      
      // 同日內按邏輯順序：存款 → 股息 → 賣出 → 買入 → 提款
      const getCalculationTypeOrder = (record: any) => {
        if (record.type === 'CASHFLOW') {
          if (record.subType === 'DEPOSIT') return 1;
          if (record.subType === 'TRANSFER_IN') return 1;
          if (record.subType === 'INTEREST') return 2;
          if (record.subType === 'WITHDRAW') return 5;
          if (record.subType === 'TRANSFER') return 5;
        }
        if (record.type === 'TRANSACTION') {
          if (record.subType === 'CASH_DIVIDEND' || record.subType === 'DIVIDEND') return 2;
          if (record.subType === 'INTEREST') return 2;
          if (record.subType === 'SELL') return 3;
          if (record.subType === 'BUY') return 4;
        }
        return 6;
      };
      
      const orderA = getCalculationTypeOrder(a);
      const orderB = getCalculationTypeOrder(b);
      
      if (orderA !== orderB) {
        return orderA - orderB;
      }
      
      // 同類型按ID倒序排序（計算順序：ID大的先算，確保正確的時間順序）
      const getNumericId = (id: string) => {
        const match = id.match(/\d+/);
        return match ? parseInt(match[0]) : 0;
      };
      
      return getNumericId(b.id.toString()) - getNumericId(a.id.toString());
    });
    
    // 按時間順序計算餘額
    const accountBalances: Record<string, number> = {};
    const balanceMap = new Map<string, number>();
    
    timeOrderRecords.forEach(record => {
      const accountId = record.accountId;
      const balanceChange = calculateBalanceChange(record);
      
      if (!(accountId in accountBalances)) {
        accountBalances[accountId] = 0;
      }
      
      accountBalances[accountId] += balanceChange;
      balanceMap.set(record.id, accountBalances[accountId]);
    });
    
    // === 第三步：將正確的餘額映射回顯示順序的記錄 ===
    return displayOrderRecords.map(record => ({
      ...record,
      balance: balanceMap.get(record.id) || 0,
      balanceChange: calculateBalanceChange(record)
    }));

  }, [transactions, cashFlows]);

  const filteredRecords = useMemo(() => {
    // 如果有帳戶篩選，需要重新計算該帳戶的餘額
    if (filterAccount) {
      // 獲取該帳戶的所有記錄（不考慮其他篩選條件）
      const accountRecords = combinedRecords.filter(record => record.accountId === filterAccount);
      
      // 按時間正序 + 同日內按邏輯順序排列（用於計算餘額）
      const sortedAccountRecords = [...accountRecords].sort((a, b) => {
        // 時間正序：最早日期在前
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        if (dateA !== dateB) {
          return dateA - dateB;
        }
        
        // 同日內按邏輯順序：存款 → 股息 → 賣出 → 買入 → 提款
        const getCalculationTypeOrder = (record: any) => {
          if (record.type === 'CASHFLOW') {
            if (record.subType === 'DEPOSIT') return 1;
            if (record.subType === 'TRANSFER_IN') return 1;
            if (record.subType === 'INTEREST') return 2;
            if (record.subType === 'WITHDRAW') return 5;
            if (record.subType === 'TRANSFER') return 5;
          }
          if (record.type === 'TRANSACTION') {
            if (record.subType === 'CASH_DIVIDEND' || record.subType === 'DIVIDEND') return 2;
            if (record.subType === 'INTEREST') return 2;
            if (record.subType === 'SELL') return 3;
            if (record.subType === 'BUY') return 4;
          }
          return 6;
        };
        
        const orderA = getCalculationTypeOrder(a);
        const orderB = getCalculationTypeOrder(b);
        
        if (orderA !== orderB) {
          return orderA - orderB;
        }
        
        // 同類型按ID倒序排序（計算順序：ID大的先算）
        const getNumericId = (id: string) => {
          const match = id.match(/\d+/);
          return match ? parseInt(match[0]) : 0;
        };
        
        return getNumericId(b.id.toString()) - getNumericId(a.id.toString());
      });
      
      // 重新計算該帳戶的餘額
      let accountBalance = 0;
      const recalculatedRecords = sortedAccountRecords.map(record => {
        // 使用正確的 balanceChange 計算
        const balanceChange = (record as any).balanceChange || 0;
        accountBalance += balanceChange;
        return {
          ...record,
          balance: accountBalance
        };
      });
      
      // 創建餘額映射
      const accountBalanceMap = new Map();
      recalculatedRecords.forEach(record => {
        accountBalanceMap.set(record.id, record.balance);
      });
      
      // 應用其他篩選條件
      const finalFiltered = recalculatedRecords.filter(record => {
        // 現金流篩選
        if (!includeCashFlow && record.type === 'CASHFLOW') {
          return false;
        }
        
        // 股票代號篩選
        if (filterTicker && record.type === 'TRANSACTION') {
          if (!record.ticker.toLowerCase().includes(filterTicker.toLowerCase())) {
            return false;
          }
        }
        
        // 日期範圍篩選
        const recordDate = new Date(record.date);
        if (filterDateFrom && recordDate < new Date(filterDateFrom)) {
          return false;
        }
        if (filterDateTo && recordDate > new Date(filterDateTo)) {
          return false;
        }
        
        return true;
      });
      
      // 返回按日期倒序排列，同日記錄按餘額倒序
      return finalFiltered.sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        
        if (dateA !== dateB) {
          return dateB - dateA; // 日期倒序：最新日期在上面
        }
        
        // 同一天的記錄：按您指定的順序排序
        const getTypeOrder = (record: any) => {
          if (record.type === 'CASHFLOW') {
            if (record.subType === 'WITHDRAW') return 1;  // 提款 - 最上
            if (record.subType === 'TRANSFER') return 1;
          }
          if (record.type === 'TRANSACTION') {
            if (record.subType === 'BUY') return 2;       // 買入 - 上面
            if (record.subType === 'CASH_DIVIDEND' || record.subType === 'DIVIDEND') return 3; // 股息 - 中間
            if (record.subType === 'INTEREST') return 3;  // 利息 - 中間
            if (record.subType === 'SELL') return 4;      // 賣出 - 其次
          }
          if (record.type === 'CASHFLOW') {
            if (record.subType === 'INTEREST') return 3;  // 利息 - 中間
            if (record.subType === 'DEPOSIT') return 5;   // 存款 - 最後在下面
            if (record.subType === 'TRANSFER_IN') return 5;
          }
          return 6;
        };
        
        const typeOrderA = getTypeOrder(a);
        const typeOrderB = getTypeOrder(b);
        
        if (typeOrderA !== typeOrderB) {
          return typeOrderA - typeOrderB;
        }
        
        // 同類型記錄按ID排序確保一致性
        const getIdForSort = (record: any) => {
          const id = record.id.toString();
          const numMatch = id.match(/^\d+$/);
          if (numMatch) {
            return { type: 'number', value: parseInt(id) };
          }
          const mixedMatch = id.match(/\d+/);
          if (mixedMatch) {
            return { type: 'mixed', value: parseInt(mixedMatch[0]), original: id };
          }
          return { type: 'string', value: id };
        };
        
        const idA = getIdForSort(a);
        const idB = getIdForSort(b);
        
        if (idA.type === idB.type) {
          if (idA.type === 'number' || idA.type === 'mixed') {
            return (idA.value as number) - (idB.value as number);
          }
          return (idA.value as string).localeCompare(idB.value as string);
        }
        
        // Fix: Add explicit index signature to typeOrder to avoid TS7053
        const typeOrder: Record<string, number> = { 'number': 1, 'mixed': 2, 'string': 3 };
        return (typeOrder[idA.type] || 0) - (typeOrder[idB.type] || 0);
      }).map(record => ({
        ...record,
        balance: accountBalanceMap.get(record.id) // 恢復正確的餘額
      }));
    }
    
    // 沒有帳戶篩選時的一般篩選邏輯
    const filtered = combinedRecords.filter(record => {
      // 現金流篩選
      if (!includeCashFlow && record.type === 'CASHFLOW') {
        return false;
      }
      
      // 股票代號篩選
      if (filterTicker && record.type === 'TRANSACTION') {
        if (!record.ticker.toLowerCase().includes(filterTicker.toLowerCase())) {
          return false;
        }
      }
      
      // 日期範圍篩選
      const recordDate = new Date(record.date);
      if (filterDateFrom && recordDate < new Date(filterDateFrom)) {
        return false;
      }
      if (filterDateTo && recordDate > new Date(filterDateTo)) {
        return false;
      }
      
      return true;
    });
    
    return filtered;
  }, [combinedRecords, filterAccount, filterTicker, filterDateFrom, filterDateTo, includeCashFlow]);

  // 清除篩選器
  const clearFilters = () => {
    setFilterAccount('');
    setFilterTicker('');
    setFilterDateFrom('');
    setFilterDateTo('');
    setIncludeCashFlow(true); // 重置為預設包含現金流
  };

  // --- Calculations ---
  
  // 1. Calculate Account Balances (Cash)
  const accountsWithBalance = useMemo(() => calculateAccountBalances(accounts, cashFlows, transactions), [accounts, cashFlows, transactions]);
  
  // 2. Calculate Initial Holdings (without Weights)
  const baseHoldings: Holding[] = useMemo(() => calculateHoldings(transactions, currentPrices, priceDetails), [transactions, currentPrices, priceDetails]);

  // 3. Calculate Total Portfolio Value for Weights
  const totalAssetsTWD = useMemo(() => {
    let stockVal = 0;
    baseHoldings.forEach(h => {
       const v = h.market === Market.US ? h.currentValue * exchangeRate : h.currentValue;
       stockVal += v;
    });
    let cashVal = 0;
    accountsWithBalance.forEach(acc => {
       const v = acc.balance * (acc.currency === 'USD' ? exchangeRate : 1);
       cashVal += v;
    });
    return stockVal + cashVal;
  }, [baseHoldings, accountsWithBalance, exchangeRate]);

  // 4. Enrich Holdings with Weights
  const holdings: Holding[] = useMemo(() => {
    return baseHoldings.map(h => {
       const valTwd = h.market === Market.US ? h.currentValue * exchangeRate : h.currentValue;
       const weight = totalAssetsTWD > 0 ? (valTwd / totalAssetsTWD) * 100 : 0;
       return { ...h, weight };
    });
  }, [baseHoldings, totalAssetsTWD, exchangeRate]);

  // 5. Portfolio Summary
  const summary: PortfolioSummary = useMemo(() => {
    let totalValueTWD = 0;
    holdings.forEach(h => {
      const isUS = h.market === Market.US;
      const value = isUS ? h.currentValue * exchangeRate : h.currentValue;
      totalValueTWD += value;
    });

    let cashBalanceTWD = 0;
    accountsWithBalance.forEach(acc => {
       const balance = acc.balance * (acc.currency === 'USD' ? exchangeRate : 1);
       cashBalanceTWD += balance;
    });

    // Update: Calculate Net Invested based on Cash Flows (Deposits - Withdrawals) to match Fund Management
    // 原本是根據交易計算 (Buy - Sell)，現在改為根據資金流向 (Deposit - Withdraw)
    // 注意：根據使用者要求，這裡嚴格只計算匯入(DEPOSIT)減去匯出(WITHDRAW)
    // 轉帳(TRANSFER)和利息(INTEREST)不計入淨投入成本
    const netInvestedTWD = cashFlows.reduce((acc, cf) => {
      const account = accounts.find(a => a.id === cf.accountId);
      
      // Safety check: if account deleted or not found, skip or assume default (TWD)
      if (!account) return acc;
      
      const isUSD = account.currency === Currency.USD;
      const rate = isUSD ? exchangeRate : 1;
      
      const amountTWD = cf.amount * rate;
      
      if (cf.type === CashFlowType.DEPOSIT) {
        return acc + amountTWD;
      } else if (cf.type === CashFlowType.WITHDRAW) {
        return acc - amountTWD;
      }
      // Transfers are internal movements, Interest is income (not invested capital)
      return acc;
    }, 0);

    const totalAssets = totalValueTWD + cashBalanceTWD;
    const totalPLTWD = totalAssets - netInvestedTWD;

    // 計算年化收益率：優先使用資金匯入日期
    const depositFlows = cashFlows.filter(c => c.type === CashFlowType.DEPOSIT);
    const dates = depositFlows.length > 0 
      ? depositFlows.map(c => new Date(c.date).getTime())
      : transactions.filter(tx => tx.type === TransactionType.BUY).map(tx => new Date(tx.date).getTime());
      
    let annualizedReturn = 0;
    if (dates.length > 0 && netInvestedTWD > 0) {
       const minDate = Math.min(...dates);
       const days = (new Date().getTime() - minDate) / (1000 * 3600 * 24);
       const years = days / 365.25;
       if (years > 0.1) {
          if (totalAssets > 0) {
             annualizedReturn = (Math.pow(totalAssets / netInvestedTWD, 1 / years) - 1) * 100;
          }
       }
    }

    let accumulatedCashDividendsTWD = 0;
    let accumulatedStockDividendsTWD = 0;
    transactions.forEach(tx => {
       const isUS = tx.market === Market.US;
       const rate = isUS ? exchangeRate : 1;
       const total = (tx.price * tx.quantity) - (tx.fees || 0);
       
       if (tx.type === TransactionType.CASH_DIVIDEND) {
          accumulatedCashDividendsTWD += (total * rate);
       } else if (tx.type === TransactionType.DIVIDEND) {
          accumulatedStockDividendsTWD += (total * rate);
       }
    });

    let totalUsdBought = 0;
    let totalTwdCost = 0;

    cashFlows.forEach(cf => {
       const acc = accounts.find(a => a.id === cf.accountId);
       
       // 1. DEPOSIT into USD Account
       if (cf.type === CashFlowType.DEPOSIT && acc?.currency === Currency.USD && cf.exchangeRate && cf.exchangeRate > 0) {
          totalUsdBought += cf.amount; 
          // Assuming fee is in TWD for USD deposits as per FundManager label
          totalTwdCost += (cf.amount * cf.exchangeRate) + (cf.fee || 0);
       }

       // 2. TRANSFER into USD Account from TWD Account
       if (cf.type === CashFlowType.TRANSFER && cf.targetAccountId) {
           const targetAcc = accounts.find(a => a.id === cf.targetAccountId);
           // Check if Source is TWD and Target is USD
           if (targetAcc?.currency === Currency.USD && acc?.currency === Currency.TWD && cf.exchangeRate && cf.exchangeRate > 0) {
              // cf.amount is TWD (Source Currency).
              // USD Bought = TWD Amount / Rate
              const usdAmount = cf.amount / cf.exchangeRate;
              totalUsdBought += usdAmount;
              // TWD Cost includes fee (if fee is TWD on source)
              totalTwdCost += cf.amount + (cf.fee || 0);
           }
       }
    });

    const avgExchangeRate = totalUsdBought > 0 ? totalTwdCost / totalUsdBought : 0;

    return {
      totalCostTWD: netInvestedTWD, 
      totalValueTWD,
      totalPLTWD,
      totalPLPercent: netInvestedTWD > 0 ? (totalPLTWD / netInvestedTWD) * 100 : 0,
      cashBalanceTWD,
      netInvestedTWD,
      annualizedReturn,
      exchangeRateUsdToTwd: exchangeRate,
      accumulatedCashDividendsTWD,
      accumulatedStockDividendsTWD,
      avgExchangeRate: avgExchangeRate || 0
    };
  }, [holdings, accountsWithBalance, cashFlows, exchangeRate, accounts, transactions]);

  const chartData: ChartDataPoint[] = useMemo(() => {
    return generateAdvancedChartData(
      transactions, 
      cashFlows, 
      accounts, 
      summary.totalValueTWD + summary.cashBalanceTWD, 
      exchangeRate
    );
  }, [transactions, cashFlows, accounts, summary, exchangeRate]);

  const assetAllocation: AssetAllocationItem[] = useMemo(() => {
    return calculateAssetAllocation(holdings, summary.cashBalanceTWD, exchangeRate);
  }, [holdings, summary, exchangeRate]);

  const annualPerformance: AnnualPerformanceItem[] = useMemo(() => {
    return calculateAnnualPerformance(chartData);
  }, [chartData]);

  const accountPerformance: AccountPerformance[] = useMemo(() => {
    return calculateAccountPerformance(accountsWithBalance, holdings, cashFlows, exchangeRate);
  }, [accountsWithBalance, holdings, cashFlows, exchangeRate]);

  // --- Render ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-md">
           <div className="flex justify-center mb-6">
             <div className="w-12 h-12 bg-gradient-to-tr from-accent to-purple-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">T</div>
           </div>
           <h1 className="text-2xl font-bold text-center mb-2 text-slate-800">TradeFolio 登入</h1>
           <p className="text-sm text-slate-500 mb-6 text-center">多使用者投資資產管理系統</p>
           
           <div className="space-y-4">
             <div>
               <label className="block text-sm font-medium text-slate-700 mb-1">Email 信箱 (帳號)</label>
               <input 
                type="email" 
                placeholder="name@example.com" 
                className="w-full border p-3 rounded bg-slate-50 focus:bg-white transition outline-none focus:ring-2 focus:ring-accent"
                value={loginEmail}
                onChange={e => setLoginEmail(e.target.value)}
                required
               />
             </div>
           </div>

           <button type="submit" className="w-full bg-slate-900 text-white py-3 rounded font-bold hover:bg-slate-800 transition mt-6 shadow-lg">
             登入系統
           </button>
           <p className="text-xs text-center mt-4 text-slate-400">
             {authorizedUsers.length === 0 
               ? "目前無使用者。第一位登入者將自動成為管理員。" 
               : "僅限授權的 Email 帳號登入。"}
           </p>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <header className="bg-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-tr from-accent to-purple-500 rounded-lg flex items-center justify-center font-bold">T</div>
            <div>
              <h1 className="text-lg font-bold tracking-wider leading-none">TradeFolio</h1>
              <span className="text-[10px] text-slate-400 font-normal">Hi, {currentUser}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-800 py-1 px-3 rounded-full border border-slate-700">
                <span className="text-slate-400">USD/TWD</span>
                <input 
                  type="number" 
                  value={exchangeRate}
                  onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 30)}
                  className="w-12 bg-transparent text-white font-mono text-right outline-none focus:text-accent"
                  step="0.1"
                />
             </div>
             <button onClick={handleLogout} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded border border-slate-700 transition">
               登出
             </button>
          </div>
        </div>
        <div className="bg-slate-800 border-t border-slate-700">
           <nav className="max-w-7xl mx-auto px-4 flex overflow-x-auto no-scrollbar">
             {['dashboard', 'funds', 'history', 'rebalance', 'accounts', 'help'].map(item => (
               <button
                key={item}
                onClick={() => setView(item as View)}
                className={`px-4 py-3 text-sm font-medium whitespace-nowrap transition-colors border-b-2 capitalize
                  ${view === item ? 'border-accent text-white' : 'border-transparent text-slate-400 hover:text-slate-200'}`}
               >
                 {item === 'dashboard' ? '儀表板' : 
                  item === 'funds' ? '資金管理' : 
                  item === 'history' ? '交易紀錄' : 
                  item === 'rebalance' ? '再平衡' : 
                  item === 'accounts' ? '證券戶管理' : '說明 & 備份'}
               </button>
             ))}
           </nav>
        </div>
      </header>
      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full animate-fade-in">
        {/* 除錯面板 */}
        {debugLogs.length > 0 && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-red-800 font-semibold">🚨 Confirm() 調用偵測到 ({debugLogs.length})</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDebugPanel(!showDebugPanel)}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  {showDebugPanel ? '隱藏詳情' : '顯示詳情'}
                </button>
                <button
                  onClick={() => setDebugLogs([])}
                  className="text-red-600 hover:text-red-800 text-sm underline"
                >
                  清除日誌
                </button>
              </div>
            </div>
            <p className="text-red-700 text-sm mb-2">
              偵測到 confirm() 調用！請檢查 Console 獲取詳細信息。
            </p>
            {showDebugPanel && (
              <div className="bg-red-100 rounded p-3 mt-3">
                <pre className="text-xs text-red-800 whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {debugLogs.join('\n\n---\n\n')}
                </pre>
              </div>
            )}
          </div>
        )}
        
        {view === 'dashboard' && (
          <>
             <div className="flex justify-end mb-4">
                <button 
                  onClick={() => setIsFormOpen(true)}
                  className="bg-accent hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow font-medium flex items-center gap-2 transition"
                >
                  <span className="text-xl leading-none">+</span> 記一筆
                </button>
             </div>
             <Dashboard 
               summary={summary} 
               chartData={chartData} 
               holdings={holdings} 
               assetAllocation={assetAllocation}
               annualPerformance={annualPerformance}
               accountPerformance={accountPerformance}
               cashFlows={cashFlows}
               accounts={accountsWithBalance}
               onUpdatePrice={updatePrice}
               onAutoUpdate={handleAutoUpdatePrices}
             />
          </>
        )}
        {view === 'funds' && <FundManager accounts={accountsWithBalance} cashFlows={cashFlows} onAdd={addCashFlow} onBatchAdd={addBatchCashFlows} onDelete={removeCashFlow} />}
        {view === 'accounts' && <AccountManager accounts={accountsWithBalance} onAdd={addAccount} onDelete={removeAccount} />}
        {view === 'rebalance' && <RebalanceView summary={summary} holdings={holdings} exchangeRate={exchangeRate} targets={rebalanceTargets} onUpdateTargets={updateRebalanceTargets} />}
        {view === 'help' && (
          <HelpView 
            onExport={handleExportData} 
            onImport={handleImportData} 
            onMigrateLegacy={handleMigrateLegacyData} 
            authorizedUsers={authorizedUsers}
            onAddUser={handleAddAuthorizedUser}
            onRemoveUser={handleRemoveAuthorizedUser}
            currentUser={currentUser}
          />
        )}
        {view === 'history' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">歷史記錄（交易 + 資金流動）</h2>
              <div className="flex gap-2">
                <button 
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log("全部刪除按鈕被點擊"); // 除錯用
                    handleClearAllTransactions();
                  }} 
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2 transition-colors"
                  disabled={transactions.length === 0}
                  title={transactions.length === 0 ? "沒有交易紀錄可刪除" : `刪除所有 ${transactions.length} 筆交易紀錄`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg> 
                  全部刪除 {transactions.length > 0 && `(${transactions.length})`}
                </button>
                <button onClick={() => setIsImportOpen(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg> 匯入 CSV / 貼上
                </button>
                <button onClick={() => setIsFormOpen(true)} className="bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded text-sm">新增</button>
              </div>
            </div>
            
            {/* 篩選器區域 */}
            <div className="bg-white rounded-lg shadow p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-800">查詢/篩選</h3>
                <button 
                  onClick={clearFilters}
                  className="text-sm text-slate-500 hover:text-slate-700 underline"
                >
                  清除所有篩選
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* 帳戶篩選 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    帳戶篩選 (Filter by Account)
                  </label>
                  <select
                    value={filterAccount}
                    onChange={(e) => setFilterAccount(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  >
                    <option value="">所有帳戶</option>
                    {accounts.map(account => (
                      <option key={account.id} value={account.id}>
                        {account.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 股票代號篩選 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    股票代號篩選 (以股票代號篩選)
                  </label>
                  <input
                    type="text"
                    value={filterTicker}
                    onChange={(e) => setFilterTicker(e.target.value)}
                    placeholder="例如: 0050, AAPL"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* 開始日期 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    開始日期 (依日期篩選)
                  </label>
                  <input
                    type="date"
                    value={filterDateFrom}
                    onChange={(e) => setFilterDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>

                {/* 結束日期 */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    結束日期
                  </label>
                  <input
                    type="date"
                    value={filterDateTo}
                    onChange={(e) => setFilterDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>
              
              {/* 現金流勾選區域 */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex items-center space-x-3">
                  <label className="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={includeCashFlow}
                      onChange={(e) => setIncludeCashFlow(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                    />
                    <span className="ml-2 text-sm font-medium text-slate-700">
                      包含現金流記錄 (資金管理)
                    </span>
                  </label>
                  <div className="text-xs text-slate-500">
                    勾選後會顯示資金匯入、提取、轉帳等記錄，方便查看餘額變化
                  </div>
                </div>
              </div>
              
              {/* 篩選結果統計 */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200">
                <div className="text-sm text-slate-600">
                  顯示 <span className="font-semibold text-slate-800">{filteredRecords.length}</span> 筆記錄
                  {filteredRecords.length !== combinedRecords.length && (
                    <span className="text-slate-500">
                      （共 {combinedRecords.length} 筆：{transactions.length} 筆交易{includeCashFlow ? ` + ${cashFlows.length} 筆現金流` : ''}）
                    </span>
                  )}
                  {!includeCashFlow && cashFlows.length > 0 && (
                    <span className="text-amber-600 ml-2">
                      （已隱藏 {cashFlows.length} 筆現金流記錄）
                    </span>
                  )}
                </div>
                
                {/* 快速篩選按鈕 */}
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      const thirtyDaysAgo = new Date();
                      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                      setFilterDateFrom(thirtyDaysAgo.toISOString().split('T')[0]);
                      setFilterDateTo(new Date().toISOString().split('T')[0]);
                    }}
                    className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded-full hover:bg-blue-200 transition"
                  >
                    最近30天
                  </button>
                  <button
                    onClick={() => {
                      const currentYear = new Date().getFullYear();
                      setFilterDateFrom(`${currentYear}-01-01`);
                      setFilterDateTo(`${currentYear}-12-31`);
                    }}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded-full hover:bg-green-200 transition"
                  >
                    今年
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow overflow-hidden overflow-x-auto">
               <table className="min-w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500 uppercase">
                    <tr>
                      <th className="px-6 py-3">日期</th>
                      <th className="px-6 py-3">帳戶</th>
                      <th className="px-6 py-3">標的/描述</th>
                      <th className="px-6 py-3">類別</th>
                      <th className="px-6 py-3 text-right">單價</th>
                      <th className="px-6 py-3 text-right">數量</th>
                      <th className="px-6 py-3 text-right">金額</th>
                      <th className="px-6 py-3 text-right">餘額</th>
                      <th className="px-6 py-3 text-right">操作</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map(record => {
                      const accName = accounts.find(a => a.id === record.accountId)?.name;
                      
                      // 根據記錄類型設定徽章顏色
                      let badgeColor = 'bg-gray-100 text-gray-700';
                      let displayType = record.subType;
                      
                      if (record.type === 'TRANSACTION') {
                        if(record.subType === TransactionType.BUY) badgeColor = 'bg-red-100 text-red-700';
                        else if(record.subType === TransactionType.SELL) badgeColor = 'bg-green-100 text-green-700';
                        else if(record.subType === TransactionType.DIVIDEND || record.subType === TransactionType.CASH_DIVIDEND) badgeColor = 'bg-yellow-100 text-yellow-700';
                        else if(record.subType === TransactionType.TRANSFER_IN) badgeColor = 'bg-blue-100 text-blue-700';
                        else if(record.subType === TransactionType.TRANSFER_OUT) badgeColor = 'bg-orange-100 text-orange-700';
                      } else if (record.type === 'CASHFLOW') {
                        if(record.subType === 'DEPOSIT') {
                          badgeColor = 'bg-emerald-100 text-emerald-700';
                          displayType = '資金匯入';
                        } else if(record.subType === 'WITHDRAW') {
                          badgeColor = 'bg-red-100 text-red-700';
                          displayType = '資金提取';
                        } else if(record.subType === 'TRANSFER') {
                          badgeColor = 'bg-purple-100 text-purple-700';
                          displayType = '帳戶轉出';
                        } else if(record.subType === 'TRANSFER_IN') {
                          badgeColor = 'bg-blue-100 text-blue-700';
                          displayType = '帳戶轉入';
                        }
                      }
                      
                      // 取得目標帳戶名稱（用於轉帳）
                      let targetAccName = null;
                      if (record.type === 'CASHFLOW') {
                        if (record.subType === 'TRANSFER' && record.targetAccountId) {
                          targetAccName = accounts.find(a => a.id === record.targetAccountId)?.name;
                        } else if (record.subType === 'TRANSFER_IN' && (record as any).sourceAccountId) {
                          targetAccName = accounts.find(a => a.id === (record as any).sourceAccountId)?.name;
                        }
                      }
                      
                      return (
                      <tr key={`${record.type}-${record.id}`} className="hover:bg-slate-50">
                        <td className="px-6 py-3 text-slate-600">{record.date}</td>
                        <td className="px-6 py-3 text-slate-500 text-xs">{accName}</td>
                        <td className="px-6 py-3 font-semibold text-slate-700">
                          {record.type === 'TRANSACTION' ? (
                            <><span className="text-xs text-slate-400 mr-1">{record.market}</span>{record.ticker}</>
                          ) : (
                            <span className="text-slate-600">
                              {record.description}
                              {targetAccName && record.subType === 'TRANSFER' && <span className="text-xs text-slate-400 ml-1">→ {targetAccName}</span>}
                              {targetAccName && record.subType === 'TRANSFER_IN' && <span className="text-xs text-slate-400 ml-1">← {targetAccName}</span>}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-bold ${badgeColor}`}>
                            {displayType}
                          </span>
                        </td>
                        <td className="px-6 py-3 text-right text-slate-600">
                          {record.type === 'TRANSACTION' ? record.price : 
                           record.type === 'CASHFLOW' && record.exchangeRate ? record.exchangeRate : '-'}
                        </td>
                        <td className="px-6 py-3 text-right text-slate-600">
                          {record.type === 'TRANSACTION' ? record.quantity : '-'}
                        </td>
                        <td className="px-6 py-3 text-right font-medium text-slate-800">
                          {record.amount % 1 === 0 ? record.amount.toString() : record.amount.toFixed(2)}
                        </td>
                        <td className="px-6 py-3 text-right">
                          <div className="flex flex-col items-end">
                            <span className={`font-medium ${
                              (record as any).balance >= 0 ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {(record as any).balance?.toFixed(2) || '0.00'}
                            </span>
                            <span className="text-xs text-slate-400">
                              {accounts.find(a => a.id === record.accountId)?.currency || 'TWD'}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-right">
                          {/* 轉帳的目標記錄不顯示刪除按鈕，避免重複刪除 */}
                          {!(record.type === 'CASHFLOW' && (record as any).isTargetRecord) && (
                            <button 
                              onClick={() => {
                                if (record.type === 'TRANSACTION') {
                                  removeTransaction(record.id);
                                } else {
                                  // 對於轉帳記錄，使用原始ID來刪除
                                  const originalId = (record as any).isSourceRecord ? record.id : record.id.replace('-target', '');
                                  removeCashFlow(originalId);
                                }
                              }} 
                              className="text-red-400 hover:text-red-600"
                            >
                              刪除
                            </button>
                          )}
                        </td>
                      </tr>
                    )})}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={9} className="px-6 py-12 text-center">
                          <div className="text-slate-400">
                            {transactions.length === 0 ? (
                              <div>
                                <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <p className="text-lg font-medium text-slate-500 mb-2">尚無交易記錄</p>
                                <p className="text-sm text-slate-400">點擊「新增」按鈕開始記錄您的第一筆交易</p>
                              </div>
                            ) : (
                              <div>
                                <svg className="mx-auto h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                                <p className="text-lg font-medium text-slate-500 mb-2">找不到符合條件的交易</p>
                                <p className="text-sm text-slate-400 mb-3">
                                  嘗試調整篩選條件或 
                                  <button 
                                    onClick={clearFilters}
                                    className="text-blue-600 hover:text-blue-800 underline ml-1"
                                  >
                                    清除所有篩選
                                  </button>
                                </p>
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
               </table>
            </div>
          </div>
        )}
      </main>
      {isFormOpen && <TransactionForm accounts={accounts} onAdd={addTransaction} onClose={() => setIsFormOpen(false)} />}
      {isImportOpen && <BatchImportModal accounts={accounts} onImport={addBatchTransactions} onClose={() => setIsImportOpen(false)} />}
      
      {/* 自訂刪除確認對話框 */}
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-center w-12 h-12 mx-auto mb-4 bg-red-100 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              
              <h3 className="text-lg font-bold text-center text-slate-800 mb-2">
                ⚠️ 危險操作確認
              </h3>
              
              <div className="text-sm text-slate-600 mb-4 space-y-2">
                <p className="text-center">
                  您即將刪除所有 <span className="font-bold text-red-600">{transactions.length}</span> 筆交易紀錄！
                </p>
                
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                  <p className="font-medium text-red-800 mb-1">這個動作將會：</p>
                  <ul className="text-red-700 text-xs space-y-1">
                    <li>• 清空所有買賣紀錄</li>
                    <li>• 清空所有股息紀錄</li>
                    <li>• 清空所有轉帳紀錄</li>
                    <li>• <strong>此動作無法復原！</strong></li>
                  </ul>
                </div>
                
                <p className="text-center font-medium text-slate-700">
                  請確認您真的要執行此操作？
                </p>
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={cancelDeleteAllTransactions}
                  className="flex-1 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-50 transition"
                >
                  取消
                </button>
                <button
                  onClick={confirmDeleteAllTransactions}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                >
                  確認刪除
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* 自定義提示對話框 */}
      {alertDialog.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="p-6">
              <div className={`flex items-center justify-center w-12 h-12 mx-auto mb-4 rounded-full ${
                alertDialog.type === 'success' ? 'bg-green-100' :
                alertDialog.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
              }`}>
                {alertDialog.type === 'success' ? (
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                ) : alertDialog.type === 'error' ? (
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                )}
              </div>
              
              <h3 className="text-lg font-bold text-center text-slate-800 mb-3">
                {alertDialog.title}
              </h3>
              
              <div className="text-sm text-slate-600 mb-6 text-center whitespace-pre-line">
                {alertDialog.message}
              </div>
              
              <div className="flex justify-center">
                <button
                  onClick={closeAlert}
                  className={`px-6 py-2 rounded-lg font-medium transition ${
                    alertDialog.type === 'success' ? 'bg-green-600 hover:bg-green-700 text-white' :
                    alertDialog.type === 'error' ? 'bg-red-600 hover:bg-red-700 text-white' :
                    'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  確定
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;