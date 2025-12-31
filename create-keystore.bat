@echo off
REM 使用 Android Studio 的 keytool 創建密鑰庫

echo ========================================
echo 創建 Android 密鑰庫
echo ========================================
echo.

set KEYTOOL_PATH=C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe

if not exist "%KEYTOOL_PATH%" (
    echo ❌ 找不到 keytool
    echo 請確認 Android Studio 已安裝在預設位置
    echo 或手動修改此腳本中的 KEYTOOL_PATH
    pause
    exit /b 1
)

echo 使用 keytool: %KEYTOOL_PATH%
echo.
echo 請按照提示輸入信息：
echo - 密鑰庫密碼（請妥善保管，遺失後無法更新應用）
echo - 密鑰密碼（可以與密鑰庫密碼相同）
echo - 姓名、組織等信息
echo.
echo 開始創建...
echo.

"%KEYTOOL_PATH%" -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000

if %errorlevel% equ 0 (
    echo.
    echo ========================================
    echo ✅ 密鑰庫創建成功！
    echo ========================================
    echo.
    echo 下一步：
    echo 1. 執行: .\get-fingerprint.bat
    echo 2. 獲取 SHA256 指紋
    echo 3. 更新 assetlinks.json
) else (
    echo.
    echo ❌ 密鑰庫創建失敗
)

echo.
pause

