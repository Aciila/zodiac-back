import { Hono } from "hono";
import { cors } from "hono/cors";
import dotenv from "dotenv";
import { AIService } from "./services/ai.js";
import { OctavService } from "./services/octav.js";
import { AstrologyService } from "./services/astrology.js";
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
} from "./utils/extract-info.js";
import { sessionCache } from "./services/session-cache.js";
import { detectLanguage } from "./utils/language-detector.js";

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
      sessionId = "default",
      walletAddress: paramWalletAddress,
    } = body;

    // Detect language from message
    const language = detectLanguage(message);
    console.log(`🌐 Detected language: ${language}`);

    // Get or create session
    let session = sessionCache.get(sessionId);
    if (!session) {
      console.log(`🆕 Creating new session: ${sessionId}`);
      sessionCache.set(sessionId, {
        conversationHistory: [],
        language,
      });
      session = sessionCache.get(sessionId);
    }

    // Update language if changed
    if (session && language !== session.language) {
      sessionCache.set(sessionId, { ...session, language });
    }

    // Add user message to history
    sessionCache.addMessage(sessionId, "user", message);

    // Extract information from current message
    const currentInfo = extractAllInfo(message);

    // Extract information from session history
    const historyInfo = extractFromHistory(session?.conversationHistory || []);

    // Merge information (priority: current message, then session, then history, then parameter)
    const zodiacSignKey =
      currentInfo.zodiacSign || session?.zodiacSign || historyInfo.zodiacSign;
    const birthDate =
      currentInfo.birthDate || session?.birthDate || historyInfo.birthDate;
    // Address priority: 1) from chat 2) parameter 3) from session 4) from history
    const walletAddress =
      currentInfo.walletAddress ||
      paramWalletAddress ||
      session?.walletAddress ||
      historyInfo.walletAddress;

    console.log("📊 Extracted info:", {
      zodiacSignKey,
      birthDate,
      walletAddress,
      language,
    });

    // Update session with new info
    if (zodiacSignKey || birthDate || walletAddress) {
      sessionCache.set(sessionId, {
        zodiacSign: zodiacSignKey,
        birthDate: birthDate,
        walletAddress: walletAddress,
      });
    }

    // Collect all available information
    let zodiacKey: string | null = null;
    let zodiacInfo = null;
    let walletData = null;

    // Determine zodiac sign
    if (birthDate && isValidBirthDate(birthDate)) {
      const normalizedDate = normalizeBirthDate(birthDate);
      zodiacKey = getZodiacSign(normalizedDate);
      zodiacInfo = getZodiacInfo(zodiacKey);
      console.log("✅ Zodiac from birthDate:", zodiacKey, "(normalized:", normalizedDate, ")");
    } else if (zodiacSignKey) {
      zodiacKey = zodiacSignKey;
      zodiacInfo = getZodiacInfo(zodiacKey);
      console.log("✅ Zodiac from sign:", zodiacKey);
    }

    // Get wallet data if address exists
    let walletError: string | null = null;
    if (walletAddress) {
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

    // Get astrology data if zodiac sign is known
    let astrologyData = null;
    if (zodiacKey) {
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
    });

    // Use AI with system prompt for crypto-astrologer
    const tempAiService = new AIService({
      apiKey: process.env.OPENAI_API_KEY || "",
      model: "gpt-3.5-turbo",
      temperature: 0.8, // A bit more creativity for predictions
      max_completion_tokens: 4000, // Increased to ensure AI has enough space for all metrics
      systemPrompt: ZODIAC_PREDICTION_SYSTEM_PROMPT,
    });

    const aiResponse = await tempAiService.chat({
      prompt,
      conversationHistory: session?.conversationHistory || [],
    });

    // Save AI response to session
    sessionCache.addMessage(sessionId, "assistant", aiResponse.response);

    // Extract detailed trading metrics from AI response
    const detailedMetrics = extractDetailedTradingMetrics(aiResponse.response);
    
    // Extract astrology insights sections from AI response
    const astrologyInsights = extractAstrologyInsights(aiResponse.response);

    // Log metrics extraction results
    console.log("📊 Metrics extraction:", {
      detailedTradingProfile: detailedMetrics ? "found" : "NOT FOUND",
      astrologyInsights: astrologyInsights ? `found ${Object.keys(astrologyInsights).length}/4 sections` : "NOT FOUND",
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

    // Remove metrics section from message text (to avoid duplication)
    const cleanMessage = detailedMetrics
      ? removeMetricsFromText(aiResponse.response)
      : aiResponse.response;

    // Build response
    const response: any = {
      success: true,
      message: cleanMessage,
      sessionId: sessionId,
      language: language,
      usage: aiResponse.usage,
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

// Endpoint for getting cache statistics (for debug)
app.get("/api/sessions/stats", (c) => {
  return c.json(sessionCache.getStats());
});

// Endpoint for clearing session
app.delete("/api/sessions/:sessionId", (c) => {
  const sessionId = c.req.param("sessionId");
  sessionCache.delete(sessionId);
  return c.json({
    success: true,
    message: `Session ${sessionId} deleted`,
  });
});

const port = parseInt(process.env.PORT || "3000");

console.log(`🚀 Server is running on http://localhost:${port}`);

serve({
  fetch: app.fetch,
  port: parseInt(port.toString()),
});
