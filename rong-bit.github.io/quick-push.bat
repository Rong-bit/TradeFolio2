@echo off
REM 快速推送腳本 - 使用預設的 GitHub URL

echo ========================================
echo 快速推送到 GitHub
echo ========================================
echo.

REM 檢查是否在正確的目錄
if not exist ".well-known\assetlinks.json" (
    echo ❌ 錯誤：找不到 .well-known\assetlinks.json
    echo 請確保在 rong-bit.github.io 目錄中執行此腳本
    pause
    exit /b 1
)

echo 步驟 1: 將分支重命名為 main...
git branch -M main

echo.
echo 步驟 2: 設置遠程倉庫...
REM 移除現有的遠程倉庫（如果存在）
git remote remove origin 2>nul
git remote add origin https://github.com/rong-bit/rong-bit.github.io.git

echo ✅ 遠程倉庫已設置: https://github.com/rong-bit/rong-bit.github.io.git

echo.
echo 步驟 3: 推送到 GitHub...
git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ 推送成功！
    echo ========================================
    echo.
    echo 下一步：
    echo 1. 訪問: https://github.com/rong-bit/rong-bit.github.io
    echo 2. 點擊 Settings ^> Pages
    echo 3. Source: Deploy from a branch
    echo 4. Branch: main, Folder: / (root)
    echo 5. 點擊 Save
    echo.
    echo 等待幾分鐘後，訪問：
    echo https://rong-bit.github.io/.well-known/assetlinks.json
) else (
    echo.
    echo ❌ 推送失敗
    echo.
    echo 可能的原因：
    echo - 尚未在 GitHub 創建 rong-bit.github.io 倉庫
    echo - 倉庫 URL 不正確
    echo - 沒有推送權限
    echo.
    echo 請先確保已在 GitHub 創建倉庫，然後重試
)

echo.
pause

