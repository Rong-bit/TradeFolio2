# GitHub Pages 上架步驟（使用 deploy.yml）

## 一、前置：Repo 與權限

1. **程式碼已在 GitHub**
   - 專案已 push 到 GitHub 的某個 repo（例如 `your-username/TradeFolio`）。

2. **開啟 GitHub Pages**
   - 進入 repo → **Settings** → 左側 **Pages**。
   - **Build and deployment**：
     - **Source** 選 **GitHub Actions**（不要選 Deploy from a branch）。

---

## 二、觸發部署的兩種方式

### 方式 A：Push 到 main 自動部署（推薦）

1. 在本地確認分支為 `main`：
   ```bash
   git branch
   ```
2. 若有改動，提交並推送到 GitHub：
   ```bash
   git add .
   git commit -m "你的說明"
   git push origin main
   ```
3. 推送後，workflow 會自動執行：建置 → 上傳 artifact → 部署到 GitHub Pages。

### 方式 B：手動觸發一次部署

1. 進入 repo 上方 **Actions** 分頁。
2. 左側點選 **Deploy to GitHub Pages**。
3. 右側點 **Run workflow**，選分支（通常選 `main`）後再點 **Run workflow**。
4. 等該次 run 跑完（綠勾）即完成部署。

---

## 三、查看結果與網址

- **Actions** 分頁：可看每次 run 的日誌；若失敗，點進該 run 看紅色步驟的錯誤訊息。
- **Settings → Pages**：部署成功後會顯示網址，格式通常為：
  - `https://<你的帳號>.github.io/<repo 名稱>/`

例如 repo 名稱為 `TradeFolio`，網址即：`https://your-username.github.io/TradeFolio/`。

---

## 四、此 workflow 在做什麼（簡述）

| 步驟 | 說明 |
|------|------|
| **build** | 拉程式碼 → 裝依賴 → 執行 `npm run build:skip-check` 產出 `dist/` → 上傳為 Pages 用 artifact |
| **deploy** | 使用 `deploy-pages` 把 artifact 部署到 GitHub Pages |

- 觸發時機：**push 到 `main`** 或 **Actions 裡手動 Run workflow**。
- 若建置失敗，不會有 artifact，deploy 不會執行，網頁就不會更新；請到 Actions 看錯誤並修正（例如依賴、環境變數、缺少檔案等）。

---

## 五、常見問題

- **網頁空白或 404**  
  - 確認 **Settings → Pages → Source** 為 **GitHub Actions**。  
  - 確認 Actions 裡最新一次「Deploy to GitHub Pages」為成功（綠勾）。

- **Build 失敗**  
  - 點進失敗的 run，看是哪一步錯（多半是 `Build`）。  
  - 依錯誤訊息修正（例如補上 `package-lock.json`、修正依賴或路徑）。

- **需要 API Key**  
  - 若建置或執行時需要 `API_KEY`：**Settings → Secrets and variables → Actions** 新增 secret，名稱設為 `API_KEY`，value 為你的金鑰。  
  - workflow 已使用 `secrets.API_KEY`，無需改檔名。
