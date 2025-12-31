# 修復 404 錯誤 - Digital Asset Links 設置

## 問題

訪問 `https://rong-bit.github.io/.well-known/assetlinks.json` 時出現 404 錯誤。

## 原因

您的網站部署在 `https://rong-bit.github.io/TradeFolio/`，但 Digital Asset Links 文件必須放在域名根目錄 `https://rong-bit.github.io/.well-known/assetlinks.json`。

## 解決方案：創建專用倉庫（5 分鐘完成）

### 步驟 1：在 GitHub 創建新倉庫

1. 訪問 https://github.com/new
2. 倉庫名稱：**`rong-bit.github.io`**（必須與您的 GitHub 用戶名完全一致）
3. 設為 **Public**（公開）
4. **不要**勾選任何初始化選項（README、.gitignore、license）
5. 點擊 **Create repository**

### 步驟 2：在本地創建文件

在項目根目錄執行：

```bash
# 創建臨時文件夾
mkdir temp-assetlinks
cd temp-assetlinks

# 創建 .well-known 文件夾
mkdir -p .well-known

# 創建 assetlinks.json 文件
# （使用您喜歡的編輯器創建文件）
```

### 步驟 3：填寫 assetlinks.json 內容

創建 `.well-known/assetlinks.json` 文件，內容如下：

```json
[
  {
    "relation": ["delegate_permission/common.handle_all_urls"],
    "target": {
      "namespace": "android_app",
      "package_name": "com.tradefolio.app",
      "sha256_cert_fingerprints": [
        "YOUR_SHA256_FINGERPRINT_HERE"
      ]
    }
  }
]
```

**暫時使用任意值**（例如：`"PLACEHOLDER"`），稍後再替換為真實指紋。

### 步驟 4：提交到 GitHub

```bash
git init
git add .well-known/assetlinks.json
git commit -m "Add Digital Asset Links for TradeFolio"
git branch -M main
git remote add origin https://github.com/rong-bit/rong-bit.github.io.git
git push -u origin main
```

### 步驟 5：啟用 GitHub Pages

1. 進入 `rong-bit.github.io` 倉庫
2. 點擊 **Settings**（設置）
3. 左側菜單選擇 **Pages**
4. **Source** 選擇：`Deploy from a branch`
5. **Branch** 選擇：`main`
6. **Folder** 選擇：`/ (root)`
7. 點擊 **Save**（保存）

### 步驟 6：等待部署（約 2-5 分鐘）

等待幾分鐘後，訪問：
- `https://rong-bit.github.io/.well-known/assetlinks.json`

應該可以看到 JSON 內容（即使指紋還是佔位符）。

### 步驟 7：更新為真實 SHA256 指紋

#### 7.1 創建密鑰庫（如果還沒有）

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

#### 7.2 獲取 SHA256 指紋

```bash
keytool -list -v -keystore android.keystore -alias android
```

找到輸出中的：
```
SHA256: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB
```

**複製 SHA256 後面的值，並去掉所有冒號**，例如：
- 原始：`AA:BB:CC:DD:EE:FF:...`
- 使用：`AABBCCDDEEFF...`

#### 7.3 更新 assetlinks.json

編輯 `.well-known/assetlinks.json`，將 `YOUR_SHA256_FINGERPRINT_HERE` 替換為真實指紋（無冒號格式）。

#### 7.4 提交更新

```bash
cd temp-assetlinks
git add .well-known/assetlinks.json
git commit -m "Update with real SHA256 fingerprint"
git push
```

## 驗證

### 方法 1：直接訪問

訪問 `https://rong-bit.github.io/.well-known/assetlinks.json`，應該看到 JSON 內容。

### 方法 2：使用 Google API

訪問以下 URL（將 `YOUR_FINGERPRINT` 替換為真實指紋）：
```
https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://rong-bit.github.io&relation=delegate_permission/common.handle_all_urls
```

### 方法 3：使用在線工具

訪問 https://developers.google.com/digital-asset-links/tools/generator 並輸入：
- 網站：`https://rong-bit.github.io`
- 包名：`com.tradefolio.app`
- SHA256 指紋：您的指紋

## 重要提示

1. **這個倉庫只需要包含 `.well-known/assetlinks.json` 文件**
2. **您的實際網站可以繼續在 `TradeFolio` 倉庫**
3. **兩個倉庫互不影響，可以並存**

## 完成後

完成上述步驟後：
1. ✅ Digital Asset Links 文件可以正常訪問
2. ✅ 可以繼續構建 Android AAB
3. ✅ 可以上傳到 Google Play Console

---

**如果遇到問題**，請檢查：
- 倉庫名稱是否與 GitHub 用戶名完全一致
- 文件路徑是否正確：`.well-known/assetlinks.json`
- GitHub Pages 是否已啟用
- 是否等待足夠時間讓 GitHub 部署完成

