
// 語言類型
export type Language = 'zh-TW' | 'zh-CN' | 'en' | 'ja' | 'ko' | 'de';

/** 語系選項（用於下拉選單） */
export const LANGUAGES: { code: Language; label: string }[] = [
  { code: 'zh-TW', label: '繁' },
  { code: 'zh-CN', label: '简' },
  { code: 'en', label: 'EN' },
  { code: 'ja', label: '日' },
  { code: 'ko', label: '한' },
  { code: 'de', label: 'DE' },
];

// 基準幣別代碼
export type BaseCurrencyCode = 'TWD' | 'USD' | 'JPY' | 'EUR' | 'GBP' | 'HKD' | 'KRW';

// 翻譯鍵值類型
export interface Translations {
  // 基準幣顯示名稱
  baseCurrency: {
    TWD: string;
    USD: string;
    JPY: string;
    EUR: string;
    GBP: string;
    HKD: string;
    KRW: string;
  };
  // 通用
  common: {
    confirm: string;
    cancel: string;
    delete: string;
    edit: string;
    save: string;
    close: string;
    loading: string;
    search: string;
    logoutConfirm: string;
  };
  // 導航
  nav: {
    dashboard: string;
    history: string;
    funds: string;
    accounts: string;
    rebalance: string;
    simulator: string;
    help: string;
    logout: string;
  };
  // 頁面標題
  pages: {
    dashboard: string;
    history: string;
    funds: string;
    accounts: string;
    rebalance: string;
    simulator: string;
    help: string;
  };
  // 登入頁
  login: {
    title: string;
    subtitle: string;
    email: string;
    password: string;
    login: string;
    privacy: string;
    privacyDesc: string;
    riskDisclaimer: string;
    riskDisclaimerDesc: string;
  };
  // 儀表板
  dashboard: {
    netCost: string;
    totalAssets: string;
    totalPL: string;
    annualizedReturn: string;
    detail: string;
    includeCash: string;
    detailedStatistics: string;
    totalCost: string;
    totalPLAmount: string;
    accumulatedCashDividends: string;
    accumulatedStockDividends: string;
    annualizedReturnRate: string;
    avgExchangeRate: string;
    currentExchangeRate: string;
    totalReturnRate: string;
    assetVsCostTrend: string;
    aiCorrectHistory: string;
    allocation: string;
    annualPerformance: string;
    year: string;
    startAssets: string;
    annualNetInflow: string;
    endAssets: string;
    annualProfit: string;
    annualROI: string;
    brokerageAccounts: string;
    accountName: string;
    totalAssetsNT: string;
    marketValueNT: string;
    balanceNT: string;
    profitNT: string;
    displayCurrency: string;
    ntd: string;
    usd: string;
    annualizedROI: string;
    portfolioHoldings: string;
    mergedDisplay: string;
    detailedDisplay: string;
    aiUpdatePrices: string;
    estimatedGrowth8: string;
    chartLoading: string;
    noChartData: string;
    noHoldings: string;
    noAccounts: string;
    costBreakdown: string;
    netInvestedBreakdown: string;
    calculationFormula: string;
    formulaNote: string;
    attention: string;
    date: string;
    category: string;
    originalAmount: string;
    twdCost: string;
    totalNetInvested: string;
    deposit: string;
    withdraw: string;
    fixedTWD: string;
    historicalRate: string;
    currentRate: string;
    taiwanDollar: string;
    chartLabels: {
      investmentCost: string;
      accumulatedPL: string;
      estimatedAssets: string;
      totalAssets: string;
      realData: string;
      estimated: string;
    };
    aiAdvisor: string;
    aiAdvisorDesc: string;
    startAnalysis: string;
    analyzing: string;
    viewCalculationDetails: string;
    notInvestmentAdvice: string;
  };
  // 資金管理
  funds: {
    title: string;
    operations: string;
    clearAll: string;
    batchImport: string;
    addRecord: string;
    filter: string;
    clearFilters: string;
    accountFilter: string;
    typeFilter: string;
    dateFrom: string;
    dateTo: string;
    allAccounts: string;
    allTypes: string;
    deposit: string;
    withdraw: string;
    transfer: string;
    interest: string;
    showRecords: string;
    totalRecords: string;
    last30Days: string;
    thisYear: string;
    confirmClearAll: string;
    confirmClearAllMessage: string;
    confirmClear: string;
  };
  // 交易記錄
  history: {
    operations: string;
    batchUpdateMarket: string;
    clearAll: string;
    batchImport: string;
    addRecord: string;
    filter: string;
    clearFilters: string;
    accountFilter: string;
    tickerFilter: string;
    dateFrom: string;
    dateTo: string;
    includeCashFlow: string;
    showingRecords: string;
    totalRecords: string;
    last30Days: string;
    thisYear: string;
    noTransactions: string;
    noMatchingTransactions: string;
    edit: string;
    delete: string;
    includeCashFlowDesc: string;
    hiddenCashFlowRecords: string;
    cashFlowDeposit: string;
    cashFlowWithdraw: string;
    cashFlowTransfer: string;
    cashFlowTransferIn: string;
  };
  // 其他常用文字
  labels: {
    date: string;
    account: string;
    amount: string;
    balance: string;
    action: string;
    type: string;
    price: string;
    quantity: string;
    currency: string;
    fee: string;
    exchangeRate: string;
    totalCost: string;
    category: string;
    description: string;
    note: string;
  };
  // 持倉明細表
  holdings: {
    portfolioHoldings: string;
    mergedDisplay: string;
    detailedDisplay: string;
    aiUpdatePrices: string;
    aiSearching: string;
    market: string;
    ticker: string;
    quantity: string;
    currentPrice: string;
    weight: string;
    cost: string;
    marketValue: string;
    profitLoss: string;
    annualizedROI: string;
    dailyChange: string;
    avgPrice: string;
    noHoldings: string;
  };
  // 帳戶管理
  accounts: {
    addAccount: string;
    accountName: string;
    accountNamePlaceholder: string;
    currency: string;
    currencyTWD: string;
    currencyUSD: string;
    currencyJPY: string;
    subBrokerage: string;
    add: string;
    update: string;
    editAccount: string;
    balance: string;
    cancel: string;
    updateAccount: string;
    confirmDelete: string;
    confirmDeleteMessage: string;
    deleteWarning: string;
    deleteAccount: string;
    noAccounts: string;
    cashBalance: string;
    editAccountTitle: string;
  };
  // 再平衡
  rebalance: {
    title: string;
    resetToCurrent: string;
    totalAssets: string;
    enable: string;
    symbol: string;
    currentPrice: string;
    currentValue: string;
    currentWeight: string;
    targetWeight: string;
    targetValue: string;
    adjustAmount: string;
    suggestedAction: string;
    cash: string;
    totalEnabled: string;
    remainingFunds: string;
    notParticipating: string;
    accounts: string;
    description: string;
    description1: string;
    description2: string;
    description3: string;
    description4: string;
    description5: string;
    description6: string;
    buy: string;
    sell: string;
  };
  // 模擬器
  simulator: {
    title: string;
    description: string;
    descriptionWarning: string;
    basicSettings: string;
    initialAmount: string;
    investmentYears: string;
    regularInvestment: string;
    regularAmount: string;
    frequency: string;
    monthly: string;
    quarterly: string;
    yearly: string;
    annualTotal: string;
    setToZero: string;
    importFromHoldings: string;
    importButton: string;
    manualAdd: string;
    ticker: string;
    tickerPlaceholder: string;
    market: string;
    marketTW: string;
    marketUS: string;
    marketUK: string;
    marketJP: string;
    annualReturn: string;
    autoQuery: string;
    querying: string;
    allocation: string;
    add: string;
    assetList: string;
    autoBalance: string;
    clearAll: string;
    allocationSum: string;
    totalInvested: string;
    finalValue: string;
    totalReturn: string;
    portfolioAnnualReturn: string;
    initial: string;
    yearlyProjection: string;
    yearlyReturnAnalysis: string;
    detailedYearlyProjection: string;
    year: string;
    assetValue: string;
    yearlyReturn: string;
    cumulativeInvestment: string;
    yearlyReturnRate: string;
    allocationWarning: string;
    confirmClear: string;
    confirmClearMessage: string;
    dataWarning: string;
    dataWarningDesc: string;
    cagrExplanation: string;
    cagrFormula: string;
    cagrFormulaDesc: string;
    cagrExample: string;
    cagrExampleValue: string;
    errorEnterTicker: string;
    errorAllocationRange: string;
    errorAllocationSum: string;
    errorNoHoldings: string;
    errorEnterTickerFirst: string;
    errorCannotGetReturn: string;
    errorQueryFailed: string;
    close: string;
    cancel: string;
    yearPrefix: string;
    yearSuffix: string;
    queryingReturn: string;
    autoQueryTitle: string;
  };
  // 系統說明
  help: {
    dataManagement: string;
    export: string;
    exportDesc: string;
    downloadBackup: string;
    import: string;
    importWarning: string;
    uploadBackup: string;
    authorizedUsers: string;
    authorizedUsersDesc: string;
    emailAccount: string;
    status: string;
    systemAuthorized: string;
    contact: string;
    contactTitle: string;
    contactDesc: string;
    contactEmail: string;
    documentation: string;
    copyAll: string;
    copied: string;
    print: string;
    confirmImport: string;
    confirmImportMessage: string;
    confirmImportWarning: string;
    confirmOverride: string;
    documentationContent: string;
    androidPublish: string;
    androidPublishTitle: string;
    androidPublishDesc: string;
  };
  // 交易表單
  transactionForm: {
    addTransaction: string;
    editTransaction: string;
    date: string;
    account: string;
    market: string;
    ticker: string;
    tickerPlaceholder: string;
    category: string;
    price: string;
    quantity: string;
    quantityFixed: string;
    fees: string;
    note: string;
    cancel: string;
    saveTransaction: string;
    updateTransaction: string;
    confirmTitle: string;
    confirmMessage: string;
    dateLabel: string;
    accountLabel: string;
    marketLabel: string;
    tickerLabel: string;
    typeLabel: string;
    priceLabel: string;
    quantityLabel: string;
    feesLabel: string;
    noteLabel: string;
    totalAmount: string;
    shares: string;
    backToEdit: string;
    confirmSave: string;
    previewTitle: string;
    calculationFormula: string;
    marketTW: string;
    marketUS: string;
    marketUK: string;
    marketJP: string;
    typeBuy: string;
    typeSell: string;
    typeDividend: string;
    typeCashDividend: string;
    typeTransferIn: string;
    typeTransferOut: string;
    placeholderPrice: string;
    placeholderQuantity: string;
    errorNoAccount: string;
    feesShort: string;
    formulaNote: string;
  };
  // 資金管理表單
  fundForm: {
    addFundRecord: string;
    editFundRecord: string;
    date: string;
    type: string;
    account: string;
    sourceAccount: string;
    amount: string;
    targetAccount: string;
    selectAccount: string;
    exchangeRate: string;
    exchangeRateUSD: string;
    exchangeRateJPY: string;
    crossCurrencyTransfer: string;
    usdConversion: string;
    jpyConversion: string;
    sameCurrencyTransfer: string;
    fees: string;
    feesNote: string;
    note: string;
    cancel: string;
    updateRecord: string;
    confirmExecute: string;
    typeDeposit: string;
    typeWithdraw: string;
    typeTransfer: string;
    typeInterest: string;
    confirmTitle: string;
    confirmMessage: string;
    dateLabel: string;
    typeLabel: string;
    accountLabel: string;
    targetAccountLabel: string;
    amountLabel: string;
    exchangeRateLabel: string;
    feesLabel: string;
    noteLabel: string;
    totalTWD: string;
    backToEdit: string;
    confirmSave: string;
    errorNoAccount: string;
  };
}

