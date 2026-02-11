# 將 GitHub 網址包裝為 APK 上架到安卓商店 - 完整指南

本指南將幫助您將託管在 GitHub Pages 上的網址（`rong-bit.github.io`）包裝為 Android APK/AAB，並上架到 Google Play Store。

## 📋 前置準備檢查清單

### 1. 確認 GitHub Pages 網站已部署

- ✅ 確認您的網站可以正常訪問：`https://rong-bit.github.io/TradeFolio/`
- ✅ 確認網站已配置 HTTPS（GitHub Pages 自動提供）
- ✅ 確認網站有正確的 manifest.json 文件

### 2. 配置 Digital Asset Links（重要！）

TWA 應用需要驗證網站與應用的關聯。您需要在 GitHub Pages 網站**域名根目錄**（不是子目錄）添加 `.well-known/assetlinks.json` 文件：

**文件路徑**：`https://rong-bit.github.io/.well-known/assetlinks.json`

**注意**：即使您的網站在 `/TradeFolio/` 子目錄，Digital Asset Links 文件也必須放在域名根目錄的 `.well-known/` 文件夾中。

**文件內容**：
```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tradefolio.app",
    "sha256_cert_fingerprints": [
      "YOUR_SHA256_FINGERPRINT_HERE"
    ]
  }
}]
```

**獲取 SHA256 指紋的方法**：
1. 先構建一個未簽名的 APK（用於測試）
2. 使用以下命令獲取指紋：
   ```bash
   keytool -list -v -keystore your-keystore.jks -alias your-alias
   ```
3. 或者使用 Google Play Console 提供的上傳密鑰指紋

**重要**：如果沒有配置 Digital Asset Links，TWA 將無法正常工作！

### 3. 準備簽名密鑰

#### 方法一：創建新的密鑰庫（首次使用）

在項目根目錄執行：

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

系統會要求您輸入：
- 密鑰庫密碼（請妥善保管）
- 密鑰密碼（可以與密鑰庫密碼相同）
- 姓名、組織等資訊

#### 方法二：使用現有密鑰庫

如果您已經有密鑰庫文件，請確保知道：
- 密鑰庫文件路徑
- 密鑰庫密碼
- 密鑰別名（通常是 `android`）
- 密鑰密碼

### 4. 配置簽名資訊

編輯 `gradle.properties` 文件，取消註釋並填寫以下內容：

```properties
RELEASE_STORE_FILE=C:\\Users\\YourUsername\\android.keystore
RELEASE_STORE_PASSWORD=您的密鑰庫密碼
RELEASE_KEY_ALIAS=android
RELEASE_KEY_PASSWORD=您的密鑰密碼
```

**Windows 路徑注意事項**：
- 使用雙反斜線 `\\` 或正斜線 `/`
- 例如：`C:/Users/User/android.keystore` 或 `C:\\Users\\User\\android.keystore`

**安全提示**：
- ⚠️ 不要將 `gradle.properties` 提交到 Git（應該在 `.gitignore` 中）
- ⚠️ 妥善保管密鑰庫文件和密碼，遺失後無法更新已上架的應用

## 🔨 構建步驟

### 步驟 1：確認網址配置

檢查 `app/build.gradle` 中的配置是否正確：

```gradle
def twaManifest = [
    hostName: 'rong-bit.github.io',  // GitHub Pages 域名
    launchUrl: '/TradeFolio/',  // 網站子目錄路徑
    // ...
]
```

**當前配置**：
- 域名：`rong-bit.github.io`
- 啟動路徑：`/TradeFolio/`
- 完整網址：`https://rong-bit.github.io/TradeFolio/`

### 步驟 2：構建 Android App Bundle (AAB)

Google Play 要求使用 AAB 格式（而非 APK）。執行以下命令：

**Windows**：
```bash
gradlew.bat bundleRelease
```

**Linux/Mac**：
```bash
./gradlew bundleRelease
```

**使用構建腳本**（推薦）：
```bash
# Windows
build-release.bat

# Linux/Mac
./build-release.sh
```

構建成功後，AAB 文件位於：
```
app/build/outputs/bundle/release/app-release.aab
```

### 步驟 3：驗證構建結果

檢查生成的文件：
- ✅ `app-release.aab` 文件已生成
- ✅ 文件大小合理（通常幾 MB 到幾十 MB）
- ✅ 構建過程中沒有錯誤

## 📱 Google Play Console 上架流程

### 1. 創建 Google Play Console 帳戶

