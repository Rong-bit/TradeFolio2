# 快速上架指南

這是一個簡化版的快速上架步驟，適合已經了解流程的開發者。

## 🚀 五步上架流程

### 步驟 1：配置簽名密鑰

編輯 `gradle.properties`，取消註釋並填寫：

```properties
RELEASE_STORE_FILE=C:\\Users\\YourUsername\\android.keystore
RELEASE_STORE_PASSWORD=您的密碼
RELEASE_KEY_ALIAS=android
RELEASE_KEY_PASSWORD=您的密碼
```

如果沒有密鑰庫，先創建：
```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

### 步驟 2：配置 Digital Asset Links

在 GitHub Pages 網站**域名根目錄**（不是子目錄）創建 `.well-known/assetlinks.json`：

**注意**：即使您的網站在 `/TradeFolio/` 子目錄，此文件也必須放在 `https://rong-bit.github.io/.well-known/assetlinks.json`

```json
[{
  "relation": ["delegate_permission/common.handle_all_urls"],
  "target": {
    "namespace": "android_app",
    "package_name": "com.tradefolio.app",
    "sha256_cert_fingerprints": ["YOUR_SHA256_FINGERPRINT"]
  }
}]
```

獲取 SHA256 指紋：
```bash
keytool -list -v -keystore android.keystore -alias android
```

### 步驟 3：構建 AAB

```bash
# Windows
gradlew.bat bundleRelease

# Linux/Mac
./gradlew bundleRelease
```

AAB 文件位置：`app/build/outputs/bundle/release/app-release.aab`

### 步驟 4：上傳到 Google Play Console

1. 登入 [Google Play Console](https://play.google.com/console)
2. 創建新應用
3. 填寫商店資訊
4. 上傳 AAB 文件
5. 提交審核

### 步驟 5：等待審核

通常需要 1-3 個工作日。

---

詳細說明請參考：`ANDROID_APK_UPLOAD_GUIDE.md`