// 繁體中文翻譯
const zhTW: Translations = {
  baseCurrency: {
    TWD: '台幣',
    USD: '美金',
    JPY: '日幣',
    EUR: '歐元',
    GBP: '英鎊',
    HKD: '港幣',
    KRW: '韓元',
  },
  common: {
    confirm: '確認',
    cancel: '取消',
    delete: '刪除',
    edit: '編輯',
    save: '儲存',
    close: '關閉',
    loading: '載入中...',
    search: '搜尋',
    logoutConfirm: '確定要登出系統嗎？',
  },
  nav: {
    dashboard: '儀表板',
    history: '交易紀錄',
    funds: '資金管理',
    accounts: '證券戶',
    rebalance: '再平衡',
    simulator: '配置模擬',
    help: '系統管理',
    logout: '登出',
  },
  pages: {
    dashboard: '投資組合儀表板',
    history: '歷史記錄（交易 + 資金流動）',
    funds: '資金存取與管理',
    accounts: '證券帳戶管理',
    rebalance: '投資組合再平衡',
    simulator: '資產配置模擬',
    help: '系統管理與備份',
  },
  login: {
    title: 'TradeView 登入',
    subtitle: '台美股資產管理系統',
    email: 'Email',
    password: 'Password',
    login: '登入',
    privacy: '隱私聲明',
    privacyDesc: '資料都在個人電腦與手機，系統不涉及個資問題，記得定時備份。',
    riskDisclaimer: '風險聲明',
    riskDisclaimerDesc: '投資有風險，過往績效不代表未來表現，請謹慎評估自身風險承受能力。',
  },
  dashboard: {
    netCost: '淨投入成本',
    totalAssets: '目前總資產',
    totalPL: '總損益',
    annualizedReturn: '真實年化',
    detail: '明細',
    includeCash: '含現金',
    detailedStatistics: '詳細統計數據',
    totalCost: '總投資成本',
    totalPLAmount: '總損益金額',
    accumulatedCashDividends: '累積配息現金',
    accumulatedStockDividends: '累積股息再投入',
    annualizedReturnRate: '總市值年化報酬率',
    avgExchangeRate: '平均換匯成本',
    currentExchangeRate: '目前匯率',
    totalReturnRate: '累積總報酬率',
    assetVsCostTrend: '資產與成本趨勢',
    aiCorrectHistory: 'AI 校正歷史資產',
    allocation: '資產配置',
    annualPerformance: '年度績效表',
    year: '年份',
    startAssets: '期初資產',
    annualNetInflow: '年度淨投入',
    endAssets: '期末資產',
    annualProfit: '年度損益',
    annualROI: '年度報酬率',
    brokerageAccounts: '證券戶列表',
    accountName: '證券名稱',
    totalAssetsNT: '總資產',
    marketValueNT: '市值',
    balanceNT: '餘額',
    profitNT: '損益',
    annualizedROI: '年化報酬率',
    displayCurrency: '顯示幣種',
    ntd: '台幣',
    usd: '美金',
    portfolioHoldings: '資產配置明細',
    mergedDisplay: '合併顯示 (依標的)',
    detailedDisplay: '明細顯示 (依帳戶)',
    aiUpdatePrices: 'AI 聯網更新股價 & 匯率',
    estimatedGrowth8: '預估 8% 成長',
    chartLoading: '圖表載入中...',
    noChartData: '請先新增資金匯入與交易紀錄',
    noHoldings: '無持倉',
    noAccounts: '尚無證券戶，請至「證券戶管理」新增。',
    costBreakdown: '淨投入成本計算明細',
    netInvestedBreakdown: '淨投入成本計算明細',
    calculationFormula: '計算公式：淨投入 = 匯入資金 - 匯出資金',
    formulaNote: '注意：美金帳戶若有「歷史匯率」則優先使用，否則使用「目前右上角設定匯率」。轉帳與利息不計入成本。',
    attention: '注意',
    date: '日期',
    category: '類別',
    originalAmount: '原始金額',
    twdCost: '成本 ({currency})',
    totalNetInvested: '總計',
    deposit: '匯入 (+)',
    withdraw: '匯出 (-)',
    fixedTWD: '指定台幣金額',
    historicalRate: '歷史匯率',
    currentRate: '目前匯率',
    taiwanDollar: '台幣',
    chartLabels: {
      investmentCost: '投資成本',
      accumulatedPL: '累積損益',
      estimatedAssets: '預估總資產 (8%)',
      totalAssets: '總資產',
      realData: ' (真實股價)',
      estimated: ' (估算)',
    },
    aiAdvisor: 'Gemini AI 投資顧問',
    aiAdvisorDesc: '分析您的投資組合配置、風險與潛在機會。',
    startAnalysis: '開始分析',
    analyzing: '分析中...',
    viewCalculationDetails: '查看計算明細',
    notInvestmentAdvice: '本應用程式不提供投資建議，所有分析結果僅供參考。',
  },
  funds: {
    title: '資金管理',
    operations: '操作選項',
    clearAll: '清空所有資金',
    batchImport: '批次匯入',
    addRecord: '記一筆',
    filter: '查詢/篩選',
    clearFilters: '清除所有篩選',
    accountFilter: '帳戶篩選',
    typeFilter: '類別篩選',
    dateFrom: '起始日期',
    dateTo: '結束日期',
    allAccounts: '所有帳戶',
    allTypes: '所有類別',
    deposit: '匯入',
    withdraw: '匯出',
    transfer: '轉帳',
    interest: '利息',
    showRecords: '顯示 {count} 筆記錄',
    totalRecords: '共 {total} 筆',
    last30Days: '最近30天',
    thisYear: '今年',
    confirmClearAll: '確認清空所有資金紀錄？',
    confirmClearAllMessage: '此操作將刪除所有的入金、出金、轉帳與利息紀錄，且無法復原。建議先備份資料。',
    confirmClear: '確認清空',
  },
  history: {
    operations: '操作選項',
    batchUpdateMarket: '批量修改市場',
    clearAll: '清空所有交易',
    batchImport: '批次匯入',
    addRecord: '記一筆',
    filter: '查詢/篩選',
    accountFilter: '帳戶篩選',
    tickerFilter: '股票代號篩選',
    dateFrom: '開始日期',
    dateTo: '結束日期',
    includeCashFlow: '包含現金流記錄',
    clearFilters: '清除所有篩選',
    showingRecords: '顯示 {count} 筆記錄',
    totalRecords: '共 {total} 筆：{transactionCount} 筆交易{hasCashFlow}',
    last30Days: '最近30天',
    thisYear: '今年',
    noTransactions: '尚無交易記錄',
    noMatchingTransactions: '找不到符合條件的交易',
    edit: '編輯',
    delete: '刪除',
    includeCashFlowDesc: '勾選後會顯示資金匯入、提取、轉帳等記錄，方便查看餘額變化',
    hiddenCashFlowRecords: '已隱藏 {count} 筆現金流記錄',
    cashFlowDeposit: '資金匯入',
    cashFlowWithdraw: '資金提取',
    cashFlowTransfer: '帳戶轉出',
    cashFlowTransferIn: '帳戶轉入',
  },
  labels: {
    date: '日期',
    account: '帳戶',
    amount: '金額',
    balance: '餘額',
    action: '操作',
    type: '類別',
    price: '單價',
    quantity: '數量',
    currency: '幣別',
    fee: '手續費',
    exchangeRate: '匯率',
    totalCost: '總計成本',
    category: '類別',
    description: '標的/描述',
    note: '備註',
  },
  holdings: {
    portfolioHoldings: '資產配置明細',
    mergedDisplay: '合併顯示 (依標的)',
    detailedDisplay: '明細顯示 (依帳戶)',
    aiUpdatePrices: 'AI 聯網更新股價 & 匯率',
    aiSearching: 'AI 搜尋中...',
    market: '市場',
    ticker: '代號',
    quantity: '數量',
    currentPrice: '現價',
    weight: '比重',
    cost: '總成本',
    marketValue: '市值',
    profitLoss: '損益',
    annualizedROI: '年化',
    dailyChange: '今日漲跌',
    avgPrice: '均價',
    noHoldings: '尚無持倉資料，請新增交易。',
  },
  accounts: {
    addAccount: '新增證券戶 / 銀行帳戶',
    accountName: '帳戶名稱',
    accountNamePlaceholder: '例如: 富邦證券, Firstrade',
    currency: '幣別',
    currencyTWD: '台幣',
    currencyUSD: '美金',
    currencyJPY: '日幣',
    subBrokerage: '複委託',
    add: '新增',
    update: '更新',
    editAccount: '編輯帳戶',
    balance: '餘額',
    cancel: '取消',
    updateAccount: '更新帳戶',
    confirmDelete: '確認刪除帳戶',
    confirmDeleteMessage: '您確定要刪除「{name}」嗎？',
    deleteWarning: '注意：這不會刪除該帳戶下的歷史交易紀錄，但在篩選時可能會出現異常。',
    deleteAccount: '確認刪除',
    noAccounts: '尚無帳戶，請上方新增第一個證券戶。',
    cashBalance: '現金餘額',
    editAccountTitle: '編輯帳戶',
  },
  rebalance: {
    title: '個股再平衡',
    resetToCurrent: '帶入目前比重',
    totalAssets: '總資產 (含現金)',
    enable: '平衡',
    symbol: '標的',
    currentPrice: '現價',
    currentValue: '現值',
    currentWeight: '目前佔比',
    targetWeight: '目標佔比',
    targetValue: '目標價值',
    adjustAmount: '調整金額',
    suggestedAction: '建議操作',
    cash: '現金',
    totalEnabled: '已啟用項目',
    remainingFunds: '剩餘資金',
    notParticipating: '不參與平衡',
    accounts: '個帳戶',
    description: '說明：',
    description1: '相同名稱的個股會自動合併顯示，目標佔比會按現值比例分配給各個帳戶。',
    description2: '勾選「平衡」欄位來選擇哪些股債需要再平衡，未勾選的項目將不參與再平衡計算。',
    description3: '現金部分也可以勾選，若勾選現金，可以手動設定現金目標比例；若不勾選，現金將維持現狀。',
    description4: '目標佔比會自動儲存。若未手動設定現金目標，系統會自動計算剩餘比例分配給現金；若手動設定現金目標，則使用您設定的值。',
    description5: '若「現金」目標比例為負值，代表您的股票目標配置超過 100%，請調降部分持股目標。',
    description6: '點擊「帶入目前比重」可快速重置所有目標值為當前現況。',
    buy: '買',
    sell: '賣',
  },
  simulator: {
    title: '資產配置模擬說明',
    description: '此工具可讓您比較不同資產配置的預期獲利。請輸入各種股票或 ETF 的成立以來年化報酬率作為假設值，系統會根據您的配置比例計算組合的預期表現。',
    descriptionWarning: '⚠️ 注意：過往績效不代表未來表現，此模擬僅供參考。',
    basicSettings: '基本設定',
    initialAmount: '初始投資金額',
    investmentYears: '投資年數',
    regularInvestment: '定期定額投資（選填）',
    regularAmount: '定期定額金額',
    frequency: '投入頻率',
    monthly: '每月投入',
    quarterly: '每季投入',
    yearly: '每年投入',
    annualTotal: '年度總投入',
    setToZero: '設定為 0則不使用定期定額',
    importFromHoldings: '現有持倉導入',
    importButton: '從現有持倉導入',
    manualAdd: '手動添加資產',
    ticker: '股票代號',
    tickerPlaceholder: '例如: 0050',
    market: '市場',
    marketTW: '台股',
    marketUS: '美股',
    marketUK: '英股',
    marketJP: '日股',
    annualReturn: '年化報酬率',
    autoQuery: '🔍 自動查詢',
    querying: '查詢中',
    allocation: '配置比例',
    add: '添加',
    assetList: '資產配置列表',
    autoBalance: '自動平衡',
    clearAll: '清空全部',
    allocationSum: '配置比例總和:',
    totalInvested: '總投入金額',
    finalValue: '最終價值',
    totalReturn: '總報酬',
    portfolioAnnualReturn: '組合年化報酬',
    initial: '初始',
    yearlyProjection: '年度預測趨勢圖',
    yearlyReturnAnalysis: '年度報酬分析',
    detailedYearlyProjection: '詳細年度預測',
    year: '年份',
    assetValue: '資產價值',
    yearlyReturn: '年度報酬',
    cumulativeInvestment: '累積投入',
    yearlyReturnRate: '年度報酬率',
    allocationWarning: '⚠️ 配置比例總和必須等於 100%，目前為',
    confirmClear: '確認清空',
    confirmClearMessage: '確定要清空所有資產配置嗎？此操作無法復原。',
    dataWarning: '⚠️ 數據完整性警告：',
    dataWarningDesc: '建議：如果計算結果明顯低於預期，可能是因為 Yahoo Finance 的歷史數據不完整。您可以參考官方資料或手動輸入更準確的年化報酬率。',
    cagrExplanation: '📊 年化報酬率計算說明：',
    cagrFormula: 'CAGR = ((當前價格 / 初始價格) ^ (1 / 年數)) - 1',
    cagrFormulaDesc: '系統使用 CAGR (複合年成長率) 公式計算：',
    cagrExample: '這表示如果從上市時買入並持有至今，每年的平均複合報酬率。',
    cagrExampleValue: '範例：股票從 100 元漲到 200 元，經過 5 年，年化報酬率約為 14.87%',
    errorEnterTicker: '請輸入股票代號',
    errorAllocationRange: '配置比例必須在 0% 到 100% 之間',
    errorAllocationSum: '配置比例總和不能超過 100%',
    errorNoHoldings: '目前沒有持倉資料可導入',
    errorEnterTickerFirst: '請先輸入股票代號',
    errorCannotGetReturn: '無法取得 {ticker} 的年化報酬率，請手動輸入',
    errorQueryFailed: '查詢年化報酬率失敗，請手動輸入',
    close: '關閉',
    cancel: '取消',
    yearPrefix: '第',
    yearSuffix: '年',
    queryingReturn: '正在查詢 {ticker} 的年化報酬率...',
    autoQueryTitle: '自動查詢上市以來的年化報酬率',
  },
  help: {
    dataManagement: '資料備份與還原',
    export: '備份資料',
    exportDesc: '將您的交易紀錄、帳戶設定與股價資訊匯出為 JSON 檔案，建議定期備份以免資料遺失。',
    downloadBackup: '下載備份檔 (.json)',
    import: '還原資料',
    importWarning: '警告：匯入備份檔將會完全覆蓋您目前的系統資料。',
    uploadBackup: '上傳備份檔',
    authorizedUsers: '使用者授權名單',
    authorizedUsersDesc: '以下為系統預設可免密碼登入的 Email 名單 (已隱碼保護)：',
    emailAccount: 'Email 帳號',
    status: '狀態',
    systemAuthorized: '系統授權',
    contact: '購買授權與聯絡管理員',
    contactTitle: '喜歡這個系統嗎？',
    contactDesc: '如果您是非會員並希望獲得永久使用權限，或是有任何功能建議與 Bug 回報，歡迎聯繫開發者。公餘時間維護，回覆較慢請見諒。',
    contactEmail: '聯絡管理員',
    documentation: '使用說明',
    copyAll: '複製全文',
    copied: '已複製!',
    print: '列印',
    confirmImport: '警告：確認覆蓋資料？',
    confirmImportMessage: '您即將匯入 {fileName}。',
    confirmImportWarning: '這將會完全清除目前的交易紀錄與設定，且無法復原。',
    confirmOverride: '確認覆蓋',
    documentationContent: `# TradeView 使用說明書

> **隱私與安全聲明** :
> 本系統採用離線優先架構，**所有交易資料皆儲存於您的個人電腦或手機瀏覽器中**，不會上傳至任何伺服器。**系統不涉及收集個人資料**，請安心使用。

## 1. 系統簡介
TradeView 是一個支援台股與美股的資產管理工具，協助投資人追蹤資產變化、計算報酬率並管理資金流向。

## 2. 快速開始
1. **建立帳戶**: 前往「證券戶管理」新增您的銀行或證券帳戶。
2. **匯入資金**: 前往「資金管理」，選擇「匯入資金」將薪資或存款記錄到系統中。
3. **新增交易**: 點擊右上角「記一筆」輸入股票買賣紀錄。
4. **查看報表**: 回到「儀表板」查看資產折線圖與績效。

## 3. 功能詳解

### 資金管理 (Fund Management)
* **匯入 (Import)**: 外部資金流入 (如薪資)。
* **匯出 (Export)**: 資金流出 (如生活費提領)。
* **轉帳 (Transfer)**: 不同帳戶間的資金移動 (如銀行轉證券戶)。
* **利息**: 記錄存款或證券戶利息。

### 交易類別
* **Buy/Sell**: 一般買賣。
* **Dividend**: 股票股息 (股數增加)。
* **Cash Dividend**: 現金股息 (餘額增加)。

## 4. 常見問題 (FAQ)
Q: 如何計算年化報酬率？
A: 系統採用資金加權報酬率概念，考慮資金進出的時間點進行估算。

Q: 匯率如何設定？
A: 可在右上角設定全域 USD/TWD 匯率，或在轉帳時指定當下匯率。

Q: 資料儲存與隱私？
A: 如同前述，**資料完全儲存在您個人的裝置（電腦或手機）上**，不涉及個資問題。為了避免裝置損壞或瀏覽器快取被清除導致資料遺失，**強烈建議定期使用下方的「備份資料」功能**自行保存 JSON 檔案。

Q: 無法下載備份檔？
A: 若您是在 LINE 開啟連結，系統可能會阻擋彈跳視窗導致無法正常下載。建議您在瀏覽器 (如 Chrome 或 Safari) 再進行操作。

Q: 為何股價無法更新？
A: 檢查該隻股票市場是否設定正確，若錯誤請在「交易紀錄」裡選擇「批量修改市場」，進行更換市場。

Q: 會員有何優點？
A: 界面會多出再平衡、圖表、年度績效表，讓使用者更加了解自己投資結果。

Q: 會員的年度績效表為何有勾勾？
A: 具勾勾部份是顯示該年度年底的績效表現，無勾勾部份是按你的報酬率反推的你績效表現，僅是預估效果。

Q: 股價與匯率為何與按「AI聯網更新股價&匯率」得到現價為何不同？
A: 股價與匯率因為是抓取網頁現值，故現值會慢三分鐘至五分鐘不等，所以勿拿來當買賣的參考值，建議買賣的參考仍以証券公司為主，此軟體僅適用作統計資產功能，例如有緊急預備金、旅遊基金、退休金、定存、股債券等統計參考，並無証券交易買賣功能；另外投資有賺有賠，記得預留緊急預備金，感謝您的使用。

## 5. 重要免責聲明

**投資風險警告**：
- ⚠️ 投資有風險，過往績效不代表未來表現。
- 本應用程式僅提供資產統計與管理功能，不提供投資建議。
- 本應用程式不具備證券交易功能，無法進行實際買賣操作。
- 所有投資決策應由使用者自行判斷，並承擔相關風險。
- 使用者應自行評估投資風險，並在需要時諮詢專業財務顧問。

**非投資建議聲明**：
- 本應用程式提供的所有資訊、分析、圖表與 AI 建議僅供參考，不構成任何投資建議。
- 本應用程式不保證任何投資結果或報酬率。
- 使用者應根據自身情況做出投資決策，並對所有投資決策負責。

**資料準確性**：
- 本應用程式提供的股價、匯率等資料可能因網路延遲而與實際市場價格有所差異。
- 使用者不應將本應用程式的資料作為實際買賣的唯一參考依據。
- 建議以證券公司或金融機構提供的即時報價為準。`,
    androidPublish: '上架安卓商店指南',
    androidPublishTitle: '如何將此工具上架到 Google Play？',
    androidPublishDesc: '您可以透過 TWA 技術將網頁轉為 Android App：\n1. 註冊 Google 開發者帳號 ($25)。\n2. 使用 Bubblewrap CLI 工具封裝您的網站網址。\n3. 在 Play Console 上傳 AAB 檔並提交審核。',
  },
  transactionForm: {
    addTransaction: '新增交易',
    editTransaction: '編輯交易',
    date: '日期',
    account: '交易帳戶',
    market: '市場',
    ticker: '代號 (Ticker)',
    tickerPlaceholder: 'e.g. 2330, AAPL, or DTLA',
    category: '類別',
    price: '價格',
    quantity: '數量 (股)',
    quantityFixed: '數量 (固定為 1)',
    fees: '手續費 / 稅金',
    note: '備註',
    cancel: '取消',
    saveTransaction: '儲存交易',
    updateTransaction: '更新交易',
    confirmTitle: '確認交易資訊',
    confirmMessage: '請仔細確認以下資訊是否正確：',
    dateLabel: '日期：',
    accountLabel: '交易帳戶：',
    marketLabel: '市場：',
    tickerLabel: '代號：',
    typeLabel: '類型：',
    priceLabel: '價格：',
    quantityLabel: '數量：',
    feesLabel: '手續費：',
    noteLabel: '備註：',
    totalAmount: '總金額：',
    shares: '股',
    backToEdit: '返回修改',
    confirmSave: '確認儲存',
    previewTitle: '計算金額預覽：',
    calculationFormula: '計算公式：',
    marketTW: '台股 (TW)',
    marketUS: '美股 (US)',
    marketUK: '英國股 (UK)',
    marketJP: '日本股 (JP)',
    typeBuy: '買入 (Buy)',
    typeSell: '賣出 (Sell)',
    typeDividend: '股票股息 (Reinvest)',
    typeCashDividend: '現金股息 (Cash)',
    typeTransferIn: '匯入持股 (Transfer In)',
    typeTransferOut: '匯出持股 (Transfer Out)',
    placeholderPrice: '單價',
    placeholderQuantity: '股息總額',
    errorNoAccount: '請先建立並選擇證券帳戶',
    feesShort: '手續費',
    formulaNote: ' (台股向下取整)',
  },
  fundForm: {
    addFundRecord: '新增資金紀錄',
    editFundRecord: '編輯資金紀錄',
    date: '日期',
    type: '類型',
    account: '帳戶',
    sourceAccount: '來源帳戶',
    amount: '金額',
    targetAccount: '轉入目標帳戶',
    selectAccount: '選擇帳戶...',
    exchangeRate: '匯率',
    exchangeRateUSD: '匯率 (TWD/USD)',
    exchangeRateJPY: '匯率 (TWD/JPY)',
    crossCurrencyTransfer: '不同幣別轉帳',
    usdConversion: '美金換算',
    jpyConversion: '日幣換算',
    sameCurrencyTransfer: '同幣別轉帳 (匯率 1.0)',
    fees: '手續費 ({currency})',
    feesNote: '匯費/轉帳費',
    note: '備註',
    cancel: '取消',
    updateRecord: '更新記錄',
    confirmExecute: '確認執行',
    typeDeposit: '匯入資金 (Import/Salary)',
    typeWithdraw: '匯出資金 (Export/Living)',
    typeTransfer: '內部轉帳 (Transfer)',
    typeInterest: '利息收入 (Interest)',
    confirmTitle: '確認資金記錄',
    confirmMessage: '請仔細確認以下資訊是否正確：',
    dateLabel: '日期：',
    typeLabel: '類型：',
    accountLabel: '帳戶：',
    targetAccountLabel: '目標帳戶：',
    amountLabel: '金額：',
    exchangeRateLabel: '匯率：',
    feesLabel: '手續費：',
    noteLabel: '備註：',
    totalTWD: '總金額 ({currency})：',
    backToEdit: '返回修改',
    confirmSave: '確認儲存',
    errorNoAccount: '請先建立帳戶',
  },
};

