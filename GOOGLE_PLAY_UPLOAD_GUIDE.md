# Google Play 上架指南

本指南將幫助您將 TradeFolio 應用上架到 Google Play Store。

## 前置準備

### 1. 創建 Google Play Console 帳戶

- 訪問 [Google Play Console](https://play.google.com/console)
- 註冊開發者帳戶（需要一次性費用 $25 美元）
- 完成帳戶驗證

### 2. 準備應用資源

上架前需要準備以下資源：

- **應用圖標**：512x512 像素 PNG（已準備：`store_icon.png`）
- **功能圖示**：1024x500 像素 PNG（可選）
- **應用截圖**：至少 2 張，最多 8 張
  - 手機：16:9 或 9:16 比例，至少 320px 短邊
  - 平板：7 英寸或 10 英寸截圖
- **應用描述**：簡短描述（80 字符）和完整描述（4000 字符）
- **隱私政策 URL**：必須提供（如果應用收集用戶數據）

## 構建步驟

### 1. 配置簽名密鑰

#### 方法一：使用現有密鑰庫（推薦）

如果已經有密鑰庫文件（如 `C:\Users\User\android.keystore`），請在 `gradle.properties` 中取消註釋並填寫以下配置：

```properties
RELEASE_STORE_FILE=C:\\Users\\User\\android.keystore
RELEASE_STORE_PASSWORD=您的密鑰庫密碼
RELEASE_KEY_ALIAS=android
RELEASE_KEY_PASSWORD=您的密鑰密碼
```

#### 方法二：創建新的密鑰庫

如果還沒有密鑰庫，請執行以下命令創建：

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

**重要提示**：
- 請妥善保管密鑰庫文件和密碼
- 如果遺失，將無法更新已上架的應用
- 建議將密鑰庫備份到安全位置

### 2. 生成 Android App Bundle (AAB)

Google Play 要求使用 AAB 格式上架（而非 APK）。執行以下命令生成簽名的 AAB：

```bash
# Windows
gradlew.bat bundleRelease

# Linux/Mac
./gradlew bundleRelease
```

生成的 AAB 文件位於：
```
app/build/outputs/bundle/release/app-release.aab
```

### 3. 驗證 AAB 文件

可以使用以下工具驗證 AAB：

```bash
# 使用 bundletool（需要先下載）
java -jar bundletool.jar build-apks --bundle=app-release.aab --output=app.apks
```

## 上架流程

### 1. 創建新應用

1. 登入 [Google Play Console](https://play.google.com/console)
2. 點擊「建立應用程式」
3. 選擇「建立應用程式」
4. 填寫應用資訊：
   - **應用名稱**：TradeFolio
   - **預設語言**：繁體中文（台灣）
   - **應用或遊戲**：應用程式
   - **免費或付費**：選擇適合的選項

### 2. 填寫商店資訊

在「主要商店資訊」頁面填寫：

- **應用名稱**：TradeFolio
- **簡短說明**：投資組合管理工具（80 字符以內）
- **完整說明**：詳細描述應用功能（4000 字符以內）
- **應用圖示**：上傳 512x512 像素圖標
- **功能圖示**：上傳 1024x500 像素圖示（可選）
- **應用截圖**：上傳至少 2 張截圖
- **分類**：選擇「財經」或「工具」
- **聯絡資訊**：提供電子郵件和網站

### 3. 設定內容分級

1. 完成內容分級問卷
2. 根據應用內容選擇適當的分級

### 4. 設定定價與發布

1. 選擇應用是免費還是付費
2. 選擇發布國家/地區
3. 選擇發布方式（立即發布或分階段發布）

### 5. 上傳 AAB 文件

1. 進入「發布」>「正式版」
2. 點擊「建立新版本」
3. 上傳 `app-release.aab` 文件
4. 填寫版本說明
5. 檢查發布檢查清單

### 6. 設定應用簽名

Google Play 會自動管理應用簽名。首次上傳時：

1. 選擇「讓 Google 管理並保護您的應用簽名金鑰」
2. 上傳您的上傳密鑰（用於後續更新）

### 7. 提交審核

完成所有必填項目後：

1. 檢查所有資訊是否正確
2. 點擊「提交以供審核」
3. 等待 Google 審核（通常需要 1-3 個工作日）

## 應用資訊建議

### 應用描述範例

**簡短說明**：
```
投資組合管理工具，幫助您追蹤和分析投資表現
```

**完整說明**：
```
TradeFolio 是一款專業的投資組合管理應用，讓您輕鬆追蹤和管理您的投資。

主要功能：
• 投資組合追蹤：即時查看您的投資組合價值和表現
• 資產配置分析：視覺化您的資產分配情況
• 交易記錄：記錄所有買賣交易，追蹤投資歷史
• 績效分析：詳細的投資績效報告和分析
• 市場數據：即時市場價格和趨勢

無論您是新手投資者還是經驗豐富的交易員，TradeFolio 都能幫助您做出更明智的投資決策。
```

### 關鍵字建議

- 投資組合
- 投資管理
- 股票追蹤
- 資產配置
- 投資分析
- 理財工具

## 常見問題

### Q: 為什麼要使用 AAB 而不是 APK？

A: Google Play 要求新應用和更新必須使用 AAB 格式。AAB 可以讓 Google Play 為不同設備生成優化的 APK，減少應用大小。

### Q: 如何更新已上架的應用？

A: 
1. 在 `app/build.gradle` 中增加 `versionCode`（例如從 2 改為 3）
2. 更新 `versionName`（例如從 "1.0.0" 改為 "1.0.1"）
3. 重新生成 AAB：`gradlew.bat bundleRelease`
4. 在 Play Console 中上傳新版本

### Q: 應用被拒絕怎麼辦？

A: 查看 Play Console 中的拒絕原因，通常包括：
- 違反內容政策
- 缺少必要的權限說明
- 應用崩潰或功能異常
- 缺少隱私政策

根據拒絕原因修改後重新提交。

### Q: 如何查看應用審核狀態？

A: 在 Play Console 的「發布」頁面可以查看審核狀態和進度。

## 版本更新流程

每次更新應用時：

1. **更新版本號**：
   ```gradle
   versionCode 3  // 每次更新必須增加
   versionName "1.0.1"  // 用戶可見的版本號
   ```

2. **生成新的 AAB**：
   ```bash
   gradlew.bat bundleRelease
   ```

3. **上傳到 Play Console**：
   - 進入「發布」>「正式版」
   - 點擊「建立新版本」
   - 上傳新的 AAB 文件
   - 填寫版本說明
   - 提交審核

## 重要提醒

1. **備份簽名密鑰**：務必妥善保管密鑰庫文件和密碼
2. **測試應用**：上架前請充分測試應用功能
3. **遵守政策**：確保應用符合 Google Play 政策
4. **提供隱私政策**：如果應用收集用戶數據，必須提供隱私政策 URL
5. **回應審核**：如果被拒絕，及時回應並修正問題

## 相關連結

- [Google Play Console](https://play.google.com/console)
- [Google Play 政策中心](https://play.google.com/about/developer-content-policy/)
- [Android App Bundle 指南](https://developer.android.com/guide/app-bundle)
- [應用簽名最佳實踐](https://developer.android.com/studio/publish/app-signing)

---

祝您上架順利！

