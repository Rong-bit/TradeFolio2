# 獲取 SHA256 指紋指南

## 當前狀態

✅ 密鑰庫已成功創建：`android.keystore`

## 獲取 SHA256 指紋

### 方法一：使用腳本（推薦）

執行以下命令：

```bash
.\get-fingerprint.bat
```

**重要**：腳本會要求您輸入密鑰庫密碼（這是您創建密鑰庫時設置的密碼）。

### 方法二：手動執行命令

如果您想手動執行，使用以下命令：

```bash
"C:\Program Files\Android\Android Studio\jbr\bin\keytool.exe" -list -v -keystore android.keystore -alias android
```

同樣需要輸入密鑰庫密碼。

## 在輸出中查找 SHA256 指紋

執行命令後，您會看到類似這樣的輸出：

```
Certificate fingerprints:
     SHA1: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE
     SHA256: AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB
```

**找到 `SHA256:` 後面的值**，例如：
```
AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB:CC:DD:EE:FF:11:22:33:44:55:66:77:88:99:AA:BB
```

**去掉所有冒號**，變成：
```
AABBCCDDEEFF112233445566778899AABBCCDDEEFF112233445566778899AABB
```

## 更新 assetlinks.json

1. 打開文件：`rong-bit.github.io\.well-known\assetlinks.json`

2. 找到這一行：
   ```json
   "YOUR_SHA256_FINGERPRINT_HERE"
   ```

3. 替換為您獲取的指紋（無冒號格式）：
   ```json
   "AABBCCDDEEFF112233445566778899AABBCCDDEEFF112233445566778899AABB"
   ```

4. 保存文件

## 提交並推送更新

執行以下命令：

```bash
.\update-fingerprint.bat
```

或者手動執行：

```bash
cd rong-bit.github.io
git add .well-known/assetlinks.json
git commit -m "Update with real SHA256 fingerprint"
git push
```

## 驗證

等待幾分鐘後，訪問：
- https://rong-bit.github.io/.well-known/assetlinks.json

確認指紋已更新。

## 完成後

更新指紋後，您就可以：
1. ✅ 構建 Android AAB：`gradlew.bat bundleRelease`
2. ✅ 上傳到 Google Play Console
3. ✅ TWA 應用將能夠正常驗證並運行