// 英文翻譯
const en: Translations = {
  baseCurrency: {
    TWD: 'TWD',
    USD: 'USD',
    JPY: 'JPY',
    EUR: 'EUR',
    GBP: 'GBP',
    HKD: 'HKD',
    KRW: 'KRW',
  },
  common: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    save: 'Save',
    close: 'Close',
    loading: 'Loading...',
    search: 'Search',
    logoutConfirm: 'Are you sure you want to logout?',
  },
  nav: {
    dashboard: 'Dashboard',
    history: 'Transactions',
    funds: 'Funds',
    accounts: 'Accounts',
    rebalance: 'Rebalance',
    simulator: 'Simulator',
    help: 'System',
    logout: 'Logout',
  },
  pages: {
    dashboard: 'Portfolio Dashboard',
    history: 'History (Transactions + Cash Flow)',
    funds: 'Fund Management',
    accounts: 'Account Management',
    rebalance: 'Portfolio Rebalance',
    simulator: 'Asset Allocation Simulator',
    help: 'System Management & Backup',
  },
  login: {
    title: 'TradeView Login',
    subtitle: 'Taiwan & US Stock Portfolio Management',
    email: 'Email',
    password: 'Password',
    login: 'Login',
    privacy: 'Privacy Notice',
    privacyDesc: 'All data is stored locally on your device. The system does not collect personal information. Please remember to backup regularly.',
    riskDisclaimer: 'Risk Disclaimer',
    riskDisclaimerDesc: 'Investing involves risks. Past performance does not guarantee future results. Please carefully assess your risk tolerance.',
  },
  dashboard: {
    netCost: 'Net Cost',
    totalAssets: 'Total Assets',
    totalPL: 'Total P/L',
    annualizedReturn: 'Annualized Return (CAGR)',
    detail: 'Detail',
    includeCash: 'Incl. Cash',
    detailedStatistics: 'Detailed Statistics',
    totalCost: 'Total Cost',
    totalPLAmount: 'Total P/L Amount',
    accumulatedCashDividends: 'Accumulated Cash Dividends',
    accumulatedStockDividends: 'Accumulated Stock Dividends',
    annualizedReturnRate: 'Annualized Return Rate',
    avgExchangeRate: 'Avg Exchange Rate (TWD/USD)',
    currentExchangeRate: 'Current Exchange Rate',
    totalReturnRate: 'Total Return Rate',
    assetVsCostTrend: 'Asset vs Cost Trend',
    aiCorrectHistory: 'AI Correct Historical Assets',
    allocation: 'Allocation',
    annualPerformance: 'Annual Performance',
    year: 'Year',
    startAssets: 'Start Assets',
    annualNetInflow: 'Annual Net Inflow',
    endAssets: 'End Assets',
    annualProfit: 'Annual Profit',
    annualROI: 'Annual ROI',
    brokerageAccounts: 'Brokerage Accounts',
    accountName: 'Account Name',
    totalAssetsNT: 'Total Assets (NT$)',
    marketValueNT: 'Market Value (NT$)',
    balanceNT: 'Balance (NT$)',
    profitNT: 'Profit (NT$)',
    annualizedROI: 'Annualized ROI',
    displayCurrency: 'Display Currency',
    ntd: 'NTD',
    usd: 'USD',
    portfolioHoldings: 'Portfolio Holdings',
    mergedDisplay: 'Merged (By Symbol)',
    detailedDisplay: 'Detailed (By Account)',
    aiUpdatePrices: 'AI Update Prices & Exchange Rates',
    estimatedGrowth8: 'Est. 8% Growth',
    chartLoading: 'Loading chart...',
    noChartData: 'Please add fund deposits and transactions first',
    noHoldings: 'No holdings',
    noAccounts: 'No brokerage accounts. Please add accounts in Account Management.',
    costBreakdown: 'Net Invested Cost Breakdown',
    netInvestedBreakdown: 'Net Invested Breakdown',
    calculationFormula: 'Formula: Net Invested = Deposits - Withdrawals',
    formulaNote: 'Note: For USD accounts, historical exchange rate is used if available, otherwise current rate from settings. Transfers and interest are not included in cost.',
    attention: 'Attention',
    date: 'Date',
    category: 'Category',
    originalAmount: 'Original Amount',
    twdCost: 'Cost ({currency})',
    totalNetInvested: 'Total (Net Invested)',
    deposit: 'Deposit (+)',
    withdraw: 'Withdraw (-)',
    fixedTWD: 'Fixed TWD Amount',
    historicalRate: 'Historical Rate',
    currentRate: 'Current Rate',
    taiwanDollar: 'TWD',
    chartLabels: {
      investmentCost: 'Investment Cost',
      accumulatedPL: 'Accumulated P/L',
      estimatedAssets: 'Est. Total Assets (8%)',
      totalAssets: 'Total Assets',
      realData: ' (Real Price)',
      estimated: ' (Estimated)',
    },
    aiAdvisor: 'Gemini AI Investment Advisor',
    aiAdvisorDesc: 'Analyze your portfolio allocation, risks, and potential opportunities.',
    startAnalysis: 'Start Analysis',
    analyzing: 'Analyzing...',
    viewCalculationDetails: 'View Details',
    notInvestmentAdvice: 'This application does not provide investment advice. All analysis results are for reference only.',
  },
  funds: {
    title: 'Fund Management',
    operations: 'Operations',
    clearAll: 'Clear All Funds',
    batchImport: 'Batch Import',
    addRecord: '+ Add Record',
    filter: 'Filter',
    clearFilters: 'Clear All Filters',
    accountFilter: 'Account',
    typeFilter: 'Type',
    dateFrom: 'From Date',
    dateTo: 'To Date',
    allAccounts: 'All Accounts',
    allTypes: 'All Types',
    deposit: 'Deposit',
    withdraw: 'Withdraw',
    transfer: 'Transfer',
    interest: 'Interest',
    showRecords: 'Showing {count} records',
    totalRecords: 'Total {total}',
    last30Days: 'Last 30 Days',
    thisYear: 'This Year',
    confirmClearAll: 'Confirm Clear All Fund Records?',
    confirmClearAllMessage: 'This will delete all deposit, withdrawal, transfer and interest records. This action cannot be undone. Please backup your data first.',
    confirmClear: 'Confirm Clear',
  },
  history: {
    operations: 'Operations',
    batchUpdateMarket: 'Batch Update Market',
    clearAll: 'Clear All Transactions',
    batchImport: 'Batch Import',
    addRecord: '+ Add Record',
    filter: 'Filter',
    accountFilter: 'Filter by Account',
    tickerFilter: 'Filter by Ticker',
    dateFrom: 'From Date',
    dateTo: 'To Date',
    includeCashFlow: 'Include Cash Flow Records',
    clearFilters: 'Clear All Filters',
    showingRecords: 'Showing {count} records',
    totalRecords: 'Total {total}: {transactionCount} transactions{hasCashFlow}',
    last30Days: 'Last 30 Days',
    thisYear: 'This Year',
    noTransactions: 'No transactions',
    // Fix: Key 'noMatchingTransactions' was missing and malformed
    noMatchingTransactions: 'No matching transactions found',
    edit: 'Edit',
    delete: 'Delete',
    includeCashFlowDesc: 'Check to show deposits, withdrawals, transfers, etc. for viewing balance changes',
    hiddenCashFlowRecords: '{count} cash flow records hidden',
    cashFlowDeposit: 'Deposit',
    cashFlowWithdraw: 'Withdrawal',
    cashFlowTransfer: 'Transfer Out',
    cashFlowTransferIn: 'Transfer In',
  },
  labels: {
    date: 'Date',
    account: 'Account',
    amount: 'Amount',
    balance: 'Balance',
    action: 'Action',
    type: 'Type',
    price: 'Price',
    quantity: 'Quantity',
    currency: 'Currency',
    fee: 'Fee',
    exchangeRate: 'Exchange Rate',
    totalCost: 'Total Cost',
    category: 'Category',
    description: 'Symbol/Description',
    note: 'Note',
  },
  holdings: {
    portfolioHoldings: 'Portfolio Holdings',
    mergedDisplay: 'Merged by Symbol',
    detailedDisplay: 'Detailed by Account',
    aiUpdatePrices: 'AI Update Prices & Exchange Rates',
    aiSearching: 'AI Searching...',
    market: 'Market',
    ticker: 'Ticker',
    quantity: 'Quantity',
    currentPrice: 'Current Price',
    weight: 'Weight',
    cost: 'Total Cost',
    marketValue: 'Market Value',
    profitLoss: 'P/L',
    annualizedROI: 'Annualized ROI',
    dailyChange: 'Daily Change',
    avgPrice: 'Avg Price',
    noHoldings: 'No holdings. Please add transactions.',
  },
  accounts: {
    addAccount: 'Add Brokerage / Bank Account',
    accountName: 'Account Name',
    accountNamePlaceholder: 'e.g. Fubon Securities, Firstrade',
    currency: 'Currency',
    currencyTWD: 'TWD',
    currencyUSD: 'USD',
    currencyJPY: 'JPY',
    subBrokerage: 'Sub-brokerage',
    add: 'Add',
    update: 'Update',
    editAccount: 'Edit Account',
    balance: 'Balance',
    cancel: 'Cancel',
    updateAccount: 'Update Account',
    confirmDelete: 'Confirm Delete Account',
    confirmDeleteMessage: 'Are you sure you want to delete "{name}"?',
    deleteWarning: 'Note: This will not delete historical transaction records for this account, but may cause issues when filtering.',
    deleteAccount: 'Confirm Delete',
    noAccounts: 'No accounts yet. Please add your first brokerage account above.',
    cashBalance: 'Cash Balance',
    editAccountTitle: 'Edit Account',
  },
  rebalance: {
    title: 'Stock Rebalancing',
    resetToCurrent: 'Reset to Current Weights',
    totalAssets: 'Total Assets (Incl. Cash)',
    enable: 'Enable',
    symbol: 'Symbol',
    currentPrice: 'Current Price',
    currentValue: 'Current Value',
    currentWeight: 'Current Weight',
    targetWeight: 'Target Weight',
    targetValue: 'Target Value',
    adjustAmount: 'Adjust Amount',
    suggestedAction: 'Suggested Action',
    cash: 'Cash',
    totalEnabled: 'Total (Enabled Items)',
    remainingFunds: 'Remaining Funds',
    notParticipating: 'Not Participating',
    accounts: ' accounts',
    description: 'Description:',
    description1: 'Stocks with the same name are automatically merged and displayed. Target weights are allocated proportionally to each account based on current values.',
    description2: 'Check the "Enable" column to select which stocks/bonds need rebalancing. Unchecked items will not participate in rebalancing calculations.',
    description3: 'Cash can also be checked. If checked, you can manually set the cash target percentage; if not checked, cash will remain unchanged.',
    description4: 'Target weights are automatically saved. If cash target is not manually set, the system will automatically calculate and allocate the remaining percentage to cash; if manually set, your specified value will be used.',
    description5: 'If the "Cash" target percentage is negative, it means your stock target allocation exceeds 100%. Please reduce some stock target percentages.',
    description6: 'Click "Reset to Current Weights" to quickly reset all target values to current status.',
    buy: 'Buy',
    sell: 'Sell',
  },
  simulator: {
    title: 'Asset Allocation Simulator Description',
    description: 'This tool allows you to compare expected returns of different asset allocations. Enter the annualized return rates since inception for various stocks or ETFs as assumptions, and the system will calculate the expected performance of your portfolio based on your allocation ratios.',
    descriptionWarning: '⚠️ Note: Past performance does not guarantee future results. This simulation is for reference only.',
    basicSettings: 'Basic Settings',
    initialAmount: 'Initial Investment Amount (TWD)',
    investmentYears: 'Investment Years',
    regularInvestment: 'Regular Investment (Optional)',
    regularAmount: 'Regular Investment Amount (TWD)',
    frequency: 'Investment Frequency',
    monthly: 'Monthly',
    quarterly: 'Quarterly',
    yearly: 'Yearly',
    annualTotal: 'Annual Total Investment',
    setToZero: 'Set to 0 to disable regular investment',
    importFromHoldings: 'Import from Existing Holdings',
    importButton: 'Import from Existing Holdings',
    manualAdd: 'Manually Add Asset',
    ticker: 'Stock Ticker',
    tickerPlaceholder: 'e.g. 0050',
    market: 'Market',
    marketTW: 'Taiwan (TW)',
    marketUS: 'US (US)',
    marketUK: 'UK (UK)',
    marketJP: 'Japan (JP)',
    annualReturn: 'Annualized Return (%)',
    autoQuery: '🔍 Auto Query',
    querying: 'Querying',
    allocation: 'Allocation (%)',
    add: 'Add',
    assetList: 'Asset Allocation List',
    autoBalance: 'Auto Balance',
    clearAll: 'Clear All',
    allocationSum: 'Total Allocation:',
    totalInvested: 'Total Invested',
    finalValue: 'Final Value',
    totalReturn: 'Total Return',
    portfolioAnnualReturn: 'Portfolio Annualized Return',
    initial: 'Initial',
    yearlyProjection: 'Yearly Projection Trend Chart',
    yearlyReturnAnalysis: 'Yearly Return Analysis',
    detailedYearlyProjection: 'Detailed Yearly Projection',
    year: 'Year',
    assetValue: 'Asset Value',
    yearlyReturn: 'Yearly Return',
    cumulativeInvestment: 'Cumulative Investment',
    yearlyReturnRate: 'Yearly Return Rate',
    allocationWarning: '⚠️ Total allocation must equal 100%, currently',
    confirmClear: 'Confirm Clear',
    confirmClearMessage: 'Are you sure you want to clear all asset allocations? This action cannot be undone.',
    dataWarning: '⚠️ Data Integrity Warning:',
    dataWarningDesc: 'Suggestion: If the calculation results are significantly lower than expected, it may be because Yahoo Finance historical data is incomplete. You can refer to official sources or manually enter a more accurate annualized return rate.',
    cagrExplanation: '📊 Annualized Return Calculation Explanation:',
    cagrFormula: 'CAGR = ((Current Price / Initial Price) ^ (1 / Years)) - 1',
    cagrFormulaDesc: 'The system uses the CAGR (Compound Annual Growth Rate) formula:',
    cagrExample: 'This represents the average compound return rate per year if purchased at IPO and held until now.',
    cagrExampleValue: 'Example: Stock rises from 100 to 200 over 5 years, annualized return is approximately 14.87%',
    errorEnterTicker: 'Please enter stock ticker',
    errorAllocationRange: 'Allocation must be between 0% and 100%',
    errorAllocationSum: 'Total allocation cannot exceed 100%',
    errorNoHoldings: 'No holdings data available to import',
    errorEnterTickerFirst: 'Please enter stock ticker first',
    errorCannotGetReturn: 'Unable to get annualized return for {ticker}, please enter manually',
    errorQueryFailed: 'Failed to query annualized return, please enter manually',
    close: 'Close',
    cancel: 'Cancel',
    yearPrefix: 'Year',
    yearSuffix: '',
    queryingReturn: 'Querying annualized return for {ticker}...',
    autoQueryTitle: 'Auto query annualized return since IPO',
  },
  help: {
    dataManagement: 'Data Management',
    export: 'Export',
    exportDesc: 'Export your transaction records, account settings, and stock price information as a JSON file. Regular backups are recommended to prevent data loss.',
    downloadBackup: 'Download Backup (.json)',
    import: 'Import',
    importWarning: 'Warning: Importing a backup file will completely overwrite your current system data.',
    uploadBackup: 'Upload Backup File',
    authorizedUsers: 'Authorized Users',
    authorizedUsersDesc: 'The following is the system default list of emails that can log in without a password (masked for privacy):',
    emailAccount: 'Email Account',
    status: 'Status',
    systemAuthorized: 'System Authorized',
    contact: 'Purchase Authorization & Contact Administrator',
    contactTitle: 'Like this system?',
    contactDesc: 'If you are a non-member and wish to obtain permanent usage rights, or have any feature suggestions and bug reports, please contact the developer. Maintained during spare time, please understand that responses may be slower.',
    contactEmail: 'Contact Administrator (Email)',
    documentation: 'Documentation',
    copyAll: 'Copy All',
    copied: 'Copied!',
    print: 'Print',
    confirmImport: 'Warning: Confirm Override Data?',
    confirmImportMessage: 'You are about to import {fileName}.',
    confirmImportWarning: 'This will completely clear your current transaction records and settings, and cannot be undone.',
    confirmOverride: 'Confirm Override',
    documentationContent: `# TradeView User Manual

> **Privacy & Security Statement**:
> This system adopts an offline-first architecture. **All transaction data is stored on your personal computer or mobile browser** and is not uploaded to any server. **The system does not involve collecting personal information**. Please use with confidence.

## 1. System Introduction
TradeView is an asset management tool that supports Taiwan and US stocks, helping investors track asset changes, calculate returns, and manage fund flows.

## 2. Quick Start
1. **Create Account**: Go to "Account Management" to add your bank or brokerage account.
2. **Import Funds**: Go to "Fund Management", select "Import Funds" to record salary or deposits into the system.
3. **Add Transaction**: Click "Add Transaction" in the top right corner to input stock buy/sell records.
4. **View Reports**: Return to "Dashboard" to view asset line charts and performance.

## 3. Feature Details

### Fund Management
* **Import**: External fund inflow (e.g., salary).
* **Export**: Fund outflow (e.g., living expenses withdrawal).
* **Transfer**: Fund movement between different accounts (e.g., bank to brokerage account).
* **Interest**: Record deposit or brokerage account interest.

### Transaction Types
* **Buy/Sell**: General buy/sell transactions.
* **Dividend**: Stock dividend (number of shares increases).
* **Cash Dividend**: Cash dividend (balance increases).

## 4. Frequently Asked Questions (FAQ)
Q: How is the annualized return rate calculated?
A: The system uses the money-weighted return concept, taking into account the timing of fund inflows and outflows for estimation.

Q: How to set the exchange rate?
A: You can set the global USD/TWD exchange rate in the top right corner, or specify the current exchange rate when transferring funds.

Q: Data storage and privacy?
A: As mentioned above, **data is completely stored on your personal device (computer or mobile)** and does not involve personal information issues. To avoid data loss due to device damage or browser cache clearing, **it is strongly recommended to regularly use the "Backup Data" function below** to save JSON files yourself.

Q: Cannot download backup file?
A: If you open the link in LINE, the system may block pop-up windows, preventing normal downloads. It is recommended to use a browser (such as Chrome or Safari) for operations.

Q: Why can't stock prices be updated?
A: Check if the stock market is set correctly. If incorrect, select "Batch Update Market" in "Transaction History" to change the market.

Q: What are the benefits of membership?
A: The interface will include rebalancing, charts, and annual performance tables, allowing users to better understand their investment results.

Q: Why are there checkmarks in the member's annual performance table?
A: The parts with checkmarks show the performance at the end of that year. The parts without checkmarks are performance estimates calculated by reverse-engineering based on your return rate, which are only estimated effects.

Q: Why are stock prices and exchange rates different from the current prices obtained by clicking "AI Update Prices & Exchange Rates"?
A: Stock prices and exchange rates are scraped from web current values, so the current values may lag by three to five minutes. Therefore, do not use them as references for buying and selling. It is recommended to use securities companies as the main reference for buying and selling. This software is only suitable for statistical asset functions, such as emergency funds, travel funds, retirement funds, fixed deposits, stocks and bonds, etc. It does not have securities trading functions. Additionally, investments have profits and losses. Remember to reserve emergency funds. Thank you for using.

## 5. Important Disclaimers

**Investment Risk Warning**:
- ⚠️ Investments carry risk. Past performance does not guarantee future results.
- This application provides asset tracking and management features only. It does not provide investment advice.
- This application does not have securities trading functionality and cannot perform actual buy/sell operations.
- All investment decisions should be made by users at their own discretion, and users bear all related risks.
- Users should evaluate investment risks independently and consult professional financial advisors when needed.

**Not Investment Advice Statement**:
- All information, analysis, charts, and AI suggestions provided by this application are for reference only and do not constitute investment advice.
- This application does not guarantee any investment results or returns.
- Users should make investment decisions based on their own circumstances and are responsible for all investment decisions.

**Data Accuracy**:
- Stock prices, exchange rates, and other data provided by this application may differ from actual market prices due to network delays.
- Users should not use data from this application as the sole reference for actual trading.
- It is recommended to use real-time quotes provided by securities companies or financial institutions.`,
    androidPublish: 'Android Store Publishing Guide',
    androidPublishTitle: 'How to publish this tool on Google Play?',
    androidPublishDesc: 'You can convert the web app to an Android App using TWA:\n1. Register for a Google Developer account ($25).\n2. Use Bubblewrap CLI to wrap your website URL.\n3. Upload the AAB file to Play Console and submit for review.',
  },
  transactionForm: {
    addTransaction: 'Add Transaction',
    editTransaction: 'Edit Transaction',
    date: 'Date',
    account: 'Account',
    market: 'Market',
    ticker: 'Ticker',
    tickerPlaceholder: 'e.g. 2330, AAPL, or DTLA',
    category: 'Category',
    price: 'Price',
    quantity: 'Quantity (Shares)',
    quantityFixed: 'Quantity (Fixed at 1)',
    fees: 'Fees / Taxes',
    note: 'Note',
    cancel: 'Cancel',
    saveTransaction: 'Save Transaction',
    updateTransaction: 'Update Transaction',
    confirmTitle: 'Confirm Transaction',
    confirmMessage: 'Please carefully review the following information:',
    dateLabel: 'Date:',
    accountLabel: 'Account:',
    marketLabel: 'Market:',
    tickerLabel: 'Ticker:',
    typeLabel: 'Type:',
    priceLabel: 'Price:',
    quantityLabel: 'Quantity:',
    feesLabel: 'Fees:',
    noteLabel: 'Note:',
    totalAmount: 'Total Amount:',
    shares: 'shares',
    backToEdit: 'Back to Edit',
    confirmSave: 'Confirm & Save',
    previewTitle: 'Amount Preview:',
    calculationFormula: 'Calculation Formula:',
    marketTW: 'Taiwan (TW)',
    marketUS: 'US (US)',
    marketUK: 'UK (UK)',
    marketJP: 'Japan (JP)',
    typeBuy: 'Buy',
    typeSell: 'Sell',
    typeDividend: 'Stock Dividend (Reinvest)',
    typeCashDividend: 'Cash Dividend',
    typeTransferIn: 'Transfer In',
    typeTransferOut: 'Transfer Out',
    placeholderPrice: 'Price per Share',
    placeholderQuantity: 'Total Dividend',
    errorNoAccount: 'Please create and select a brokerage account first',
    feesShort: 'fees',
    formulaNote: ' (TW floor)',
  },
  fundForm: {
    addFundRecord: 'Add Fund Record',
    editFundRecord: 'Edit Fund Record',
    date: 'Date',
    type: 'Type',
    account: 'Account',
    sourceAccount: 'Source Account',
    amount: 'Amount',
    targetAccount: 'Target Account',
    selectAccount: 'Select Account...',
    exchangeRate: 'Exchange Rate',
    exchangeRateUSD: 'Exchange Rate (TWD/USD)',
    exchangeRateJPY: 'Exchange Rate (TWD/JPY)',
    crossCurrencyTransfer: 'Cross-currency Transfer',
    usdConversion: 'USD Conversion',
    jpyConversion: 'JPY Conversion',
    sameCurrencyTransfer: 'Same Currency Transfer (Rate 1.0)',
    fees: 'Fees ({currency})',
    feesNote: 'Transfer/Wire Fee',
    note: 'Note',
    cancel: 'Cancel',
    updateRecord: 'Update Record',
    confirmExecute: 'Confirm & Save',
    typeDeposit: 'Deposit',
    typeWithdraw: 'Withdraw',
    typeTransfer: 'Transfer',
    typeInterest: 'Interest',
    confirmTitle: 'Confirm Fund Record',
    confirmMessage: 'Please carefully confirm the following information:',
    dateLabel: 'Date:',
    typeLabel: 'Type:',
    accountLabel: 'Account:',
    targetAccountLabel: 'Target Account:',
    amountLabel: 'Amount:',
    exchangeRateLabel: 'Exchange Rate:',
    feesLabel: 'Fees:',
    noteLabel: 'Note:',
    totalTWD: 'Total ({currency}):',
    backToEdit: 'Back to Edit',
    confirmSave: 'Confirm Save',
    errorNoAccount: 'Please create an account first',
  },
};

