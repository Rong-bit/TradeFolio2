/*
 * Copyright 2024 TradeView
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

import android.app.Activity;
import android.content.Context;
import android.util.Log;
import android.webkit.JavascriptInterface;
import android.webkit.WebView;

import androidx.annotation.NonNull;

import com.android.billingclient.api.AcknowledgePurchaseParams;
import com.android.billingclient.api.AcknowledgePurchaseResponseListener;
import com.android.billingclient.api.BillingClient;
import com.android.billingclient.api.BillingClientStateListener;
import com.android.billingclient.api.BillingFlowParams;
import com.android.billingclient.api.BillingResult;
import com.android.billingclient.api.ConsumeParams;
import com.android.billingclient.api.ConsumeResponseListener;
import com.android.billingclient.api.ProductDetails;
import com.android.billingclient.api.Purchase;
import com.android.billingclient.api.PurchasesResponseListener;
import com.android.billingclient.api.PurchasesUpdatedListener;
import com.android.billingclient.api.QueryProductDetailsParams;
import com.android.billingclient.api.QueryPurchasesParams;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

public class BillingBridge implements PurchasesUpdatedListener {
    private static final String TAG = "BillingBridge";
    
    private final Activity activity;
    private final WebView webView;
    private BillingClient billingClient;
    private boolean isServiceConnected = false;
    
    // 產品 ID
    public static final String PRODUCT_MONTHLY = "tradeview_monthly";
    public static final String PRODUCT_YEARLY = "tradeview_yearly";
    
    public BillingBridge(Activity activity, WebView webView) {
        this.activity = activity;
        this.webView = webView;
        initBillingClient();
    }
    
    private void initBillingClient() {
        billingClient = BillingClient.newBuilder(activity)
                .setListener(this)
                .enablePendingPurchases()
                .build();
        
        billingClient.startConnection(new BillingClientStateListener() {
            @Override
            public void onBillingSetupFinished(@NonNull BillingResult billingResult) {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    isServiceConnected = true;
                    Log.d(TAG, "Billing service connected");
                    runOnUiThread(() -> {
                        callJavaScript("onBillingReady", "{}");
                    });
                } else {
                    isServiceConnected = false;
                    Log.e(TAG, "Billing service connection failed: " + billingResult.getDebugMessage());
                    runOnUiThread(() -> {
                        callJavaScript("onBillingError", "{\"error\":\"" + billingResult.getDebugMessage() + "\"}");
                    });
                }
            }
            
            @Override
            public void onBillingServiceDisconnected() {
                isServiceConnected = false;
                Log.d(TAG, "Billing service disconnected");
            }
        });
    }
    
    @JavascriptInterface
    public void queryProducts() {
        if (!isServiceConnected) {
            callJavaScript("onProductsError", "{\"error\":\"Billing service not connected\"}");
            return;
        }
        
        List<QueryProductDetailsParams.Product> productList = new ArrayList<>();
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_MONTHLY)
                .setProductType(BillingClient.ProductType.SUBS)
                .build());
        productList.add(QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_YEARLY)
                .setProductType(BillingClient.ProductType.SUBS)
                .build());
        
        QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                .setProductList(productList)
                .build();
        
        billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
            if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                try {
                    JSONArray productsArray = new JSONArray();
                    for (ProductDetails productDetails : productDetailsList) {
                        JSONObject product = new JSONObject();
                        product.put("productId", productDetails.getProductId());
                        product.put("title", productDetails.getTitle());
                        product.put("description", productDetails.getDescription());
                        
                        // 訂閱
                        List<ProductDetails.SubscriptionOfferDetails> offers = 
                                productDetails.getSubscriptionOfferDetails();
                        if (offers != null && !offers.isEmpty()) {
                            ProductDetails.SubscriptionOfferDetails offer = offers.get(0);
                            ProductDetails.PricingPhases pricingPhases = offer.getPricingPhases();
                            if (pricingPhases.getPricingPhaseList() != null && 
                                !pricingPhases.getPricingPhaseList().isEmpty()) {
                                ProductDetails.PricingPhase pricingPhase = 
                                        pricingPhases.getPricingPhaseList().get(0);
                                product.put("price", pricingPhase.getFormattedPrice());
                                product.put("priceAmountMicros", pricingPhase.getPriceAmountMicros());
                            }
                        }
                        
                        productsArray.put(product);
                    }
                    
                    JSONObject result = new JSONObject();
                    result.put("products", productsArray);
                    callJavaScript("onProductsLoaded", result.toString());
                } catch (JSONException e) {
                    Log.e(TAG, "Error creating products JSON", e);
                    callJavaScript("onProductsError", "{\"error\":\"" + e.getMessage() + "\"}");
                }
            } else {
                callJavaScript("onProductsError", "{\"error\":\"" + billingResult.getDebugMessage() + "\"}");
            }
        });
    }
    
    @JavascriptInterface
    public void launchPurchaseFlow(String productId) {
        if (!isServiceConnected) {
            callJavaScript("onPurchaseError", "{\"error\":\"Billing service not connected\"}");
            return;
        }
        
        activity.runOnUiThread(() -> {
            QueryProductDetailsParams.Product product;
            
            if (PRODUCT_MONTHLY.equals(productId) || PRODUCT_YEARLY.equals(productId)) {
                product = QueryProductDetailsParams.Product.newBuilder()
                        .setProductId(productId)
                        .setProductType(BillingClient.ProductType.SUBS)
                        .build();
            } else {
                callJavaScript("onPurchaseError", "{\"error\":\"Invalid product ID\"}");
                return;
            }
            
            QueryProductDetailsParams params = QueryProductDetailsParams.newBuilder()
                    .setProductList(Collections.singletonList(product))
                    .build();
            
            billingClient.queryProductDetailsAsync(params, (billingResult, productDetailsList) -> {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK 
                        && !productDetailsList.isEmpty()) {
                    ProductDetails productDetails = productDetailsList.get(0);
                    
                    // 訂閱
                    List<ProductDetails.SubscriptionOfferDetails> offers = 
                            productDetails.getSubscriptionOfferDetails();
                    if (offers != null && !offers.isEmpty()) {
                        ProductDetails.SubscriptionOfferDetails offer = offers.get(0);
                        String offerToken = offer.getOfferToken();
                        
                        BillingFlowParams.ProductDetailsParams productDetailsParams = 
                                BillingFlowParams.ProductDetailsParams.newBuilder()
                                        .setProductDetails(productDetails)
                                        .setOfferToken(offerToken)
                                        .build();
                        BillingFlowParams.Builder flowParamsBuilder = BillingFlowParams.newBuilder()
                                .setProductDetailsParamsList(List.of(productDetailsParams));
                        
                        BillingResult result = billingClient.launchBillingFlow(activity, flowParamsBuilder.build());
                        if (result.getResponseCode() != BillingClient.BillingResponseCode.OK) {
                            callJavaScript("onPurchaseError", "{\"error\":\"" + result.getDebugMessage() + "\"}");
                        }
                    } else {
                        callJavaScript("onPurchaseError", "{\"error\":\"No offer available\"}");
                        return;
                    }
                } else {
                    callJavaScript("onPurchaseError", "{\"error\":\"Product not found\"}");
                }
            });
        });
    }
    
    @JavascriptInterface
    public void queryPurchases() {
        if (!isServiceConnected) {
            callJavaScript("onPurchasesError", "{\"error\":\"Billing service not connected\"}");
            return;
        }
        
        // 查詢訂閱
        QueryPurchasesParams subsParams = QueryPurchasesParams.newBuilder()
                .setProductType(BillingClient.ProductType.SUBS)
                .build();
        
        billingClient.queryPurchasesAsync(subsParams, (billingResult, purchases) -> {
            handlePurchases(billingResult, purchases, false);
        });
    }
    
    private void handlePurchases(BillingResult billingResult, List<Purchase> purchases, boolean isInApp) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
            try {
                JSONArray purchasesArray = new JSONArray();
                for (Purchase purchase : purchases) {
                    JSONObject purchaseObj = new JSONObject();
                    purchaseObj.put("orderId", purchase.getOrderId());
                    purchaseObj.put("purchaseToken", purchase.getPurchaseToken());
                    purchaseObj.put("productIds", new JSONArray(purchase.getProducts()));
                    purchaseObj.put("purchaseTime", purchase.getPurchaseTime());
                    purchaseObj.put("isAcknowledged", purchase.isAcknowledged());
                    purchasesArray.put(purchaseObj);
                    
                    // 確認購買（如果是未確認的）
                    if (!purchase.isAcknowledged()) {
                        acknowledgePurchase(purchase);
                    }
                }
                
                JSONObject result = new JSONObject();
                result.put("purchases", purchasesArray);
                result.put("type", isInApp ? "inapp" : "subs");
                callJavaScript("onPurchasesLoaded", result.toString());
            } catch (JSONException e) {
                Log.e(TAG, "Error creating purchases JSON", e);
                callJavaScript("onPurchasesError", "{\"error\":\"" + e.getMessage() + "\"}");
            }
        } else {
            callJavaScript("onPurchasesError", "{\"error\":\"" + billingResult.getDebugMessage() + "\"}");
        }
    }
    
    private void acknowledgePurchase(Purchase purchase) {
        if (purchase.getPurchaseState() == Purchase.PurchaseState.PURCHASED) {
            AcknowledgePurchaseParams params = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchase.getPurchaseToken())
                    .build();
            
            billingClient.acknowledgePurchase(params, billingResult -> {
                if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK) {
                    Log.d(TAG, "Purchase acknowledged: " + purchase.getOrderId());
                } else {
                    Log.e(TAG, "Failed to acknowledge purchase: " + billingResult.getDebugMessage());
                }
            });
        }
    }
    
    @Override
    public void onPurchasesUpdated(@NonNull BillingResult billingResult, List<Purchase> purchases) {
        if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (Purchase purchase : purchases) {
                try {
                    JSONObject purchaseObj = new JSONObject();
                    purchaseObj.put("orderId", purchase.getOrderId());
                    purchaseObj.put("purchaseToken", purchase.getPurchaseToken());
                    purchaseObj.put("productIds", new JSONArray(purchase.getProducts()));
                    purchaseObj.put("purchaseTime", purchase.getPurchaseTime());
                    purchaseObj.put("isAcknowledged", purchase.isAcknowledged());
                    
                    callJavaScript("onPurchaseSuccess", purchaseObj.toString());
                    
                    // 確認購買
                    if (!purchase.isAcknowledged()) {
                        acknowledgePurchase(purchase);
                    }
                } catch (JSONException e) {
                    Log.e(TAG, "Error creating purchase JSON", e);
                }
            }
        } else if (billingResult.getResponseCode() == BillingClient.BillingResponseCode.USER_CANCELED) {
            callJavaScript("onPurchaseCanceled", "{}");
        } else {
            callJavaScript("onPurchaseError", "{\"error\":\"" + billingResult.getDebugMessage() + "\"}");
        }
    }
    
    private void runOnUiThread(Runnable runnable) {
        activity.runOnUiThread(runnable);
    }
    
    private void callJavaScript(String functionName, String data) {
        activity.runOnUiThread(() -> {
            if (webView != null) {
                String script = "javascript:if(typeof window." + functionName + " === 'function') { window." + functionName + "(" + data + "); }";
                webView.evaluateJavascript(script, null);
            } else {
                // 如果沒有 WebView（在 CustomTabs 模式下），通過 URL Scheme 發送消息
                String url = "tradeview://billing?action=" + functionName + "&data=" + 
                             android.net.Uri.encode(data);
                android.content.Intent intent = new android.content.Intent(android.content.Intent.ACTION_VIEW, 
                        android.net.Uri.parse(url));
                intent.setPackage(activity.getPackageName());
                activity.startActivity(intent);
            }
        });
    }
    
    // 處理來自 Web 的請求（通過 URL Scheme）
    public void handleWebRequest(String action, String data) {
        switch (action) {
            case "queryProducts":
                queryProducts();
                break;
            case "launchPurchaseFlow":
                try {
                    JSONObject json = new JSONObject(data);
                    String productId = json.getString("productId");
                    launchPurchaseFlow(productId);
                } catch (JSONException e) {
                    Log.e(TAG, "Error parsing purchase request", e);
                }
                break;
            case "queryPurchases":
                queryPurchases();
                break;
        }
    }
}

