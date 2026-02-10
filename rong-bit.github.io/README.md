# rong-bit.github.io

此倉庫用於部署 Digital Asset Links 文件，以支持 TradeFolio Android 應用的 TWA（Trusted Web Activity）功能。

## 文件結構

```
rong-bit.github.io/
  .well-known/
    assetlinks.json
```

## 設置步驟

### 1. 在 GitHub 創建倉庫

1. 訪問 https://github.com/new
2. 倉庫名稱：**`rong-bit.github.io`**（必須與 GitHub 用戶名完全一致）
3. 設為 **Public**（公開）
4. **不要**勾選任何初始化選項
5. 點擊 **Create repository**

### 2. 提交文件到 GitHub

在項目根目錄（`rong-bit.github.io`）執行：

```bash
git init
git add .well-known/assetlinks.json
git commit -m "Add Digital Asset Links for TradeFolio"
git branch -M main
git remote add origin https://github.com/rong-bit/rong-bit.github.io.git
git push -u origin main
```

### 3. 啟用 GitHub Pages

1. 進入 `rong-bit.github.io` 倉庫的 **Settings** > **Pages**
2. **Source** 選擇：`Deploy from a branch`
3. **Branch** 選擇：`main`
4. **Folder** 選擇：`/ (root)`
5. 點擊 **Save**

### 4. 更新 SHA256 指紋

目前 `assetlinks.json` 中使用的是佔位符 `YOUR_SHA256_FINGERPRINT_HERE`。

獲取真實指紋後，更新文件並提交：

```bash
# 編輯 assetlinks.json，替換指紋
# 然後提交更新
git add .well-known/assetlinks.json
git commit -m "Update with real SHA256 fingerprint"
git push
```

## 獲取 SHA256 指紋

### 如果還沒有密鑰庫：

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

### 獲取指紋：

```bash
keytool -list -v -keystore android.keystore -alias android
```

找到 `SHA256:` 後面的值，**去掉所有冒號**後填入 `assetlinks.json`。

例如：
- 原始：`AA:BB:CC:DD:EE:FF:...`
- 使用：`AABBCCDDEEFF...`

## 驗證

部署後，訪問以下 URL 應該可以看到 JSON 內容：

https://rong-bit.github.io/.well-known/assetlinks.json

## 注意事項

- 此倉庫只需要包含 `.well-known/assetlinks.json` 文件
- 您的實際網站可以繼續在 `TradeFolio` 倉庫
- 兩個倉庫互不影響

