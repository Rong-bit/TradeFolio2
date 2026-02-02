// Vercel Serverless Function - 驗證 Google Play 購買憑證
// 此檔案用於驗證來自 Android 端的購買憑證並更新 Supabase

import type { VercelRequest, VercelResponse } from '@vercel/node';

interface PurchaseVerificationRequest {
  purchaseToken: string;
  productId: string;
  orderId: string;
  userEmail: string;
  purchaseType: 'subscription';
  purchaseTime?: number;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 添加 CORS 標頭
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // 處理 OPTIONS 請求（CORS preflight）
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // 只接受 POST 請求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { purchaseToken, productId, orderId, userEmail, purchaseType, purchaseTime } = req.body as PurchaseVerificationRequest;

    // 驗證必要參數
    if (!purchaseToken || !productId || !orderId || !userEmail) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // 驗證產品 ID
    const validProductIds = ['tradeview_monthly', 'tradeview_yearly'];
    if (!validProductIds.includes(productId)) {
      return res.status(400).json({ error: 'Invalid product ID' });
    }

    // 1. 驗證 Google Play 購買憑證
    const verificationResult = await verifyGooglePlayPurchase(
      purchaseToken,
      productId,
      orderId
    );

    if (!verificationResult.isValid) {
      return res.status(400).json({ 
        error: 'Purchase verification failed',
        details: verificationResult.error 
      });
    }

    // 2. 計算訂閱到期時間（如果是訂閱）
    let expiresAt: string | null = null;
    if (purchaseType === 'subscription') {
      if (productId === 'tradeview_monthly') {
        // 月制：從購買時間加 30 天
        const purchaseDate = purchaseTime ? new Date(purchaseTime) : new Date();
        const expiryDate = new Date(purchaseDate);
        expiryDate.setMonth(expiryDate.getMonth() + 1);
        expiresAt = expiryDate.toISOString();
      } else if (productId === 'tradeview_yearly') {
        // 年制：從購買時間加 365 天
        const purchaseDate = purchaseTime ? new Date(purchaseTime) : new Date();
        const expiryDate = new Date(purchaseDate);
        expiryDate.setFullYear(expiryDate.getFullYear() + 1);
        expiresAt = expiryDate.toISOString();
      }
    }

    // 3. 更新 Supabase 資料庫
    await updateSupabasePurchase({
      userEmail,
      productId,
      purchaseToken,
      orderId,
      purchaseType,
      expiresAt,
      purchaseTime: purchaseTime || Date.now(),
    });

    // 4. 回傳成功
    return res.status(200).json({ 
      success: true,
      message: `Purchase verified and user ${userEmail} has been activated`,
      expiresAt,
    });

  } catch (error: any) {
    console.error('Purchase verification error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error?.message || 'Unknown error',
    });
  }
}