// 日文翻譯
const ja: Translations = {
  baseCurrency: { TWD: '台湾ドル', USD: '米ドル', JPY: '日本円', EUR: 'ユーロ', GBP: '英ポンド', HKD: '香港ドル', KRW: '韓国ウォン' },
  common: { confirm: '確認', cancel: 'キャンセル', delete: '削除', edit: '編集', save: '保存', close: '閉じる', loading: '読み込み中...', search: '検索', logoutConfirm: 'ログアウトしますか？' },
  nav: { dashboard: 'ダッシュボード', history: '取引履歴', funds: '資金管理', accounts: '口座', rebalance: 'リバランス', simulator: 'シミュレータ', help: 'システム', logout: 'ログアウト' },
  pages: { dashboard: 'ポートフォリオダッシュボード', history: '履歴（取引＋資金フロー）', funds: '資金管理', accounts: '口座管理', rebalance: 'リバランス', simulator: '資産配分シミュレータ', help: 'システム管理とバックアップ' },
  login: { title: 'TradeView ログイン', subtitle: '台湾・米国株ポートフォリオ管理', email: 'Email', password: 'パスワード', login: 'ログイン', privacy: 'プライバシー', privacyDesc: 'データはデバイスにローカル保存されます。個人情報は収集しません。定期的なバックアップをお勧めします。', riskDisclaimer: 'リスク免責', riskDisclaimerDesc: '投資にはリスクがあります。過去の実績は将来の結果を保証しません。' },
  dashboard: { netCost: '純投入', totalAssets: '総資産', totalPL: '損益', annualizedReturn: '年率リターン(CAGR)', detail: '詳細', includeCash: '現金含む', detailedStatistics: '詳細統計', totalCost: '総コスト', totalPLAmount: '損益額', accumulatedCashDividends: '累積配当金', accumulatedStockDividends: '株式配当再投資', annualizedReturnRate: '年率リターン', avgExchangeRate: '平均為替', currentExchangeRate: '現在為替', totalReturnRate: '総リターン率', assetVsCostTrend: '資産vsコスト推移', aiCorrectHistory: 'AI履歴補正', allocation: 'アロケーション', annualPerformance: '年間成績', year: '年', startAssets: '期首資産', annualNetInflow: '年間純流入', endAssets: '期末資産', annualProfit: '年間損益', annualROI: '年間ROI', brokerageAccounts: '証券口座', accountName: '口座名', totalAssetsNT: '総資産', marketValueNT: '時価', balanceNT: '残高', profitNT: '損益', annualizedROI: '年率ROI', displayCurrency: '表示通貨', ntd: '台湾ドル', usd: '米ドル', portfolioHoldings: '保有銘柄', mergedDisplay: '合算（銘柄別）', detailedDisplay: '明細（口座別）', aiUpdatePrices: 'AIで株価・為替更新', estimatedGrowth8: '8%成長見込み', chartLoading: 'チャート読込中...', noChartData: '資金入金と取引を追加してください', noHoldings: '保有なし', noAccounts: '口座がありません。「口座管理」で追加してください。', costBreakdown: '純投入内訳', netInvestedBreakdown: '純投入計算', calculationFormula: '純投入＝入金－出金', formulaNote: '米ドル口座は履歴為替を優先。送金・利息はコストに含みません。', attention: '注意', date: '日付', category: 'カテゴリ', originalAmount: '元金', twdCost: 'コスト({currency})', totalNetInvested: '合計', deposit: '入金(+)', withdraw: '出金(-)', fixedTWD: '台湾ドル指定', historicalRate: '履歴為替', currentRate: '現在為替', taiwanDollar: '台湾ドル', chartLabels: { investmentCost: '投資コスト', accumulatedPL: '累積損益', estimatedAssets: '予測総資産(8%)', totalAssets: '総資産', realData: '(実価)', estimated: '(予測)' }, aiAdvisor: 'Gemini AIアドバイザー', aiAdvisorDesc: 'ポートフォリオのリスクと機会を分析します。', startAnalysis: '分析開始', analyzing: '分析中...', viewCalculationDetails: '計算詳細', notInvestmentAdvice: '投資アドバイスではありません。結果は参考情報です。' },
  funds: { title: '資金管理', operations: '操作', clearAll: '全削除', batchImport: '一括入力', addRecord: '+記録追加', filter: 'フィルタ', clearFilters: 'クリア', accountFilter: '口座', typeFilter: '種別', dateFrom: '開始日', dateTo: '終了日', allAccounts: '全口座', allTypes: '全種別', deposit: '入金', withdraw: '出金', transfer: '送金', interest: '利息', showRecords: '{count}件表示', totalRecords: '計{total}件', last30Days: '直近30日', thisYear: '今年', confirmClearAll: '全資金記録を削除しますか？', confirmClearAllMessage: '入金・出金・送金・利息記録が削除されます。元に戻せません。', confirmClear: '確認削除' },
  history: { operations: '操作', batchUpdateMarket: '市場一括変更', clearAll: '全取引削除', batchImport: '一括入力', addRecord: '+記録追加', filter: 'フィルタ', accountFilter: '口座', tickerFilter: '銘柄', dateFrom: '開始日', dateTo: '終了日', includeCashFlow: '資金フローを含む', clearFilters: 'クリア', showingRecords: '{count}件表示', totalRecords: '計{total}:{transactionCount}件取引{hasCashFlow}', last30Days: '直近30日', thisYear: '今年', noTransactions: '取引なし', noMatchingTransactions: '該当なし', edit: '編集', delete: '削除', includeCashFlowDesc: '入出金・送金記録を表示', hiddenCashFlowRecords: '{count}件の資金フロー非表示', cashFlowDeposit: '入金', cashFlowWithdraw: '出金', cashFlowTransfer: '送金出', cashFlowTransferIn: '送金入' },
  labels: { date: '日付', account: '口座', amount: '金額', balance: '残高', action: '操作', type: '種別', price: '単価', quantity: '数量', currency: '通貨', fee: '手数料', exchangeRate: '為替', totalCost: '総コスト', category: 'カテゴリ', description: '銘柄/説明', note: '備考' },
  holdings: { portfolioHoldings: '保有銘柄', mergedDisplay: '合算', detailedDisplay: '明細', aiUpdatePrices: 'AIで株価・為替更新', aiSearching: 'AI検索中...', market: '市場', ticker: '銘柄', quantity: '数量', currentPrice: '現在価格', weight: '比率', cost: '総コスト', marketValue: '時価', profitLoss: '損益', annualizedROI: '年率', dailyChange: '日次変動', avgPrice: '平均単価', noHoldings: '保有がありません。取引を追加してください。' },
  accounts: { addAccount: '口座追加', accountName: '口座名', accountNamePlaceholder: '例: 富邦證券, Firstrade', currency: '通貨', currencyTWD: '台湾ドル', currencyUSD: '米ドル', currencyJPY: '日本円', subBrokerage: '窓口', add: '追加', update: '更新', editAccount: '編集', balance: '残高', cancel: 'キャンセル', updateAccount: '更新', confirmDelete: '削除確認', confirmDeleteMessage: '「{name}」を削除しますか？', deleteWarning: '取引履歴は削除されませんが、フィルタで異常が出る場合があります。', deleteAccount: '削除', noAccounts: '口座がありません。', cashBalance: '現金残高', editAccountTitle: '口座編集' },
  rebalance: { title: 'リバランス', resetToCurrent: '現状にリセット', totalAssets: '総資産（現金含む）', enable: '有効', symbol: '銘柄', currentPrice: '現在価格', currentValue: '現在価値', currentWeight: '現在比率', targetWeight: '目標比率', targetValue: '目標価値', adjustAmount: '調整額', suggestedAction: '推奨操作', cash: '現金', totalEnabled: '有効合計', remainingFunds: '残資金', notParticipating: '対象外', accounts: '口座', description: '説明：', description1: '同一銘柄は自動合算されます。', description2: '「有効」でリバランス対象を選択します。', description3: '現金も選択できます。', description4: '目標比率は自動保存されます。', description5: '現金目標がマイナスの場合、銘柄目標を減らしてください。', description6: '「現状にリセット」で一括リセット。', buy: '買い', sell: '売り' },
  simulator: { title: '資産配分シミュレータ', description: '異なる資産配分の期待リターンを比較できます。', descriptionWarning: '⚠️ 過去の実績は将来を保証しません。参考情報です。', basicSettings: '基本設定', initialAmount: '初期投資額', investmentYears: '投資年数', regularInvestment: '定期投資（任意）', regularAmount: '定期投資額', frequency: '頻度', monthly: '月', quarterly: '四半期', yearly: '年', annualTotal: '年間合計', setToZero: '0で無効', importFromHoldings: '保有から取り込み', importButton: '取り込み', manualAdd: '手動追加', ticker: '銘柄', tickerPlaceholder: '例: 0050', market: '市場', marketTW: '台湾(TW)', marketUS: '米国(US)', marketUK: '英国(UK)', marketJP: '日本(JP)', annualReturn: '年率リターン(%)', autoQuery: '🔍 自動取得', querying: '取得中', allocation: '配分(%)', add: '追加', assetList: '資産リスト', autoBalance: '自動配分', clearAll: '全クリア', allocationSum: '合計配分:', totalInvested: '総投資', finalValue: '最終価値', totalReturn: '総リターン', portfolioAnnualReturn: 'ポートフォリオ年率', initial: '初期', yearlyProjection: '年間予測', yearlyReturnAnalysis: '年間リターン分析', detailedYearlyProjection: '詳細年間予測', year: '年', assetValue: '資産価値', yearlyReturn: '年間リターン', cumulativeInvestment: '累積投資', yearlyReturnRate: '年間リターン率', allocationWarning: '⚠️ 配分合計は100%に', confirmClear: '全クリア確認', confirmClearMessage: '全資産配分をクリアしますか？', dataWarning: '⚠️ データ注意', dataWarningDesc: '結果が低い場合、Yahoo Financeのデータが不完全な可能性があります。', cagrExplanation: '年率リターン計算', cagrFormula: 'CAGR = ((現在価格/初期価格)^(1/年数))-1', cagrFormulaDesc: 'CAGR（年平均成長率）を使用', cagrExample: '上場時購入から現在までの年平均リターン', cagrExampleValue: '例: 100→200（5年）≈14.87%', errorEnterTicker: '銘柄を入力', errorAllocationRange: '0-100%の範囲で', errorAllocationSum: '合計100%以下に', errorNoHoldings: '取り込みデータなし', errorEnterTickerFirst: '先に銘柄を入力', errorCannotGetReturn: '{ticker}の年率取得不可、手動入力', errorQueryFailed: '取得失敗、手動入力', close: '閉じる', cancel: 'キャンセル', yearPrefix: '年', yearSuffix: '', queryingReturn: '{ticker}の年率取得中...', autoQueryTitle: '上場来年率を自動取得' },
  help: { dataManagement: 'データ管理', export: 'エクスポート', exportDesc: '取引・口座・株価をJSONで出力。定期的なバックアップ推奨。', downloadBackup: 'バックアップ(.json)ダウンロード', import: 'インポート', importWarning: 'バックアップ読み込みで現在のデータが上書きされます。', uploadBackup: 'バックアップアップロード', authorizedUsers: '認可ユーザー', authorizedUsersDesc: 'パスワードなしでログイン可能なメール一覧（プライバシー保護のためマスク）:', emailAccount: 'メール', status: '状態', systemAuthorized: 'システム認可', contact: '購入・お問い合わせ', contactTitle: 'ご利用ありがとう', contactDesc: 'メンバー外で永久利用権をご希望の方、機能提案・不具合報告は開発者まで。', contactEmail: '管理者連絡先(メール)', documentation: 'ドキュメント', copyAll: 'コピー', copied: 'コピーしました！', print: '印刷', confirmImport: 'データ上書きの確認', confirmImportMessage: '{fileName}を読み込みます。', confirmImportWarning: '現在の取引・設定が完全に消去されます。元に戻せません。', confirmOverride: '上書き確認', documentationContent: '# TradeView マニュアル\n\n**プライバシー**: 全データはデバイスにローカル保存。個人情報収集なし。定期的なバックアップを推奨。\n\n## 機能\n- 口座管理・資金管理・取引記録\n- ダッシュボード・リバランス・シミュレータ\n\n## リスク\n投資にはリスクがあります。本アプリは投資アドバイスを提供しません。', androidPublish: 'Android公開ガイド', androidPublishTitle: 'Google Playへの公開方法', androidPublishDesc: 'TWAでWebアプリをラップしてAndroid化できます。' },
  transactionForm: { addTransaction: '取引追加', editTransaction: '取引編集', date: '日付', account: '口座', market: '市場', ticker: '銘柄', tickerPlaceholder: '例: 2330, AAPL', category: 'カテゴリ', price: '単価', quantity: '数量', quantityFixed: '数量(1固定)', fees: '手数料', note: '備考', cancel: 'キャンセル', saveTransaction: '保存', updateTransaction: '更新', confirmTitle: '確認', confirmMessage: '内容を確認してください。', dateLabel: '日付:', accountLabel: '口座:', marketLabel: '市場:', tickerLabel: '銘柄:', typeLabel: '種別:', priceLabel: '単価:', quantityLabel: '数量:', feesLabel: '手数料:', noteLabel: '備考:', totalAmount: '合計:', shares: '株', backToEdit: '戻る', confirmSave: '保存', previewTitle: '金額プレビュー:', calculationFormula: '計算式:', marketTW: '台湾(TW)', marketUS: '米国(US)', marketUK: '英国(UK)', marketJP: '日本(JP)', typeBuy: '買い', typeSell: '売り', typeDividend: '株式配当', typeCashDividend: '現金配当', typeTransferIn: '振込', typeTransferOut: '振出', placeholderPrice: '単価', placeholderQuantity: '配当総額', errorNoAccount: '口座を先に作成してください', feesShort: '手数料', formulaNote: '(台湾株は切り捨て)' },
  fundForm: { addFundRecord: '資金記録追加', editFundRecord: '資金記録編集', date: '日付', type: '種別', account: '口座', sourceAccount: '送金元', amount: '金額', targetAccount: '送金先', selectAccount: '口座選択...', exchangeRate: '為替', exchangeRateUSD: '為替(TWD/USD)', exchangeRateJPY: '為替(TWD/JPY)', crossCurrencyTransfer: '異通貨送金', usdConversion: '米ドル換算', jpyConversion: '日本円換算', sameCurrencyTransfer: '同通貨送金(1.0)', fees: '手数料({currency})', feesNote: '送金手数料', note: '備考', cancel: 'キャンセル', updateRecord: '更新', confirmExecute: '保存', typeDeposit: '入金', typeWithdraw: '出金', typeTransfer: '送金', typeInterest: '利息', confirmTitle: '資金記録確認', confirmMessage: '内容を確認してください。', dateLabel: '日付:', typeLabel: '種別:', accountLabel: '口座:', targetAccountLabel: '送金先:', amountLabel: '金額:', exchangeRateLabel: '為替:', feesLabel: '手数料:', noteLabel: '備考:', totalTWD: '合計({currency}):', backToEdit: '戻る', confirmSave: '保存', errorNoAccount: '口座を先に作成してください' },
};

