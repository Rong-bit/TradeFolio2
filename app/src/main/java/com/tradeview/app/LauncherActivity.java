/*
 * Copyright 2020 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
package com.tradeview.app;

import android.content.Intent;
import android.content.pm.ActivityInfo;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.Log;
import android.webkit.WebView;

public class LauncherActivity
        extends com.google.androidbrowserhelper.trusted.LauncherActivity {
    
    private static final String TAG = "LauncherActivity";
    private static BillingBridge billingBridge;
    private WebView webView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        // Setting an orientation crashes the app due to the transparent background on Android 8.0
        // Oreo and below. We only set the orientation on Oreo and above. This only affects the
        // splash screen and Chrome will still respect the orientation.
        // See https://github.com/GoogleChromeLabs/bubblewrap/issues/496 for details.
        if (Build.VERSION.SDK_INT > Build.VERSION_CODES.O) {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        } else {
            setRequestedOrientation(ActivityInfo.SCREEN_ORIENTATION_UNSPECIFIED);
        }
        
        // 處理 URL Scheme Intent (tradeview://billing)
        handleIntent(getIntent());
    }

    @Override
    protected void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
        setIntent(intent);
        handleIntent(intent);
    }

    private void handleIntent(Intent intent) {
        if (intent != null && intent.getData() != null) {
            Uri data = intent.getData();
            if ("tradeview".equals(data.getScheme()) && "billing".equals(data.getHost())) {
                String action = data.getQueryParameter("action");
                String dataParam = data.getQueryParameter("data");
                
                if (action != null && billingBridge != null) {
                    Log.d(TAG, "Handling billing request: " + action);
                    billingBridge.handleWebRequest(action, dataParam != null ? dataParam : "{}");
                }
            }
        }
    }

    @Override
    protected Uri getLaunchingUrl() {
        // Get the original launch Url.
        Uri uri = super.getLaunchingUrl();

        // 初始化 BillingBridge（如果還沒有初始化）
        // 注意：TWA 使用 CustomTabs，無法直接訪問 WebView
        // 但我們仍然可以初始化 BillingBridge 來處理 URL Scheme 請求
        if (billingBridge == null) {
            // 在 TWA 模式下，webView 為 null，但 BillingBridge 仍可通過 URL Scheme 工作
            billingBridge = new BillingBridge(this, null);
        }

        return uri;
    }
}
