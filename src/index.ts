import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { AIService } from "./services/ai.js";
import { OctavService } from "./services/octav.js";
import { AstrologyService } from "./services/astrology.js";
import { DatabaseService } from "./services/database.js";
import {
  getZodiacSign,
  isValidBirthDate,
  normalizeBirthDate,
  isValidEthereumAddress,
  normalizeZodiacSign,
  getZodiacInfo,
  ZODIAC_SIGNS,
} from "./utils/zodiac.js";
import {
  ZODIAC_PREDICTION_SYSTEM_PROMPT,
  getZodiacPredictionPrompt,
} from "./prompts/zodiac-prediction.js";
import { serve } from "@hono/node-server";
import {
  extractAllInfo,
  extractFromHistory,
  extractAllMetrics,
  extractDetailedTradingMetrics,
  extractAstrologyInsights,
  removeMetricsFromText,
  extractPortfolioBreakdown,
} from "./utils/extract-info.js";
import { detectLanguage } from "./utils/language-detector.js";
import { calculateTimeUntilNextHoroscope } from "./utils/time-calculator.js";

dotenv.config();

const app = new Hono();

// Initialize AI service with initial knowledge
const aiService = new AIService({
  apiKey: process.env.OPENAI_API_KEY || "",
  model: "gpt-3.5-turbo",
  temperature: 0.7,
  max_completion_tokens: 4000,
  systemPrompt: `You are a helpful AI assistant for the Zodiac project.
You help users with their requests and always respond clearly and understandably.
If you don't know the answer, you honestly say so.`,
});

// Initialize Octav service
const octavService = new OctavService();

// Initialize Astrology service
const astrologyService = new AstrologyService();

// Initialize Database service
const dbService = new DatabaseService();

// Connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/zodiac";
dbService.connect(MONGO_URI).catch((error) => {
  console.error("Failed to connect to MongoDB:", error);
  process.exit(1);
});

// Enable CORS
app.use("/*", cors());

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    status: "ok",
    message: "Zodiac AI Backend is running",
  });
});

// AI prompt endpoint
app.post("/api/chat", async (c) => {
  try {
    const body = await c.req.json();
    const { prompt, conversationHistory } = body;

    if (!prompt) {
      return c.json({ error: "Prompt is required" }, 400);
    }

    // Use AI service
    const result = await aiService.chat({
      prompt,
      conversationHistory,
    });

    return c.json({
      success: true,
      prompt,
      response: result.response,
      model: result.model,
      usage: result.usage,
    });
  } catch (error: any) {
    console.error("Error processing AI request:", error);
    return c.json(
      {
        error: "Failed to process AI request",
        details: error.message,
      },
      500
    );
  }
});

// Endpoint for updating system prompt
app.post("/api/config/system-prompt", async (c) => {
  try {
    const body = await c.req.json();
    const { systemPrompt } = body;

    if (!systemPrompt) {
      return c.json({ error: "System prompt is required" }, 400);
    }

    aiService.setSystemPrompt(systemPrompt);

    return c.json({
      success: true,
      message: "System prompt updated",
      systemPrompt: aiService.getSystemPrompt(),
    });
  } catch (error: any) {
    console.error("Error updating system prompt:", error);
    return c.json(
      {
        error: "Failed to update system prompt",
        details: error.message,
      },
      500
    );
  }
});

// Endpoint for getting current system prompt
app.get("/api/config/system-prompt", (c) => {
  return c.json({
    systemPrompt: aiService.getSystemPrompt(),
  });
});