// 韓文翻譯
const ko: Translations = {
  baseCurrency: { TWD: '대만 달러', USD: '미국 달러', JPY: '일본 엔', EUR: '유로', GBP: '영국 파운드', HKD: '홍콩 달러', KRW: '대한민국 원' },
  common: { confirm: '확인', cancel: '취소', delete: '삭제', edit: '편집', save: '저장', close: '닫기', loading: '로딩 중...', search: '검색', logoutConfirm: '로그아웃 하시겠습니까?' },
  nav: { dashboard: '대시보드', history: '거래 내역', funds: '자금 관리', accounts: '계좌', rebalance: '리밸런싱', simulator: '시뮬레이터', help: '시스템', logout: '로그아웃' },
  pages: { dashboard: '포트폴리오 대시보드', history: '내역(거래+자금 흐름)', funds: '자금 관리', accounts: '계좌 관리', rebalance: '리밸런싱', simulator: '자산 배분 시뮬레이터', help: '시스템 관리 및 백업' },
  login: { title: 'TradeView 로그인', subtitle: '대만·미국 주식 포트폴리오 관리', email: '이메일', password: '비밀번호', login: '로그인', privacy: '개인정보', privacyDesc: '데이터는 기기에 로컬 저장됩니다. 개인정보를 수집하지 않습니다. 정기 백업을 권장합니다.', riskDisclaimer: '위험 고지', riskDisclaimerDesc: '투자에는 위험이 따릅니다. 과거 실적은 미래를 보장하지 않습니다.' },
  dashboard: { netCost: '순 투입', totalAssets: '총 자산', totalPL: '손익', annualizedReturn: '연평균 수익률(CAGR)', detail: '상세', includeCash: '현금 포함', detailedStatistics: '상세 통계', totalCost: '총 비용', totalPLAmount: '손익 금액', accumulatedCashDividends: '누적 배당금', accumulatedStockDividends: '주식 배당 재투자', annualizedReturnRate: '연평균 수익률', avgExchangeRate: '평균 환율', currentExchangeRate: '현재 환율', totalReturnRate: '총 수익률', assetVsCostTrend: '자산vs비용 추이', aiCorrectHistory: 'AI 기록 보정', allocation: '자산 배분', annualPerformance: '연간 성과', year: '연도', startAssets: '기초 자산', annualNetInflow: '연간 순 유입', endAssets: '기말 자산', annualProfit: '연간 손익', annualROI: '연간 ROI', brokerageAccounts: '증권 계좌', accountName: '계좌명', totalAssetsNT: '총 자산', marketValueNT: '시가총액', balanceNT: '잔액', profitNT: '손익', annualizedROI: '연평균 ROI', displayCurrency: '표시 통화', ntd: '대만 달러', usd: '미국 달러', portfolioHoldings: '보유 종목', mergedDisplay: '합산(종목별)', detailedDisplay: '상세(계좌별)', aiUpdatePrices: 'AI 주가·환율 업데이트', estimatedGrowth8: '8% 성장 예상', chartLoading: '차트 로딩 중...', noChartData: '자금 입금과 거래를 추가하세요', noHoldings: '보유 없음', noAccounts: '계좌가 없습니다. 계좌 관리에서 추가하세요.', costBreakdown: '순 투입 내역', netInvestedBreakdown: '순 투입 계산', calculationFormula: '순 투입=입금-출금', formulaNote: '미국 달러 계좌는 기록 환율 우선. 송금·이자는 비용에 포함하지 않습니다.', attention: '주의', date: '날짜', category: '카테고리', originalAmount: '원금', twdCost: '비용({currency})', totalNetInvested: '합계', deposit: '입금(+)', withdraw: '출금(-)', fixedTWD: '대만 달러 지정', historicalRate: '기록 환율', currentRate: '현재 환율', taiwanDollar: '대만 달러', chartLabels: { investmentCost: '투자 비용', accumulatedPL: '누적 손익', estimatedAssets: '예상 총 자산(8%)', totalAssets: '총 자산', realData: '(실가)', estimated: '(예상)' }, aiAdvisor: 'Gemini AI 자문', aiAdvisorDesc: '포트폴리오 위험과 기회를 분석합니다.', startAnalysis: '분석 시작', analyzing: '분석 중...', viewCalculationDetails: '계산 상세', notInvestmentAdvice: '투자 조언이 아닙니다. 결과는 참고 정보입니다.' },
  funds: { title: '자금 관리', operations: '작업', clearAll: '전체 삭제', batchImport: '일괄 입력', addRecord: '+ 기록 추가', filter: '필터', clearFilters: '초기화', accountFilter: '계좌', typeFilter: '유형', dateFrom: '시작일', dateTo: '종료일', allAccounts: '전체 계좌', allTypes: '전체 유형', deposit: '입금', withdraw: '출금', transfer: '송금', interest: '이자', showRecords: '{count}건 표시', totalRecords: '총 {total}건', last30Days: '최근 30일', thisYear: '올해', confirmClearAll: '전체 자금 기록을 삭제하시겠습니까?', confirmClearAllMessage: '입출금·송금·이자 기록이 삭제됩니다. 되돌릴 수 없습니다.', confirmClear: '삭제 확인' },
  history: { operations: '작업', batchUpdateMarket: '시장 일괄 변경', clearAll: '전체 거래 삭제', batchImport: '일괄 입력', addRecord: '+ 기록 추가', filter: '필터', accountFilter: '계좌', tickerFilter: '종목', dateFrom: '시작일', dateTo: '종료일', includeCashFlow: '자금 흐름 포함', clearFilters: '초기화', showingRecords: '{count}건 표시', totalRecords: '총 {total}:{transactionCount}건 거래{hasCashFlow}', last30Days: '최근 30일', thisYear: '올해', noTransactions: '거래 없음', noMatchingTransactions: '일치 없음', edit: '편집', delete: '삭제', includeCashFlowDesc: '입출금·송금 기록 표시', hiddenCashFlowRecords: '{count}건 자금 흐름 숨김', cashFlowDeposit: '입금', cashFlowWithdraw: '출금', cashFlowTransfer: '송금 출', cashFlowTransferIn: '송금 입' },
  labels: { date: '날짜', account: '계좌', amount: '금액', balance: '잔액', action: '작업', type: '유형', price: '단가', quantity: '수량', currency: '통화', fee: '수수료', exchangeRate: '환율', totalCost: '총 비용', category: '카테고리', description: '종목/설명', note: '비고' },
  holdings: { portfolioHoldings: '보유 종목', mergedDisplay: '합산', detailedDisplay: '상세', aiUpdatePrices: 'AI 주가·환율 업데이트', aiSearching: 'AI 검색 중...', market: '시장', ticker: '종목', quantity: '수량', currentPrice: '현재가', weight: '비중', cost: '총 비용', marketValue: '시가총액', profitLoss: '손익', annualizedROI: '연평균', dailyChange: '일별 변동', avgPrice: '평균 단가', noHoldings: '보유가 없습니다. 거래를 추가하세요.' },
  accounts: { addAccount: '계좌 추가', accountName: '계좌명', accountNamePlaceholder: '예: 富邦證券, Firstrade', currency: '통화', currencyTWD: '대만 달러', currencyUSD: '미국 달러', currencyJPY: '일본 엔', subBrokerage: '위탁', add: '추가', update: '업데이트', editAccount: '편집', balance: '잔액', cancel: '취소', updateAccount: '업데이트', confirmDelete: '삭제 확인', confirmDeleteMessage: '「{name}」을(를) 삭제하시겠습니까?', deleteWarning: '거래 기록은 삭제되지 않지만 필터에 문제가 생길 수 있습니다.', deleteAccount: '삭제', noAccounts: '계좌가 없습니다.', cashBalance: '현금 잔액', editAccountTitle: '계좌 편집' },
  rebalance: { title: '리밸런싱', resetToCurrent: '현재로 초기화', totalAssets: '총 자산(현금 포함)', enable: '활성화', symbol: '종목', currentPrice: '현재가', currentValue: '현재 가치', currentWeight: '현재 비중', targetWeight: '목표 비중', targetValue: '목표 가치', adjustAmount: '조정 금액', suggestedAction: '권장 조치', cash: '현금', totalEnabled: '활성화 합계', remainingFunds: '잔여 자금', notParticipating: '미참여', accounts: '계좌', description: '설명:', description1: '동일 종목은 자동 합산됩니다.', description2: '「활성화」로 리밸런싱 대상을 선택합니다.', description3: '현금도 선택할 수 있습니다.', description4: '목표 비중은 자동 저장됩니다.', description5: '현금 목표가 음수면 종목 목표를 줄이세요.', description6: '「현재로 초기화」로 일괄 초기화.', buy: '매수', sell: '매도' },
  simulator: { title: '자산 배분 시뮬레이터', description: '다른 자산 배분의 기대 수익을 비교할 수 있습니다.', descriptionWarning: '⚠️ 과거 실적은 미래를 보장하지 않습니다. 참고 정보입니다.', basicSettings: '기본 설정', initialAmount: '초기 투자액', investmentYears: '투자 년수', regularInvestment: '정기 투자(선택)', regularAmount: '정기 투자액', frequency: '빈도', monthly: '월', quarterly: '분기', yearly: '년', annualTotal: '연간 합계', setToZero: '0으로 비활성화', importFromHoldings: '보유에서 가져오기', importButton: '가져오기', manualAdd: '수동 추가', ticker: '종목', tickerPlaceholder: '예: 0050', market: '시장', marketTW: '대만(TW)', marketUS: '미국(US)', marketUK: '영국(UK)', marketJP: '일본(JP)', annualReturn: '연평균 수익률(%)', autoQuery: '🔍 자동 조회', querying: '조회 중', allocation: '배분(%)', add: '추가', assetList: '자산 목록', autoBalance: '자동 배분', clearAll: '전체 초기화', allocationSum: '총 배분:', totalInvested: '총 투자', finalValue: '최종 가치', totalReturn: '총 수익', portfolioAnnualReturn: '포트폴리오 연평균', initial: '초기', yearlyProjection: '연간 예측', yearlyReturnAnalysis: '연간 수익 분석', detailedYearlyProjection: '상세 연간 예측', year: '년', assetValue: '자산 가치', yearlyReturn: '연간 수익', cumulativeInvestment: '누적 투자', yearlyReturnRate: '연간 수익률', allocationWarning: '⚠️ 배분 합계 100%로', confirmClear: '전체 초기화 확인', confirmClearMessage: '전체 자산 배분을 초기화하시겠습니까?', dataWarning: '⚠️ 데이터 주의', dataWarningDesc: '결과가 낮으면 Yahoo Finance 데이터가 불완전할 수 있습니다.', cagrExplanation: '연평균 수익률 계산', cagrFormula: 'CAGR = ((현재가/초기가)^(1/년수))-1', cagrFormulaDesc: 'CAGR(연평균 성장률) 사용', cagrExample: '상장 시 매수~현재 연평균 수익률', cagrExampleValue: '예: 100→200(5년)≈14.87%', errorEnterTicker: '종목 입력', errorAllocationRange: '0-100% 범위', errorAllocationSum: '합계 100% 이하', errorNoHoldings: '가져올 데이터 없음', errorEnterTickerFirst: '먼저 종목 입력', errorCannotGetReturn: '{ticker} 연평균 조회 불가, 수동 입력', errorQueryFailed: '조회 실패, 수동 입력', close: '닫기', cancel: '취소', yearPrefix: '년', yearSuffix: '', queryingReturn: '{ticker} 연평균 조회 중...', autoQueryTitle: '상장 이후 연평균 자동 조회' },
  help: { dataManagement: '데이터 관리', export: '내보내기', exportDesc: '거래·계좌·주가를 JSON으로 내보냅니다. 정기 백업 권장.', downloadBackup: '백업(.json) 다운로드', import: '가져오기', importWarning: '백업 로드 시 현재 데이터가 덮어씌워집니다.', uploadBackup: '백업 업로드', authorizedUsers: '인가 사용자', authorizedUsersDesc: '비밀번호 없이 로그인 가능한 이메일(개인정보 보호로 마스킹):', emailAccount: '이메일', status: '상태', systemAuthorized: '시스템 인가', contact: '구매·문의', contactTitle: '이용해 주셔서 감사합니다', contactDesc: '비회원으로 영구 이용권을 원하시거나 기능 제안·버그 리포트는 개발자에게 문의하세요.', contactEmail: '관리자 연락처(이메일)', documentation: '문서', copyAll: '복사', copied: '복사했습니다!', print: '인쇄', confirmImport: '데이터 덮어쓰기 확인', confirmImportMessage: '{fileName}을(를) 로드합니다.', confirmImportWarning: '현재 거래·설정이 완전히 삭제됩니다. 되돌릴 수 없습니다.', confirmOverride: '덮어쓰기 확인', documentationContent: '# TradeView 매뉴얼\n\n**개인정보**: 모든 데이터는 기기에 로컬 저장. 개인정보 수집 없음. 정기 백업 권장.\n\n## 기능\n- 계좌·자금·거래 관리\n- 대시보드·리밸런싱·시뮬레이터\n\n## 위험\n투자에는 위험이 따릅니다. 본 앱은 투자 조언을 제공하지 않습니다.', androidPublish: 'Android 배포 가이드', androidPublishTitle: 'Google Play 배포 방법', androidPublishDesc: 'TWA로 웹앱을 래핑하여 Android화할 수 있습니다.' },
  transactionForm: { addTransaction: '거래 추가', editTransaction: '거래 편집', date: '날짜', account: '계좌', market: '시장', ticker: '종목', tickerPlaceholder: '예: 2330, AAPL', category: '카테고리', price: '단가', quantity: '수량', quantityFixed: '수량(1 고정)', fees: '수수료', note: '비고', cancel: '취소', saveTransaction: '저장', updateTransaction: '업데이트', confirmTitle: '확인', confirmMessage: '내용을 확인하세요.', dateLabel: '날짜:', accountLabel: '계좌:', marketLabel: '시장:', tickerLabel: '종목:', typeLabel: '유형:', priceLabel: '단가:', quantityLabel: '수량:', feesLabel: '수수료:', noteLabel: '비고:', totalAmount: '합계:', shares: '주', backToEdit: '돌아가기', confirmSave: '저장', previewTitle: '금액 미리보기:', calculationFormula: '계산식:', marketTW: '대만(TW)', marketUS: '미국(US)', marketUK: '영국(UK)', marketJP: '일본(JP)', typeBuy: '매수', typeSell: '매도', typeDividend: '주식 배당', typeCashDividend: '현금 배당', typeTransferIn: '입고', typeTransferOut: '출고', placeholderPrice: '단가', placeholderQuantity: '배당 총액', errorNoAccount: '먼저 계좌를 생성하세요', feesShort: '수수료', formulaNote: '(대만주 내림)' },
  fundForm: { addFundRecord: '자금 기록 추가', editFundRecord: '자금 기록 편집', date: '날짜', type: '유형', account: '계좌', sourceAccount: '송금 출처', amount: '금액', targetAccount: '송금 대상', selectAccount: '계좌 선택...', exchangeRate: '환율', exchangeRateUSD: '환율(TWD/USD)', exchangeRateJPY: '환율(TWD/JPY)', crossCurrencyTransfer: '다른 통화 송금', usdConversion: '미국 달러 환산', jpyConversion: '일본 엔 환산', sameCurrencyTransfer: '동일 통화 송금(1.0)', fees: '수수료({currency})', feesNote: '송금 수수료', note: '비고', cancel: '취소', updateRecord: '업데이트', confirmExecute: '저장', typeDeposit: '입금', typeWithdraw: '출금', typeTransfer: '송금', typeInterest: '이자', confirmTitle: '자금 기록 확인', confirmMessage: '내용을 확인하세요.', dateLabel: '날짜:', typeLabel: '유형:', accountLabel: '계좌:', targetAccountLabel: '송금 대상:', amountLabel: '금액:', exchangeRateLabel: '환율:', feesLabel: '수수료:', noteLabel: '비고:', totalTWD: '합계({currency}):', backToEdit: '돌아가기', confirmSave: '저장', errorNoAccount: '먼저 계좌를 생성하세요' },
};

