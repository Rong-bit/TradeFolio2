@echo off
REM 獲取 SHA256 指紋的腳本

echo ========================================
echo 獲取 SHA256 指紋
echo ========================================
echo.

REM 檢查密鑰庫是否存在
if not exist "android.keystore" (
    echo ❌ 找不到 android.keystore 文件
    echo.
    echo 請先創建密鑰庫：
    echo .\create-keystore.bat
    echo.
    pause
    exit /b 1
)

REM 查找 keytool
set KEYTOOL_PATH=C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe
if not exist "%KEYTOOL_PATH%" (
    REM 嘗試使用系統 PATH 中的 keytool
    set KEYTOOL_PATH=keytool
)

echo 正在獲取 SHA256 指紋...
echo.

REM 執行 keytool 命令
"%KEYTOOL_PATH%" -list -v -keystore android.keystore -alias android

if %errorlevel% neq 0 (
    echo.
    echo ❌ 獲取指紋失敗
    echo 請檢查密鑰庫路徑和別名是否正確
    pause
    exit /b 1
)

echo.
echo ========================================
echo 請按照以下步驟操作：
echo ========================================
echo.
echo 1. 在上面的輸出中找到 "SHA256:" 後面的值
echo 2. 複製該值並去掉所有冒號
echo 3. 編輯 rong-bit.github.io\.well-known\assetlinks.json
echo 4. 將 YOUR_SHA256_FINGERPRINT_HERE 替換為指紋（無冒號格式）
echo 5. 執行更新腳本：update-fingerprint.bat
echo.
pause

