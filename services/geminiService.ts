
import { GoogleGenAI } from "@google/genai";
import { Holding, PortfolioSummary } from '../types';

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    throw new Error("請設定 API Key 以使用 AI 功能。");
  }
  return new GoogleGenAI({ apiKey });
};

export const analyzePortfolio = async (
  holdings: Holding[],
  summary: PortfolioSummary
): Promise<string> => {
  try {
    const ai = getAiClient();

    // Prepare data context - 增加市值與權重資訊，讓 AI 能判斷集中度風險
    const holdingsDesc = holdings.map(h => 
      `- ${h.ticker} (${h.market}): 市值 $${h.currentValue.toLocaleString()} (佔比 ${h.weight.toFixed(1)}%), 成本 $${h.avgCost.toFixed(2)}, 現價 $${h.currentPrice.toFixed(2)}, 帳面損益 ${h.unrealizedPLPercent.toFixed(2)}%`
    ).join('\n');

    const totalAssets = summary.totalValueTWD + summary.cashBalanceTWD;
    const cashWeight = totalAssets > 0 ? (summary.cashBalanceTWD / totalAssets) * 100 : 0;

    const prompt = `
      請擔任我的專業投資顧問 (繁體中文)。
      
      【資產概況】
      - 總資產 (含現金): TWD ${totalAssets.toLocaleString()}
      - 現金部位: TWD ${summary.cashBalanceTWD.toLocaleString()} (佔比 ${cashWeight.toFixed(1)}%)
      - 股票總市值: TWD ${summary.totalValueTWD.toLocaleString()}
      - 總獲利: TWD ${summary.totalPLTWD.toLocaleString()} (總報酬率 ${summary.totalPLPercent.toFixed(2)}%)
      
      【持股明細】
      ${holdingsDesc}

      請根據上述數據提供專業分析 (請使用 Markdown 格式):
      1. **資產配置健診**: 
         - 評估現金水位是否適中？
         - 美股/台股的配置比例看法。
      2. **風險評估 (Risk Assessment)**: 
         - 檢視是否有「單一持股佔比過高」的集中度風險？
         - 產業分佈是否過於集中？
      3. **具體操作建議**: 
         - 針對佔比高且獲利的標的，建議續抱還是調節？
         - 針對虧損標的，給予停損或加碼的建議。
      4. **總結**: 
         - 給予一句簡短的投資心法或調整方向。

      請直接給出建議，語氣專業客觀。
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return response.text || "無法產生分析報告。";
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    return "AI 分析發生錯誤，請檢查 API Key 或稍後再試。";
  }
};

export interface PriceData {
  price: number;
  change: number;
  changePercent: number;
}

export const fetchCurrentPrices = async (tickers: string[]): Promise<{ prices: Record<string, PriceData>, exchangeRate: number }> => {
  try {
    const ai = getAiClient();
    
    // Construct a query for all tickers
    const queryList = tickers.join(', ');
    const prompt = `
      Task:
      1. Find the current live stock price, daily price change amount, and daily percentage change for the following tickers: ${queryList}.
      2. Find the current live exchange rate for 1 USD to TWD.
      
      Rules:
      1. For Taiwan stocks (format TPE:XXXX or just XXXX), find the price in TWD.
      2. For US stocks (format like AAPL, VT), find the price in USD.
      3. Use Google Search to get the latest data.
      4. Return ONLY a JSON object with two keys: "prices" (object) and "exchangeRate" (number).
      5. "prices" keys should be the ticker names as requested (e.g. "TPE:2330" or "AAPL"). Values must be objects with "price" (number), "change" (number), and "changePercent" (number).
      6. Do not output markdown code blocks, just the raw JSON string.
      
      Example output format:
      {
        "prices": {
          "TPE:2330": { "price": 1050, "change": 15.0, "changePercent": 1.45 },
          "AAPL": { "price": 175.5, "change": -1.2, "changePercent": -0.68 }
        },
        "exchangeRate": 32.45
      }
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "{}";
    
    // Clean up markdown if present (```json ... ```)
    const jsonStr = text.replace(/```json|```/g, '').trim();
    
    const result = JSON.parse(jsonStr);
    
    // Normalize prices to PriceData format
    const prices: Record<string, PriceData> = {};
    if (result.prices) {
      Object.entries(result.prices).forEach(([key, val]: [string, any]) => {
        if (typeof val === 'number') {
          // Fallback if AI returns simple number
          prices[key] = { price: val, change: 0, changePercent: 0 };
        } else {
          prices[key] = {
            price: Number(val.price) || 0,
            change: Number(val.change) || 0,
            changePercent: Number(val.changePercent) || 0
          };
        }
      });
    }

    return {
      prices: prices,
      exchangeRate: typeof result.exchangeRate === 'number' ? result.exchangeRate : 0
    };

  } catch (error) {
    console.error("Price Fetch Error:", error);
    throw new Error("無法取得股價，請檢查 API Key 或稍後再試。");
  }
};