// 簡體中文翻譯（基於繁體轉簡體）
const zhCN: Translations = JSON.parse(JSON.stringify(zhTW));
zhCN.baseCurrency = { TWD: '台币', USD: '美元', JPY: '日元', EUR: '欧元', GBP: '英镑', HKD: '港币', KRW: '韩元' };
zhCN.common = { confirm: '确认', cancel: '取消', delete: '删除', edit: '编辑', save: '保存', close: '关闭', loading: '加载中...', search: '搜索', logoutConfirm: '确定要登出系统吗？' };
zhCN.nav = { dashboard: '仪表板', history: '交易记录', funds: '资金管理', accounts: '证券户', rebalance: '再平衡', simulator: '配置模拟', help: '系统管理', logout: '登出' };
zhCN.login = { title: 'TradeView 登录', subtitle: '台美股资产管理', email: 'Email', password: 'Password', login: '登录', privacy: '隐私声明', privacyDesc: '数据存储在个人设备，不涉及个人隐私，请定时备份。', riskDisclaimer: '风险声明', riskDisclaimerDesc: '投资有风险，过往绩效不代表未来表现。' };
zhCN.dashboard = { ...zhTW.dashboard, netCost: '净投入', totalAssets: '总资产', totalPL: '总损益', includeCash: '含现金', formulaNote: '美元账户优先使用历史汇率，转账与利息不计入成本。', deposit: '汇入(+)', withdraw: '汇出(-)', fixedTWD: '指定台币金额', taiwanDollar: '台币' };
zhCN.funds = { ...zhTW.funds, title: '资金管理', deposit: '汇入', withdraw: '汇出', transfer: '转账', interest: '利息' };
zhCN.accounts = { ...zhTW.accounts, currencyTWD: '台币', currencyUSD: '美元', currencyJPY: '日元' };
zhCN.labels = { ...zhTW.labels, exchangeRate: '汇率', fee: '手续费' };
zhCN.holdings = { ...zhTW.holdings };

