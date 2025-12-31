#!/bin/bash
# 構建用於 Google Play 上架的簽名 AAB 文件
# 請確保已正確配置 gradle.properties 中的簽名信息

echo "========================================"
echo "開始構建 TradeFolio Release AAB"
echo "========================================"
echo ""

# 檢查是否配置了簽名
if [ ! -f "gradle.properties" ]; then
    echo "錯誤: 找不到 gradle.properties 文件"
    exit 1
fi

echo "正在清理舊的構建文件..."
./gradlew clean

echo ""
echo "正在構建 Release AAB..."
./gradlew bundleRelease

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "構建成功！"
    echo "========================================"
    echo ""
    echo "AAB 文件位置:"
    echo "app/build/outputs/bundle/release/app-release.aab"
    echo ""
    echo "請將此文件上傳到 Google Play Console"
    echo ""
else
    echo ""
    echo "========================================"
    echo "構建失敗！"
    echo "========================================"
    echo ""
    echo "請檢查錯誤信息並確保："
    echo "1. 已正確配置 gradle.properties 中的簽名信息"
    echo "2. 密鑰庫文件路徑正確"
    echo "3. 密碼正確"
    echo ""
    exit 1
fi

