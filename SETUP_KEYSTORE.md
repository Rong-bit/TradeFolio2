# 設置 Android 密鑰庫指南

## 問題：找不到 keytool 命令

如果執行 `keytool` 時出現 "無法辨識" 錯誤，表示 Java JDK 未安裝或未正確配置。

## 解決方案

### 方法一：安裝 Java JDK（如果還沒有安裝）

1. **下載 Java JDK**：
   - 訪問：https://www.oracle.com/java/technologies/downloads/
   - 或使用 OpenJDK：https://adoptium.net/
   - 下載 Windows 版本的 JDK（建議 JDK 11 或更高版本）

2. **安裝 JDK**：
   - 運行安裝程序
   - 記住安裝路徑（通常是 `C:\Program Files\Java\jdk-XX`）

3. **設置環境變量**：
   - 右鍵「此電腦」>「屬性」>「進階系統設置」>「環境變量」
   - 在「系統變量」中：
     - 新建 `JAVA_HOME`，值為 JDK 安裝路徑（例如：`C:\Program Files\Java\jdk-17`）
     - 編輯 `Path`，添加：`%JAVA_HOME%\bin`
   - 重新打開命令提示符或 PowerShell

4. **驗證安裝**：
   ```bash
   java -version
   keytool
   ```

### 方法二：使用 Android Studio 的 keytool

如果您已安裝 Android Studio，可以使用其內置的 keytool：

1. **找到 Android Studio 的 JDK 路徑**：
   - 通常在：`C:\Users\YourUsername\AppData\Local\Android\Sdk\jbr\bin\keytool.exe`
   - 或：`C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe`

2. **使用完整路徑執行**：
   ```bash
   "C:\Users\YourUsername\AppData\Local\Android\Sdk\jbr\bin\keytool.exe" -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
   ```

### 方法三：使用在線工具（臨時方案）

如果暫時無法安裝 Java，可以使用在線工具生成密鑰庫，但**不推薦**用於生產環境。

## 創建密鑰庫

安裝 Java 後，在項目根目錄執行：

```bash
keytool -genkey -v -keystore android.keystore -alias android -keyalg RSA -keysize 2048 -validity 10000
```

系統會要求輸入：
- **密鑰庫密碼**：請妥善保管，遺失後無法更新應用
- **密鑰密碼**：可以與密鑰庫密碼相同
- **姓名**：您的姓名或組織名稱
- **組織單位**：可選
- **組織**：可選
- **城市**：可選
- **州/省**：可選
- **國家代碼**：例如 TW（台灣）或 US（美國）

## 重要提示

⚠️ **請妥善保管密鑰庫文件和密碼**：
- 如果遺失密鑰庫，將無法更新已上架的應用
- 建議將密鑰庫備份到安全位置
- 不要將密鑰庫提交到 Git（已在 .gitignore 中）

## 完成後

創建密鑰庫後，執行：
```bash
.\get-fingerprint.bat
```

獲取 SHA256 指紋，然後更新 `assetlinks.json` 文件。