// 德文翻譯
const de: Translations = {
  baseCurrency: { TWD: 'TWD', USD: 'USD', JPY: 'JPY', EUR: 'EUR', GBP: 'GBP', HKD: 'HKD', KRW: 'KRW' },
  common: { confirm: 'Bestätigen', cancel: 'Abbrechen', delete: 'Löschen', edit: 'Bearbeiten', save: 'Speichern', close: 'Schließen', loading: 'Laden...', search: 'Suchen', logoutConfirm: 'Möchten Sie sich abmelden?' },
  nav: { dashboard: 'Dashboard', history: 'Transaktionen', funds: 'Fonds', accounts: 'Konten', rebalance: 'Rebalancing', simulator: 'Simulator', help: 'System', logout: 'Abmelden' },
  pages: { dashboard: 'Portfolio-Dashboard', history: 'Verlauf (Transaktionen + Cashflow)', funds: 'Fondsverwaltung', accounts: 'Kontoverwaltung', rebalance: 'Rebalancing', simulator: 'Asset-Allocation-Simulator', help: 'System & Backup' },
  login: { title: 'TradeView Anmeldung', subtitle: 'Taiwan- & US-Aktien Portfolio', email: 'E-Mail', password: 'Passwort', login: 'Anmelden', privacy: 'Datenschutz', privacyDesc: 'Daten werden lokal gespeichert. Keine Erfassung personenbezogener Daten.', riskDisclaimer: 'Risikohinweis', riskDisclaimerDesc: 'Investitionen bergen Risiken. Vergangene Performance garantiert keine zukünftigen Ergebnisse.' },
  dashboard: { ...en.dashboard, netCost: 'Nettokosten', totalAssets: 'Gesamtvermögen', totalPL: 'Gewinn/Verlust', deposit: 'Einzahlung(+)', withdraw: 'Auszahlung(-)', formulaNote: 'USD-Konten: Historischer Kurs bevorzugt. Überweisungen und Zinsen nicht in Kosten.', attention: 'Hinweis', taiwanDollar: 'TWD', aiAdvisor: 'Gemini AI Berater', aiAdvisorDesc: 'Portfolio-Analyse', notInvestmentAdvice: 'Keine Anlageberatung.' },
  funds: { title: 'Fondsverwaltung', operations: 'Aktionen', clearAll: 'Alle löschen', batchImport: 'Import', addRecord: '+ Eintrag', filter: 'Filter', clearFilters: 'Zurücksetzen', accountFilter: 'Konto', typeFilter: 'Typ', dateFrom: 'Von', dateTo: 'Bis', allAccounts: 'Alle', allTypes: 'Alle', deposit: 'Einzahlung', withdraw: 'Auszahlung', transfer: 'Überweisung', interest: 'Zinsen', showRecords: '{count} Einträge', totalRecords: 'Gesamt {total}', last30Days: 'Letzte 30 Tage', thisYear: 'Dieses Jahr', confirmClearAll: 'Alle Fondsdaten löschen?', confirmClearAllMessage: 'Ein- und Auszahlungen werden gelöscht.', confirmClear: 'Löschen' },
  history: { ...en.history },
  labels: { date: 'Datum', account: 'Konto', amount: 'Betrag', balance: 'Saldo', action: 'Aktion', type: 'Typ', price: 'Preis', quantity: 'Anzahl', currency: 'Währung', fee: 'Gebühr', exchangeRate: 'Kurs', totalCost: 'Gesamtkosten', category: 'Kategorie', description: 'Symbol/Beschreibung', note: 'Notiz' },
  holdings: { ...en.holdings },
  accounts: { ...en.accounts },
  rebalance: { ...en.rebalance },
  simulator: { ...en.simulator },
  help: { ...en.help },
  transactionForm: { ...en.transactionForm },
  fundForm: { ...en.fundForm },
};