// 驗證 Google Play 購買憑證
async function verifyGooglePlayPurchase(
  purchaseToken: string,
  productId: string,
  orderId: string
): Promise<{ isValid: boolean; error?: string }> {
  try {
    // 獲取 Google Service Account 憑證
    const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
    const privateKey = process.env.GOOGLE_PRIVATE_KEY;
    const packageName = process.env.GOOGLE_PACKAGE_NAME || 'com.tradeview.app';

    if (!serviceAccountEmail || !privateKey) {
      // 如果沒有配置 Service Account，在開發模式下允許通過
      if (process.env.NODE_ENV === 'development' || process.env.ALLOW_UNVERIFIED_PURCHASES === 'true') {
        console.warn('⚠️ Google Service Account not configured - Allowing unverified purchase (DEV MODE)');
        return { isValid: true };
      }
      return { isValid: false, error: 'Google Service Account not configured' };
    }

    // 使用 Google Play Developer API 驗證購買
    // 注意：這需要安裝 googleapis 套件
    // npm install googleapis
    try {
      const { google } = await import('googleapis');
      
      // 創建 JWT 客戶端
      const jwtClient = new google.auth.JWT(
        serviceAccountEmail,
        undefined,
        privateKey.replace(/\\n/g, '\n'),
        ['https://www.googleapis.com/auth/androidpublisher'],
        undefined
      );

      await jwtClient.authorize();

      // 創建 Android Publisher API 客戶端
      const androidPublisher = google.androidpublisher({
        version: 'v3',
        auth: jwtClient,
      });

      // 驗證訂閱
      const verificationResult = await androidPublisher.purchases.subscriptions.get({
        packageName,
        subscriptionId: productId,
        token: purchaseToken,
      });

      // 檢查購買狀態
      const purchaseState = verificationResult.data.purchaseState;
      const orderIdFromGoogle = verificationResult.data.orderId;

      if (purchaseState !== 0) { // 0 = Purchased
        return { isValid: false, error: `Purchase state is not valid: ${purchaseState}` };
      }

      if (orderIdFromGoogle !== orderId) {
        return { isValid: false, error: 'Order ID mismatch' };
      }

      return { isValid: true };
    } catch (importError: any) {
      // 如果 googleapis 未安裝，在開發模式下允許通過
      if (process.env.NODE_ENV === 'development' || process.env.ALLOW_UNVERIFIED_PURCHASES === 'true') {
        console.warn('⚠️ googleapis package not installed - Allowing unverified purchase (DEV MODE)');
        return { isValid: true };
      }
      return { isValid: false, error: 'Google Play API client not available' };
    }
  } catch (error: any) {
    console.error('Google Play verification error:', error);
    // 在開發模式下，允許驗證失敗
    if (process.env.NODE_ENV === 'development' || process.env.ALLOW_UNVERIFIED_PURCHASES === 'true') {
      console.warn('⚠️ Verification failed but allowing in DEV MODE');
      return { isValid: true };
    }
    return { isValid: false, error: error?.message || 'Verification failed' };
  }
}

// 更新 Supabase 購買記錄
async function updateSupabasePurchase(data: {
  userEmail: string;
  productId: string;
  purchaseToken: string;
  orderId: string;
  purchaseType: 'subscription';
  expiresAt: string | null;
  purchaseTime: number;
}) {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    console.warn('Supabase configuration missing - Purchase record not saved');
    return;
  }

  try {
    // 插入或更新購買記錄
    const response = await fetch(
      `${supabaseUrl}/rest/v1/purchases`,
      {
        method: 'POST',
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
          'Content-Type': 'application/json',
          'Prefer': 'resolution=merge-duplicates', // 如果已存在則更新
        },
        body: JSON.stringify({
          user_email: data.userEmail,
          product_id: data.productId,
          purchase_token: data.purchaseToken,
          order_id: data.orderId,
          purchase_type: data.purchaseType,
          expires_at: data.expiresAt,
          is_active: true,
          created_at: new Date(data.purchaseTime).toISOString(),
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Failed to update Supabase: ${error}`);
    }

    // 同時更新 authorized_users 表（如果存在）
    try {
      await fetch(
        `${supabaseUrl}/rest/v1/authorized_users`,
        {
          method: 'POST',
          headers: {
            'apikey': supabaseServiceKey,
            'Authorization': `Bearer ${supabaseServiceKey}`,
            'Content-Type': 'application/json',
            'Prefer': 'resolution=merge-duplicates',
          },
          body: JSON.stringify({
            email: data.userEmail,
            payment_status: 'paid',
            payment_date: new Date().toISOString(),
            payment_amount: data.productId === 'tradeview_monthly' ? 60 : 590,
            payment_trade_no: data.orderId,
            created_at: new Date().toISOString(),
          }),
        }
      );
    } catch (error) {
      // 如果 authorized_users 表不存在或更新失敗，只記錄警告
      console.warn('Failed to update authorized_users table:', error);
    }

    console.log(`Purchase record updated for ${data.userEmail}`);
  } catch (error: any) {
    console.error('Failed to update Supabase purchase record:', error);
    throw error;
  }
}

