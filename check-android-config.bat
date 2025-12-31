@echo off
REM Android 配置檢查腳本 (Windows)

echo ========================================
echo Android 配置檢查
echo ========================================
echo.

REM 檢查 gradle.properties
echo 1. 檢查 gradle.properties 簽名配置...
findstr /C:"RELEASE_STORE_FILE" gradle.properties >nul 2>&1
if %errorlevel% equ 0 (
    findstr /C:"#RELEASE_STORE_FILE" gradle.properties >nul 2>&1
    if %errorlevel% neq 0 (
        echo    ✅ 簽名配置已設置
    ) else (
        echo    ⚠️  簽名配置被註釋，請取消註釋
    )
) else (
    echo    ⚠️  簽名配置未設置，請編輯 gradle.properties
)

REM 檢查 build.gradle 中的網址配置
echo.
echo 2. 檢查 build.gradle 網址配置...
findstr /C:"hostName: 'rong-bit.github.io'" app\build.gradle >nul 2>&1
if %errorlevel% equ 0 (
    findstr /C:"launchUrl: '/TradeFolio/'" app\build.gradle >nul 2>&1
    if %errorlevel% equ 0 (
        echo    ✅ 網址配置正確: https://rong-bit.github.io/TradeFolio/
    ) else (
        echo    ⚠️  網址配置可能不正確，請檢查 launchUrl
    )
) else (
    echo    ⚠️  請檢查網址配置
)

REM 檢查版本號
echo.
echo 3. 檢查版本號...
findstr /C:"versionCode" app\build.gradle
findstr /C:"versionName" app\build.gradle

REM 檢查 AAB 文件是否存在
echo.
echo 4. 檢查構建文件...
if exist "app\build\outputs\bundle\release\app-release.aab" (
    echo    ✅ AAB 文件已存在
) else (
    echo    ⚠️  AAB 文件不存在，請先執行構建
)

REM 檢查 Digital Asset Links
echo.
echo 5. 檢查 Digital Asset Links...
echo    ⚠️  請確認以下文件已部署到 GitHub Pages 域名根目錄:
echo    https://rong-bit.github.io/.well-known/assetlinks.json
echo    注意: 即使網站在 /TradeFolio/ 子目錄，此文件也必須放在域名根目錄
echo    使用範例文件: .well-known\assetlinks.json.example

echo.
echo ========================================
echo 檢查完成
echo ========================================
pause

