# 更新 SHA256 指紋指南

## 當前狀態

✅ 文件已成功推送到 GitHub  
✅ GitHub Pages 應該已經啟用（如果還沒啟用，請按照 README 中的步驟 3 操作）

## 下一步：更新 SHA256 指紋

### 步驟 1：創建密鑰庫（如果還沒有）

在 TradeFolio 項目根目錄執行：

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

系統會要求您輸入：
- 密鑰庫密碼（請妥善保管）
- 密鑰密碼（可以與密鑰庫密碼相同）
- 姓名、組織等資訊

### 步驟 2：獲取 SHA256 指紋

```bash
keytool -list -v -keystore android.keystore -alias android
```

在輸出中找到類似這樣的內容：

```
Certificate fingerprints:
     SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE
     SHA256: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB
```

**複製 SHA256 後面的值，並去掉所有冒號**

例如：
- 原始：`AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB`
- 使用：`AABBCCDDEEFF112233445566778899AABBCCDDEEFF112233445566778899AABB`

### 步驟 3：更新 assetlinks.json

編輯 `rong-bit.github.io/.well-known/assetlinks.json` 文件：

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.tradefolio.app",
      "sha256_cert_fingerprints": [
        "AABBCCDDEEFF112233445566778899AABBCCDDEEFF112233445566778899AABB"
      ]
    }
  }
]
```

將 `YOUR_SHA256_FINGERPRINT_HERE` 替換為您獲取的指紋（無冒號格式）。

### 步驟 4：提交並推送更新

```bash
cd rong-bit.github.io
git add .well-known/assetlinks.json
git commit -m "Update with real SHA256 fingerprint"
git push
```

### 步驟 5：驗證

等待幾分鐘後，訪問：
- `https://rong-bit.github.io/.well-known/assetlinks.json`

應該可以看到更新後的 JSON 內容。

## 使用 Google 驗證工具

訪問以下 URL 驗證配置是否正確：

```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://rong-bit.github.io&relation=delegate_permission/common.handle_all_urls
```

或者在線驗證工具：
https://developers.google.com/digital-asset-links/tools/generator

## 重要提示

- ⚠️ 請妥善保管密鑰庫文件和密碼
- ⚠️ 如果遺失密鑰庫，將無法更新已上架的應用
- ⚠️ 建議將密鑰庫備份到安全位置

## 完成後

更新指紋後，您就可以：
1. 構建 Android AAB：`gradlew.bat bundleRelease`
2. 上傳到 Google Play Console
3. TWA 應用將能夠正常驗證並運行

