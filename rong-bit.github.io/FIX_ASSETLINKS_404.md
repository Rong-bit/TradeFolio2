# 修復 Digital Asset Links 404 錯誤

## 問題

訪問 `https://rong-bit.github.io/.well-known/assetlinks.json` 時出現 404 錯誤。

## 可能的原因

1. GitHub Pages 可能還沒有完全部署 `.well-known` 文件夾
2. 文件可能沒有正確推送到 GitHub
3. 需要等待更長時間讓 GitHub 部署完成

## 解決方案

### 方法一：確認文件已推送（推薦）

1. 訪問 GitHub 倉庫：
   https://github.com/rong-bit/rong-bit.github.io

2. 檢查文件是否存在：
   - 點擊 `.well-known` 文件夾
   - 確認 `assetlinks.json` 文件存在

3. 如果文件不存在，重新推送：
   ```bash
   cd rong-bit.github.io
   git add .well-known/assetlinks.json
   git commit -m "Ensure assetlinks.json is tracked"
   git push
   ```

### 方法二：創建 .nojekyll 文件

GitHub Pages 默認使用 Jekyll，可能會忽略以 `.` 開頭的文件夾。創建 `.nojekyll` 文件來禁用 Jekyll：

```bash
cd rong-bit.github.io
echo. > .nojekyll
git add .nojekyll
git commit -m "Add .nojekyll to ensure .well-known folder is served"
git push
```

### 方法三：等待更長時間

GitHub Pages 部署可能需要 10-20 分鐘。請耐心等待。

### 方法四：強制重新部署

1. 進入 GitHub 倉庫的 **Settings** > **Pages**
2. 點擊 **Save** 按鈕（即使設置沒有改變）
3. 這會觸發重新部署

## 驗證步驟

1. 等待 5-10 分鐘
2. 訪問：https://rong-bit.github.io/.well-known/assetlinks.json
3. 應該可以看到 JSON 內容

## 如果仍然無法訪問

檢查 GitHub 倉庫中的文件結構：
- 確保 `.well-known/assetlinks.json` 文件在倉庫中
- 確保文件路徑正確（不是 `.well-known\assetlinks.json`，而是 `.well-known/assetlinks.json`）

## 完成後

一旦文件可以訪問，您就可以：
1. 更新 SHA256 指紋
2. 構建 Android AAB
3. 上傳到 Google Play Console

