@echo off
REM 推送到 GitHub 的簡化腳本

echo ========================================
echo 推送到 GitHub
echo ========================================
echo.

REM 檢查是否在正確的目錄
if not exist ".well-known\assetlinks.json" (
    echo ❌ 錯誤：找不到 .well-known\assetlinks.json
    echo 請確保在 rong-bit.github.io 目錄中執行此腳本
    pause
    exit /b 1
)

echo 當前分支: 
git branch

echo.
echo 步驟 1: 將分支重命名為 main...
git branch -M main

echo.
echo 步驟 2: 設置遠程倉庫...
echo.
echo ⚠️  請確保您已經在 GitHub 創建了 rong-bit.github.io 倉庫
echo.
set /p REMOTE_URL="請輸入 GitHub 倉庫 URL (例如: https://github.com/rong-bit/rong-bit.github.io.git): "

if "%REMOTE_URL%"=="" (
    echo ❌ 未輸入 URL
    pause
    exit /b 1
)

REM 移除現有的遠程倉庫（如果存在）
git remote remove origin 2>nul
git remote add origin %REMOTE_URL%

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
    echo 1. 進入 GitHub 倉庫: %REMOTE_URL%
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
    echo - 倉庫 URL 不正確
    echo - 尚未創建 GitHub 倉庫
    echo - 沒有推送權限
    echo.
    echo 請檢查並重試
)

echo.
pause