// New endpoint for crypto-zodiac predictions with dialog support
app.post("/api/zodiac-prediction", async (c) => {
  try {
    const body = await c.req.json();
    const {
      message = "",
      walletAddress: paramWalletAddress,
      birthDate: paramBirthDate,
      zodiacSign: paramZodiacSign,
    } = body;

    // Detect language from message
    const language = detectLanguage(message);
    console.log(`🌐 Detected language: ${language}`);

    // Extract information from current message
    const currentInfo = extractAllInfo(message);

    // Priority: 1) параметри 2) з повідомлення 3) з БД
    let walletAddress: string | undefined =
      paramWalletAddress || currentInfo.walletAddress;
    let birthDate: string | undefined = paramBirthDate || currentInfo.birthDate;
    let zodiacSignKey: string | undefined =
      paramZodiacSign || currentInfo.zodiacSign;

    // Якщо є адреса гаманця та дата народження, спробуємо отримати дані з БД
    let user = null;
    if (walletAddress && birthDate) {
      const birthDateObj = new Date(birthDate);
      user = await dbService.getUserByWallet(walletAddress, birthDateObj);
      if (user) {
        console.log(
          `✅ Found user in DB: ${walletAddress} (birthDate: ${birthDate})`
        );
        // Якщо в БД є дані, використовуємо їх як fallback
        if (!zodiacSignKey && user.zodiacSign) {
          zodiacSignKey = user.zodiacSign;
        }
      }
    }

    console.log("📊 Final extracted info:", {
      zodiacSignKey,
      birthDate,
      walletAddress,
      language,
    });

    // Collect all available information
    let zodiacKey: string | null = null;
    let zodiacInfo = null;
    let walletData = null;

    // Determine zodiac sign
    if (birthDate && isValidBirthDate(birthDate)) {
      const normalizedDate = normalizeBirthDate(birthDate);
      zodiacKey = getZodiacSign(normalizedDate);
      zodiacInfo = getZodiacInfo(zodiacKey);
      console.log(
        "✅ Zodiac from birthDate:",
        zodiacKey,
        "(normalized:",
        normalizedDate,
        ")"
      );
    } else if (zodiacSignKey) {
      zodiacKey = zodiacSignKey;
      zodiacInfo = getZodiacInfo(zodiacKey);
      console.log("✅ Zodiac from sign:", zodiacKey);
    }

    // Get wallet data if address exists
    let walletError: string | null = null;
    if (walletAddress && walletAddress !== null) {
      try {
        console.log("🔍 Fetching wallet data for:", walletAddress);
        walletData = await octavService.getWalletAnalysis(walletAddress);
        console.log("✅ Wallet data fetched successfully");
      } catch (error: any) {
        console.warn("⚠️ Could not fetch wallet data:", error.message);

        // Determine error type
        if (error.message === "UNSUPPORTED_NETWORK") {
          walletError = "UNSUPPORTED_NETWORK";
        } else if (error.message === "ADDRESS_NOT_FOUND") {
          walletError = "ADDRESS_NOT_FOUND";
        } else {
          walletError = "UNKNOWN_ERROR";
        }
        // Continue without wallet data - AI will receive error information
      }
    }

    // Перевірка чи є збережений предикшн для поточного тижня
    let cachedPrediction = null;
    if (walletAddress && zodiacKey) {
      const birthDateObj = birthDate ? new Date(birthDate) : undefined;
      cachedPrediction = await dbService.getPredictionForCurrentWeek(
        walletAddress,
        birthDateObj
      );
      if (cachedPrediction) {
        console.log(
          `✅ Found cached prediction for ${walletAddress} ${
            birthDate ? `(birthDate: ${birthDate})` : ""
          }`
        );

        // Повертаємо кешований предикшн
        const detailedMetrics = extractDetailedTradingMetrics(
          cachedPrediction.prediction
        );
        const astrologyInsights = extractAstrologyInsights(
          cachedPrediction.prediction
        );
        const portfolioBreakdown = extractPortfolioBreakdown(
          cachedPrediction.prediction
        );
        const cleanMessage = removeMetricsFromText(cachedPrediction.prediction);

        // Розраховуємо час до нового гороскопу
        const timeUntilNextHoroscope = calculateTimeUntilNextHoroscope(
          cachedPrediction.weekEnd
        );

        return c.json({
          success: true,
          message: cleanMessage,
          cached: true,
          language: language,
          timeUntilNextHoroscope,
          extractedInfo: {
            zodiacSign: zodiacKey,
            birthDate: birthDate,
            walletAddress: walletAddress,
          },
          tradingProfile: detailedMetrics || undefined,
          astrologyInsights: astrologyInsights || undefined,
          portfolioBreakdown: portfolioBreakdown || undefined,
          zodiac: zodiacInfo || undefined,
        });
      }
    }

    // Get astrology data if zodiac sign is known
    let astrologyData = null;
    if (zodiacKey && zodiacKey !== null) {
      try {
        console.log("🔮 Fetching astrology data for:", zodiacKey);
        astrologyData = await astrologyService.getWeeklyAstrologyData(
          zodiacKey
        );
        console.log(astrologyData);
        console.log("✅ Astrology data fetched successfully");
      } catch (error: any) {
        console.warn("⚠️ Could not fetch astrology data:", error.message);
        // Continue without astrology data
      }
    }

    // Build prompt based on available information
    let userMessage = message || "Create a crypto prediction for me";

    // Add error information to message if any
    if (walletAddress && walletError) {
      if (walletError === "UNSUPPORTED_NETWORK") {
        userMessage += `\n\n[SYSTEM NOTE: User provided wallet address ${walletAddress}, but this network is not supported by Octav.fi. Please inform the user that only EVM networks and some other networks are supported. Ask them to check if the address is correct or try a different address.]`;
      } else if (walletError === "ADDRESS_NOT_FOUND") {
        userMessage += `\n\n[SYSTEM NOTE: Wallet address ${walletAddress} was not found or has no data. Inform the user about this.]`;
      } else {
        userMessage += `\n\n[SYSTEM NOTE: Could not fetch wallet data for ${walletAddress}. Something went wrong. Please inform the user.]`;
      }
    }

    const prompt = getZodiacPredictionPrompt({
      zodiacInfo: zodiacInfo || undefined,
      portfolioData: walletData?.portfolio,
      transactionData: walletData?.transactions,
      astrologyData: astrologyData || undefined,
      userMessage,
      zodiacKey: zodiacKey || undefined,
    });

    // Use AI with system prompt for crypto-astrologer
    const tempAiService = new AIService({
      apiKey: process.env.OPENAI_API_KEY || "",
      model: "gpt-4o-mini", // Better model for following complex instructions
      temperature: 0.8, // A bit more creativity for predictions
      max_completion_tokens: 6000, // Increased to ensure AI has enough space for detailed predictions
      systemPrompt: ZODIAC_PREDICTION_SYSTEM_PROMPT,
    });

    const aiResponse = await tempAiService.chat({
      prompt,
      conversationHistory: [], // Без історії, кожен запит незалежний
    });

    // Зберегти користувача та предикшн в БД
    let savedPrediction = null;
    if (walletAddress && zodiacKey) {
      const birthDateObj = birthDate ? new Date(birthDate) : undefined;

      // Зберегти/оновити користувача
      await dbService.getOrCreateUser(walletAddress, birthDateObj, zodiacKey);

      // Зберегти предикшн
      savedPrediction = await dbService.savePrediction(
        walletAddress,
        aiResponse.response,
        zodiacKey,
        walletData
          ? {
              networth: walletData.portfolio.networth,
              totalAssets: walletData.portfolio.totalAssets,
              topAssets: walletData.portfolio.topAssets
                .slice(0, 5)
                .map((a) => ({
                  symbol: a.symbol,
                  value: a.value,
                })),
            }
          : undefined,
        birthDateObj
      );
    }

    // Extract detailed trading metrics from AI response
    const detailedMetrics = extractDetailedTradingMetrics(aiResponse.response);

    // Extract astrology insights sections from AI response
    const astrologyInsights = extractAstrologyInsights(aiResponse.response);

    // Extract portfolio breakdown from AI response
    const portfolioBreakdown = extractPortfolioBreakdown(aiResponse.response);

    // Log metrics extraction results
    console.log("📊 Metrics extraction:", {
      detailedTradingProfile: detailedMetrics ? "found" : "NOT FOUND",
      astrologyInsights: astrologyInsights
        ? `found ${Object.keys(astrologyInsights).length}/4 sections`
        : "NOT FOUND",
      portfolioBreakdown: portfolioBreakdown ? "found" : "NOT FOUND",
    });

    // If metrics not found, log AI response for debugging
    if (!detailedMetrics) {
      console.warn(
        "⚠️ Detailed metrics missing! AI response length:",
        aiResponse.response.length
      );
      console.log(
        "AI response preview:",
        aiResponse.response.substring(aiResponse.response.length - 500)
      );
    }

    // ALWAYS remove metrics section from message text (to avoid duplication)
    // Even if parsing failed, we still want to remove the metrics text
    const cleanMessage = removeMetricsFromText(aiResponse.response);

    // Calculate time until next horoscope if prediction was saved
    const timeUntilNextHoroscope = savedPrediction
      ? calculateTimeUntilNextHoroscope(savedPrediction.weekEnd)
      : undefined;

    // Build response
    const response: any = {
      success: true,
      message: cleanMessage,
      cached: false,
      language: language,
      usage: aiResponse.usage,
      timeUntilNextHoroscope,
      // Add extracted information for context preservation
      extractedInfo: {
        zodiacSign: zodiacKey,
        birthDate: birthDate,
        walletAddress: walletAddress,
      },
    };

    // Add detailed metrics if extracted
    if (detailedMetrics) {
      response.tradingProfile = detailedMetrics;
    }

    // Add astrology insights if extracted
    if (astrologyInsights) {
      response.astrologyInsights = astrologyInsights;
    }

    // Add portfolio breakdown if extracted
    if (portfolioBreakdown) {
      response.portfolioBreakdown = portfolioBreakdown;
    }

    // Add additional data if available
    if (zodiacInfo) {
      response.zodiac = zodiacInfo;
    }

    if (walletData) {
      response.wallet = {
        address: walletData.portfolio.address,
        networth: walletData.portfolio.networth,
        totalAssets: walletData.portfolio.totalAssets,
        topAssets: walletData.portfolio.topAssets.slice(0, 5),
      };
    }

    if (astrologyData) {
      response.astrology = astrologyData;
    }

    console.log("✅ Response prepared successfully");
    return c.json(response);
  } catch (error: any) {
    console.error("Error generating zodiac prediction:", error);
    return c.json(
      {
        error: "Failed to generate prediction",
        details: error.message,
      },
      500
    );
  }
});

// Endpoint for getting list of all zodiac signs
app.get("/api/zodiac-signs", (c) => {
  return c.json({
    signs: Object.entries(ZODIAC_SIGNS).map(([key, info]) => ({
      key,
      ...info,
    })),
  });
});

// Endpoint for cleaning up old predictions
app.post("/api/cleanup", async (c) => {
  try {
    await dbService.cleanupOldPredictions();
    return c.json({
      success: true,
      message: "Old predictions cleaned up successfully",
    });
  } catch (error: any) {
    return c.json(
      {
        error: "Failed to cleanup predictions",
        details: error.message,
      },
      500
    );
  }
});

const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: parseInt(port.toString()),
});
