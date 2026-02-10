@echo off
REM 更新 SHA256 指紋並推送到 GitHub

echo ========================================
echo 更新 SHA256 指紋
echo ========================================
echo.

REM 檢查文件是否存在
if not exist "rong-bit.github.io\.well-known\assetlinks.json" (
    echo ❌ 找不到 assetlinks.json 文件
    pause
    exit /b 1
)

echo 請確認您已經：
echo 1. 獲取了 SHA256 指紋（使用 get-fingerprint.bat）
echo 2. 編輯了 assetlinks.json 文件，替換了 YOUR_SHA256_FINGERPRINT_HERE
echo.
set /p CONFIRM="是否已完成上述步驟？(Y/N): "

if /i not "%CONFIRM%"=="Y" (
    echo 操作已取消
    pause
    exit /b 0
)

echo.
echo 步驟 1: 檢查文件內容...
type "rong-bit.github.io\.well-known\assetlinks.json"

echo.
echo.
set /p CONFIRM2="確認指紋已更新？(Y/N): "

if /i not "%CONFIRM2%"=="Y" (
    echo 操作已取消，請先更新文件
    pause
    exit /b 0
)

echo.
echo 步驟 2: 提交更改...
cd rong-bit.github.io
git add .well-known/assetlinks.json
git commit -m "Update with real SHA256 fingerprint"

echo.
echo 步驟 3: 推送到 GitHub...
git push

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ 更新成功！
    echo ========================================
    echo.
    echo 等待幾分鐘後，訪問以下 URL 驗證：
    echo https://rong-bit.github.io/.well-known/assetlinks.json
    echo.
    echo 下一步：
    echo 1. 構建 Android AAB: gradlew.bat bundleRelease
    echo 2. 上傳到 Google Play Console
) else (
    echo.
    echo ❌ 推送失敗
)

echo.
cd ..
pause

