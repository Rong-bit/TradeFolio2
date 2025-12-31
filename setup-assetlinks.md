# 快速設置 Digital Asset Links

## 最簡單的方法：創建專用倉庫

由於您的網站在 `https://rong-bit.github.io/TradeFolio/`，但 Digital Asset Links 必須在域名根目錄，最簡單的方法是創建一個專門的倉庫。

## 步驟

### 1. 在 GitHub 創建新倉庫

- 倉庫名稱：`rong-bit.github.io`（必須與您的 GitHub 用戶名完全一致）
- 設為公開（Public）
- 不要初始化 README、.gitignore 或 license

### 2. 在本地創建文件

```bash
# 創建文件夾
mkdir rong-bit.github.io
cd rong-bit.github.io

# 創建 .well-known 文件夾
mkdir -p .well-known
```

### 3. 創建 assetlinks.json 文件

在 `.well-known/assetlinks.json` 中填入以下內容（先使用範例指紋，稍後替換）：

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

### 4. 獲取 SHA256 指紋

如果您還沒有密鑰庫：

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

獲取指紋：

```bash
keytool -list -v -keystore android.keystore -alias android
```

找到 "SHA256:" 後面的指紋，複製並去掉冒號，例如：
- 原始：`AA:BB:CC:DD:EE:FF:...`
- 使用：`AABBCCDDEEFF...`

### 5. 提交到 GitHub

```bash
git init
git add .well-known/assetlinks.json
git commit -m "Add Digital Asset Links for TradeFolio"
git branch -M main
git remote add origin https://github.com/rong-bit/rong-bit.github.io.git
git push -u origin main
```

### 6. 啟用 GitHub Pages

1. 進入 `rong-bit.github.io` 倉庫
2. **Settings** > **Pages**
3. **Source**: `Deploy from a branch`
4. **Branch**: `main`
5. **Folder**: `/ (root)`
6. 點擊 **Save**

### 7. 等待並驗證

等待幾分鐘後，訪問：
- `https://rong-bit.github.io/.well-known/assetlinks.json`

應該可以看到 JSON 內容。

## 驗證工具

使用以下工具驗證配置：

1. **Google API**：
   ```
   https://digitalassetlinks.googleapis.com/v1/statements:list?source.web.site=https://rong-bit.github.io&relation=delegate_permission/common.handle_all_urls
   ```

2. **在線驗證工具**：
   https://developers.google.com/digital-asset-links/tools/generator

## 注意事項

- 這個倉庫只需要包含 `.well-known/assetlinks.json` 文件
- 您的實際網站可以繼續在 `TradeFolio` 倉庫的 `/TradeFolio/` 子目錄
- 兩個倉庫可以並存，互不影響