1. 訪問 [Google Play Console](https://play.google.com/console)
2. 註冊開發者帳戶（需要一次性費用 $25 美元）
3. 完成帳戶驗證和付款

### 2. 創建新應用

1. 登入 Google Play Console
2. 點擊「建立應用程式」
3. 填寫基本資訊：
   - **應用名稱**：TradeFolio
   - **預設語言**：繁體中文（台灣）
   - **應用或遊戲**：應用程式
   - **免費或付費**：選擇適合的選項

### 3. 填寫商店資訊

在「主要商店資訊」頁面填寫：

#### 必填項目：
- **應用名稱**：TradeFolio
- **簡短說明**（80 字符以內）：
  ```
  投資組合管理工具，幫助您追蹤和分析投資表現
  ```
- **完整說明**（4000 字符以內）：
  ```
  TradeFolio 是一款專業的投資組合管理應用，讓您輕鬆追蹤和管理您的投資。

  主要功能：
  • 投資組合追蹤：即時查看您的投資組合價值和表現
  • 資產配置分析：視覺化您的資產分配情況
  • 交易記錄：記錄所有買賣交易，追蹤投資歷史
  • 績效分析：詳細的投資績效報告和分析
  • 市場數據：即時市場價格和趨勢

  無論您是新手投資者還是經驗豐富的交易員，TradeFolio 都能幫助您做出更明智的投資決策。

  所有數據都儲存在本地，保障您的隱私安全。
  ```

#### 圖示和截圖：
- **應用圖示**：512x512 像素 PNG（使用 `store_icon.png`）
- **功能圖示**：1024x500 像素 PNG（可選）
- **應用截圖**：至少 2 張，最多 8 張
  - 手機：16:9 或 9:16 比例，至少 320px 短邊
  - 建議尺寸：1080x1920 或 1920x1080

#### 其他資訊：
- **分類**：財經 或 工具
- **聯絡資訊**：提供電子郵件和網站
- **隱私政策 URL**：如果應用收集用戶數據，必須提供

### 4. 設定內容分級

1. 完成內容分級問卷
2. 根據應用內容選擇適當的分級
3. 通常投資類應用會被評為「所有人」或「3+」

### 5. 設定定價與發布

1. 選擇應用是免費還是付費
2. 選擇發布國家/地區
3. 選擇發布方式（立即發布或分階段發布）

### 6. 上傳 AAB 文件

1. 進入「發布」>「正式版」
2. 點擊「建立新版本」
3. 上傳 `app/build/outputs/bundle/release/app-release.aab` 文件
4. 填寫版本說明（例如：`首次發布版本 1.0.0`）
5. 檢查發布檢查清單

### 7. 設定應用簽名

首次上傳時，Google Play 會要求設定應用簽名：

1. 選擇「讓 Google 管理並保護您的應用簽名金鑰」（推薦）
2. 上傳您的上傳密鑰（用於後續更新）
   - 如果使用 Google 管理簽名，您需要提供上傳密鑰
   - 上傳密鑰可以從您的密鑰庫中提取

**提取上傳密鑰的方法**：
```bash
keytool -export -rfc -keystore android.keystore -alias android -file upload_certificate.pem
```

### 8. 提交審核

完成所有必填項目後：

1. 檢查所有資訊是否正確
2. 確認所有檢查項目都通過
3. 點擊「提交以供審核」
4. 等待 Google 審核（通常需要 1-3 個工作日）

## 🔄 版本更新流程

每次更新應用時：

### 1. 更新版本號

編輯 `app/build.gradle`：

```gradle
defaultConfig {
    versionCode 3  // 每次更新必須增加（從 2 改為 3）
    versionName "1.0.1"  // 用戶可見的版本號
}
```

### 2. 重新構建 AAB

```bash
gradlew.bat bundleRelease
```

### 3. 上傳新版本

1. 進入 Google Play Console
2. 進入「發布」>「正式版」
3. 點擊「建立新版本」
4. 上傳新的 AAB 文件
5. 填寫版本說明（描述本次更新的內容）
6. 提交審核

## ⚠️ 常見問題與解決方案

### Q1: TWA 無法正常載入網站

**原因**：可能缺少 Digital Asset Links 配置

**解決方案**：
1. 確認 `.well-known/assetlinks.json` 文件已正確部署
2. 確認 SHA256 指紋正確
3. 使用 [Google 的驗證工具](https://developers.google.com/digital-asset-links/tools/generator) 驗證配置

### Q2: 構建時出現簽名錯誤

**原因**：`gradle.properties` 中的簽名配置不正確

**解決方案**：
1. 檢查文件路徑是否正確（注意 Windows 路徑格式）
2. 確認密碼正確
3. 確認密鑰別名正確

### Q3: 上傳 AAB 時出現錯誤

**原因**：可能是版本號衝突或簽名問題

**解決方案**：
1. 確認 `versionCode` 比之前版本大
2. 確認使用相同的簽名密鑰
3. 檢查 AAB 文件是否完整

### Q4: 應用被 Google Play 拒絕

**常見原因**：
- 缺少隱私政策（如果應用收集數據）
- 違反內容政策
- 應用崩潰或功能異常
- 缺少必要的權限說明

**解決方案**：
1. 查看 Play Console 中的拒絕原因
2. 根據原因修改應用或補充資訊
3. 重新提交審核

### Q5: 如何測試 TWA 應用

**方法一：使用 Android Studio**
1. 打開 Android Studio
2. 導入項目
3. 連接 Android 設備或啟動模擬器
4. 點擊「Run」按鈕

**方法二：安裝 APK**
1. 構建 APK：`gradlew.bat assembleRelease`
2. 將 APK 傳輸到 Android 設備
3. 在設備上安裝並測試

## 📝 重要提醒

1. **備份簽名密鑰**：務必妥善保管密鑰庫文件和密碼，遺失後無法更新已上架的應用
2. **測試應用**：上架前請充分測試應用功能，特別是網站載入和基本功能
3. **遵守政策**：確保應用符合 Google Play 政策
4. **提供隱私政策**：如果應用收集用戶數據，必須提供隱私政策 URL
5. **Digital Asset Links**：必須正確配置，否則 TWA 無法正常工作
6. **回應審核**：如果被拒絕，及時回應並修正問題

## 🔗 相關連結

- [Google Play Console](https://play.google.com/console)
- [Google Play 政策中心](https://play.google.com/about/developer-content-policy/)
- [Android App Bundle 指南](https://developer.android.com/guide/app-bundle)
- [應用簽名最佳實踐](https://developer.android.com/studio/publish/app-signing)
- [TWA 文檔](https://developer.chrome.com/docs/android/trusted-web-activity/)
- [Digital Asset Links 驗證工具](https://developers.google.com/digital-asset-links/tools/generator)

## 📞 需要幫助？

如果遇到問題：
1. 查看 Google Play Console 的幫助文檔
2. 檢查構建日誌中的錯誤訊息
3. 確認所有配置步驟都已正確完成

---

祝您上架順利！🎉

