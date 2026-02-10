#!/bin/bash
# 將 Digital Asset Links 文件提交到 GitHub

echo "========================================"
echo "提交 Digital Asset Links 到 GitHub"
echo "========================================"
echo ""

# 檢查是否在正確的目錄
if [ ! -f ".well-known/assetlinks.json" ]; then
    echo "❌ 錯誤：找不到 .well-known/assetlinks.json"
    echo "請確保在 rong-bit.github.io 目錄中執行此腳本"
    exit 1
fi

echo "步驟 1: 初始化 Git 倉庫（如果尚未初始化）..."
if [ ! -d ".git" ]; then
    git init
    echo "✅ Git 倉庫已初始化"
else
    echo "✅ Git 倉庫已存在"
fi

echo ""
echo "步驟 2: 添加文件..."
git add .well-known/assetlinks.json
git add README.md

echo ""
echo "步驟 3: 提交更改..."
git commit -m "Add Digital Asset Links for TradeFolio"

echo ""
echo "步驟 4: 設置遠程倉庫..."
echo ""
echo "⚠️  請確保您已經在 GitHub 創建了 rong-bit.github.io 倉庫"
echo ""
read -p "請輸入 GitHub 倉庫 URL (例如: https://github.com/rong-bit/rong-bit.github.io.git): " REMOTE_URL

if [ -z "$REMOTE_URL" ]; then
    echo "❌ 未輸入 URL，跳過遠程設置"
    echo ""
    echo "您可以稍後手動執行："
    echo "  git remote add origin YOUR_REPO_URL"
    echo "  git branch -M main"
    echo "  git push -u origin main"
    exit 0
fi

git remote remove origin 2>/dev/null
git remote add origin "$REMOTE_URL"
git branch -M main

echo ""
echo "步驟 5: 推送到 GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "✅ 提交成功！"
    echo "========================================"
    echo ""
    echo "下一步："
    echo "1. 進入 GitHub 倉庫設置"
    echo "2. Settings > Pages"
    echo "3. Source: Deploy from a branch"
    echo "4. Branch: main, Folder: / (root)"
    echo "5. 點擊 Save"
    echo ""
    echo "等待幾分鐘後，訪問："
    echo "https://rong-bit.github.io/.well-known/assetlinks.json"
else
    echo ""
    echo "❌ 推送失敗，請檢查："
    echo "- 是否已創建 GitHub 倉庫"
    echo "- 倉庫 URL 是否正確"
    echo "- 是否有推送權限"
    exit 1
fi

