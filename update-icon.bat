@echo off
REM Android 圖示更新腳本 (Windows)
REM 需要安裝 Python 和 Pillow 庫

echo ========================================
echo Android 圖示更新工具
echo ========================================
echo.

REM 檢查 Python 是否安裝
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ 未找到 Python，請先安裝 Python
    echo.
    echo 安裝方法：
    echo 1. 訪問 https://www.python.org/downloads/
    echo 2. 下載並安裝 Python 3.x
    echo 3. 安裝 Pillow 庫: pip install Pillow
    pause
    exit /b 1
)

REM 檢查 Pillow 是否安裝
python -c "import PIL" >nul 2>&1
if %errorlevel% neq 0 (
    echo ⚠️  Pillow 庫未安裝
    echo 正在安裝 Pillow...
    pip install Pillow
    if %errorlevel% neq 0 (
        echo ❌ Pillow 安裝失敗
        pause
        exit /b 1
    )
)

REM 執行 Python 腳本
echo 正在更新圖示...
echo.
python update-icon.py

if %errorlevel% equ 0 (
    echo.
    echo ✅ 圖示更新完成！
) else (
    echo.
    echo ❌ 圖示更新失敗
)

echo.
pause