// 翻譯映射
const translations: Record<Language, Translations> = {
  'zh-TW': zhTW,
  'zh-CN': zhCN,
  'en': en,
  'ja': ja,
  'ko': ko,
  'de': de,
};

// 獲取當前語言
export const getLanguage = (): Language => {
  const saved = localStorage.getItem('tf_language');
  const valid: Language[] = ['zh-TW', 'zh-CN', 'en', 'ja', 'ko', 'de'];
  return valid.includes(saved as Language) ? saved as Language : 'zh-TW';
};

// 設置語言
export const setLanguage = (lang: Language) => {
  localStorage.setItem('tf_language', lang);
};

// 獲取翻譯
export const t = (lang: Language): Translations => {
  return translations[lang] || translations['zh-TW'];
};

// 翻譯函數（帶參數替換）
export const translate = (key: string, lang: Language, params?: Record<string, string | number>): string => {
  const keys = key.split('.');
  let value: any = translations[lang] || translations['zh-TW'];
  
  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) return key;
  }
  
  if (typeof value === 'string' && params) {
    return value.replace(/\{(\w+)\}/g, (match, paramKey) => {
      if (paramKey in params) {
        return params[paramKey]?.toString() ?? '';
      }
      return match;
    });
  }
  
  return typeof value === 'string' ? value : key;
};

/** 取得基準幣的顯示名稱（依語言） */
export const getBaseCurrencyLabel = (code: BaseCurrencyCode, lang: Language): string => {
  const tr = translations[lang] || translations['zh-TW'];
  return tr?.baseCurrency?.[code] ?? code;
};

