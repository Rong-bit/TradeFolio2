# 更新應用圖示指南

您的圖示文件：`TradeFolio_Icon_0 (1).png`

## Android 圖示尺寸要求

Android 應用需要以下尺寸的圖示（所有圖示都應該是方形）：

| 密度 | 尺寸 | 文件夾 |
|------|------|--------|
| mdpi | 48x48 px | `app/src/main/res/mipmap-mdpi/` |
| hdpi | 72x72 px | `app/src/main/res/mipmap-hdpi/` |
| xhdpi | 96x96 px | `app/src/main/res/mipmap-xhdpi/` |
| xxhdpi | 144x144 px | `app/src/main/res/mipmap-xxhdpi/` |
| xxxhdpi | 192x192 px | `app/src/main/res/mipmap-xxxhdpi/` |

## 方法一：使用在線工具（推薦）

1. 訪問 [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html)
2. 上傳您的 `TradeFolio_Icon_0 (1).png` 圖示
3. 選擇「Launcher Icons」
4. 點擊「Download」下載所有尺寸
5. 解壓縮後，將各尺寸的 `ic_launcher.png` 複製到對應的文件夾

## 方法二：使用 ImageMagick（命令行）

如果您已安裝 ImageMagick，可以使用以下命令：

```bash
# 創建不同尺寸的圖示
magick "TradeFolio_Icon_0 (1).png" -resize 48x48 "app/src/main/res/mipmap-mdpi/ic_launcher.png"
magick "TradeFolio_Icon_0 (1).png" -resize 72x72 "app/src/main/res/mipmap-hdpi/ic_launcher.png"
magick "TradeFolio_Icon_0 (1).png" -resize 96x96 "app/src/main/res/mipmap-xhdpi/ic_launcher.png"
magick "TradeFolio_Icon_0 (1).png" -resize 144x144 "app/src/main/res/mipmap-xxhdpi/ic_launcher.png"
magick "TradeFolio_Icon_0 (1).png" -resize 192x192 "app/src/main/res/mipmap-xxxhdpi/ic_launcher.png"
```

## 方法三：使用 Python 腳本

執行 `update-icon.py` 腳本（見下方）

## 方法四：手動替換

1. 使用圖像編輯軟件（如 Photoshop、GIMP）將您的圖示調整為不同尺寸
2. 確保圖示是方形的（如果不是，需要裁剪或添加透明邊框）
3. 將各尺寸的圖示保存為 `ic_launcher.png`
4. 替換對應文件夾中的文件

## 圖示要求

- ✅ 必須是方形（1:1 比例）
- ✅ PNG 格式
- ✅ 建議使用透明背景或與應用主題色匹配的背景
- ✅ 圖示內容應該清晰可見，即使在較小尺寸下
- ✅ 避免使用過多細節，簡潔的設計效果更好

## 更新後

替換圖示後，重新構建應用：

```bash
gradlew.bat bundleRelease
```

## Google Play Store 圖示

Google Play Store 需要 512x512 像素的圖示。您可以使用：

```bash
magick "TradeFolio_Icon_0 (1).png" -resize 512x512 "store_icon.png"
```

或手動調整為 512x512 像素並保存為 `store_icon.png`。

