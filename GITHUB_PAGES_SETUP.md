# GitHub Pages 設置指南

## 問題診斷

如果您訪問 `https://rong-bit.github.io/.well-known/assetlinks.json` 時看到 404 錯誤，這表示：

1. GitHub Pages 尚未啟用，或
2. Digital Asset Links 文件尚未部署

## 解決方案

### 方案一：設置用戶/組織 GitHub Pages（推薦）

如果您的 GitHub 用戶名是 `rong-bit`，您可以設置用戶級別的 GitHub Pages：

#### 步驟 1：創建特殊倉庫

1. 在 GitHub 創建一個名為 `rong-bit.github.io` 的**公開**倉庫
2. 這個倉庫必須與您的 GitHub 用戶名完全一致

#### 步驟 2：部署網站內容

有兩種方式：

**方式 A：從 `docs` 文件夾部署（推薦）**

1. 在您的 `TradeFolio` 倉庫中創建 `docs` 文件夾
2. 將網站文件複製到 `docs` 文件夾
3. 在倉庫設置中啟用 GitHub Pages：
   - 進入倉庫的 **Settings** > **Pages**
   - **Source** 選擇 `Deploy from a branch`
   - **Branch** 選擇 `main`（或 `master`）
   - **Folder** 選擇 `/docs`
   - 點擊 **Save**

**方式 B：從根目錄部署**

1. 將網站文件放在倉庫根目錄
2. 在倉庫設置中啟用 GitHub Pages：
   - **Source** 選擇 `Deploy from a branch`
   - **Branch** 選擇 `main`（或 `master`）
   - **Folder** 選擇 `/ (root)`

#### 步驟 3：部署 Digital Asset Links 文件

在您的 GitHub Pages 倉庫中創建 `.well-known/assetlinks.json` 文件：

**如果使用 `docs` 文件夾**：
```
docs/
  .well-known/
    assetlinks.json
  index.html
  (其他網站文件)
```

**如果使用根目錄**：
```
.well-known/
  assetlinks.json
index.html
(其他網站文件)
```

### 方案二：使用項目級別的 GitHub Pages（當前情況）

如果您想保持當前結構（網站位於 `https://rong-bit.github.io/TradeFolio/`），您需要：

#### 步驟 1：確認 GitHub Pages 已啟用

1. 進入您的 `TradeFolio` 倉庫
2. 進入 **Settings** > **Pages**
3. 確認 **Source** 已設置（例如：`Deploy from a branch` > `main` > `/docs` 或 `/ (root)`）

#### 步驟 2：創建 Digital Asset Links 文件

由於您的網站在 `/TradeFolio/` 子目錄，但 Digital Asset Links 必須在域名根目錄，您有兩個選擇：

**選擇 A：創建 `rong-bit.github.io` 倉庫（推薦）**

創建一個專門的 `rong-bit.github.io` 倉庫，只包含 `.well-known/assetlinks.json` 文件：

```
rong-bit.github.io/
  .well-known/
    assetlinks.json
```

這樣 `https://rong-bit.github.io/.well-known/assetlinks.json` 就可以正常訪問了。

**選擇 B：使用 GitHub Actions 自動部署**

在您的 `TradeFolio` 倉庫中設置 GitHub Actions，自動將 `.well-known/assetlinks.json` 部署到根目錄。

### 方案三：使用自定義域名（進階）

如果您有自己的域名，可以：

1. 設置自定義域名指向 GitHub Pages
2. 在自定義域名的根目錄部署 Digital Asset Links 文件

## 快速設置步驟（推薦方案）

### 1. 創建 `rong-bit.github.io` 倉庫

```bash
# 在本地創建新倉庫
mkdir rong-bit.github.io
cd rong-bit.github.io
git init
```

### 2. 創建 `.well-known/assetlinks.json` 文件

```bash
mkdir -p .well-known
# 創建 assetlinks.json 文件（內容見下方）
```

### 3. 提交並推送

```bash
git add .
git commit -m "Add Digital Asset Links for TradeFolio app"
git branch -M main
git remote add origin https://github.com/rong-bit/rong-bit.github.io.git
git push -u origin main
```

### 4. 啟用 GitHub Pages

1. 進入 `rong-bit.github.io` 倉庫的 **Settings** > **Pages**
2. **Source** 選擇 `Deploy from a branch`
3. **Branch** 選擇 `main`
4. **Folder** 選擇 `/ (root)`
5. 點擊 **Save**

### 5. 等待部署完成

通常需要幾分鐘，然後訪問：
- `https://rong-bit.github.io/.well-known/assetlinks.json` 應該可以正常訪問

## Digital Asset Links 文件內容

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

**獲取 SHA256 指紋**：

1. 如果還沒有密鑰庫，先創建：
   ```bash
   keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
   ```

2. 獲取指紋：
   ```bash
   keytool -list -v -keystore android.keystore -alias android
   ```

3. 複製 SHA256 指紋（格式類似：`AA:BB:CC:DD:...`），去掉冒號後填入 JSON

## 驗證 Digital Asset Links

部署後，使用以下工具驗證：

1. [Google Digital Asset Links API](https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://rong-bit.github.io&relation=delegate_permission/common.handle_all_urls)

2. [Android Asset Links Generator](https://developers.google.com/digital-asset-links/tools/generator)

## 常見問題

### Q: 為什麼必須在域名根目錄？

A: 這是 Google 的 Digital Asset Links 規範要求。驗證文件必須在 `https://domain/.well-known/assetlinks.json`，不能放在子目錄。

### Q: 我的網站已經在 `/TradeFolio/` 子目錄，怎麼辦？

A: 您可以：
1. 創建 `rong-bit.github.io` 倉庫專門存放 Digital Asset Links 文件
2. 或者將整個網站遷移到 `rong-bit.github.io` 倉庫的根目錄

### Q: 部署後多久生效？

A: 通常幾分鐘內生效，最多可能需要 24 小時。您可以使用上述驗證工具檢查。

### Q: 如何確認 GitHub Pages 已啟用？

A: 訪問您的倉庫 **Settings** > **Pages**，如果看到 "Your site is live at..." 表示已啟用。

## 下一步

完成 Digital Asset Links 部署後：

1. 驗證文件可以正常訪問
2. 使用驗證工具確認配置正確
3. 構建 Android AAB：`gradlew.bat bundleRelease`
4. 上傳到 Google Play Console

---

**提示**：如果您的網站確實在 `/TradeFolio/` 子目錄，最簡單的方法是創建一個專門的 `rong-bit.github.io` 倉庫，只包含 `.well-known/assetlinks.json` 文件。

