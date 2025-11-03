import {
  normalizeZodiacSign,
  isValidBirthDate,
  getZodiacSign,
} from "./zodiac.js";

export interface ExtractedInfo {
  zodiacSign?: string;
  birthDate?: string;
  walletAddress?: string;
}

export interface MetricDetail {
  value: number; // 1-10 for radar chart
  description: string; // One sentence description
  tip: string; // One sentence personalized tip
}

export interface DetailedTradingMetrics {
  riskAppetite: MetricDetail;
  impulseLevel: MetricDetail;
  timingInstincts: MetricDetail;
  panicFactor: MetricDetail;
  defiComplexityTolerance: MetricDetail;
}

// Legacy types for backward compatibility
export interface TradingMetrics {
  riskAppetite: number;
  impulseLevel: number;
  timingInstincts: number;
  panicFactor: number;
  defiComplexityTolerance: number;
}

export interface CryptoPersonalityMetrics {
  fomoResistance: number;
  diamondHandsStrength: number;
  degenScore: number;
  multiChainAdventurer: number;
  memeCoinAttraction: number;
  researchDepth: number;
}

export interface AllMetrics {
  tradingProfile: TradingMetrics | null;
  cryptoPersonality: CryptoPersonalityMetrics | null;
}

/**
 * Extracts zodiac sign from text
 */
export function extractZodiacSign(text: string): string | null {
  const lowerText = text.toLowerCase();

  // Ukrainian and English zodiac sign names
  const zodiacPatterns = [
    "овен",
    "aries",
    "телець",
    "taurus",
    "близнюки",
    "gemini",
    "рак",
    "cancer",
    "лев",
    "leo",
    "діва",
    "virgo",
    "терези",
    "libra",
    "скорпіон",
    "scorpio",
    "стрілець",
    "sagittarius",
    "козеріг",
    "козерог",
    "capricorn",
    "водолій",
    "водолей",
    "aquarius",
    "риби",
    "pisces",
  ];

  for (const pattern of zodiacPatterns) {
    if (lowerText.includes(pattern)) {
      return normalizeZodiacSign(pattern);
    }
  }

  return null;
}

/**
 * Extracts birth date from text
 */
export function extractBirthDate(text: string): string | null {
  // Try text-based dates first (e.g., "October 29, 2025", "29 October 2025", "born on August 10")
  const textDatePatterns = [
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2}),?\s+(\d{4})\b/i,
    /\b(\d{1,2})\s+(january|february|march|april|may|june|july|august|september|october|november|december),?\s+(\d{4})\b/i,
    /\b(january|february|march|april|may|june|july|august|september|october|november|december)\s+(\d{1,2})\b/i,
  ];

  for (const pattern of textDatePatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        // Parse the date using JavaScript Date
        const dateStr = match[0];
        const parsedDate = new Date(dateStr);
        
        if (!isNaN(parsedDate.getTime())) {
          const year = parsedDate.getFullYear();
          const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
          const day = String(parsedDate.getDate()).padStart(2, '0');
          const formattedDate = `${year}-${month}-${day}`;
          
          if (isValidBirthDate(formattedDate)) {
            return formattedDate;
          }
        }
      } catch (e) {
        // Continue to next pattern
      }
    }
  }

  // Formats: YYYY-MM-DD, DD.MM.YYYY, DD/MM/YYYY
  const datePatterns = [
    /\b(\d{4})-(\d{2})-(\d{2})\b/, // 1990-05-15
    /\b(\d{2})\.(\d{2})\.(\d{4})\b/, // 15.05.1990
    /\b(\d{2})\/(\d{2})\/(\d{4})\b/, // 15/05/1990
  ];

  for (const pattern of datePatterns) {
    const match = text.match(pattern);
    if (match) {
      let year, month, day;

      if (pattern.source.startsWith("\\b(\\d{4})")) {
        // YYYY-MM-DD
        [, year, month, day] = match;
      } else {
        // DD.MM.YYYY or DD/MM/YYYY
        [, day, month, year] = match;
      }

      const dateStr = `${year}-${month}-${day}`;
      if (isValidBirthDate(dateStr)) {
        return dateStr;
      }
    }
  }

  return null;
}

/**
 * Extracts Ethereum wallet address from text
 */
export function extractWalletAddress(text: string): string | null {
  // Ethereum address: 0x + 40 hex characters
  const addressPattern = /\b(0x[a-fA-F0-9]{40})\b/;
  const match = text.match(addressPattern);

  return match ? match[1] : null;
}

/**
 * Extracts all available information from text
 */
export function extractAllInfo(text: string): ExtractedInfo {
  return {
    zodiacSign: extractZodiacSign(text) || undefined,
    birthDate: extractBirthDate(text) || undefined,
    walletAddress: extractWalletAddress(text) || undefined,
  };
}

/**
 * Extracts information from entire conversation history
 */
export function extractFromHistory(
  conversationHistory: Array<{ role: string; content: string }>
): ExtractedInfo {
  const allText = conversationHistory
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.content)
    .join(" ");

  return extractAllInfo(allText);
}

/**
 * Extracts trading metrics from AI response
 * Looks for format: **Risk appetite:** Medium (6/10)
 */
export function extractTradingMetrics(text: string): TradingMetrics | null {
  const metrics: Partial<TradingMetrics> = {};

  // Patterns for extracting metrics (more flexible - with or without asterisks, colon optional)
  const patterns = {
    riskAppetite: /(?:\*\*)?Risk appetite:?(?:\*\*)?[^(\n]*\((\d+)(?:\/10)?\)/i,
    impulseLevel: /(?:\*\*)?Impulse level:?(?:\*\*)?[^(\n]*\((\d+)(?:\/10)?\)/i,
    timingInstincts:
      /(?:\*\*)?Timing instincts:?(?:\*\*)?[^(\n]*\((\d+)(?:\/10)?\)/i,
    panicFactor: /(?:\*\*)?Panic factor:?(?:\*\*)?[^(\n]*\((\d+)(?:\/10)?\)/i,
    defiComplexityTolerance:
      /(?:\*\*)?DeFi complexity tolerance:?(?:\*\*)?[^(\n]*\((\d+)(?:\/10)?\)/i,
  };

  // Extract each metric
  for (const [key, pattern] of Object.entries(patterns)) {
    const match = text.match(pattern);
    if (match && match[1]) {
      const value = parseInt(match[1], 10);
      if (value >= 1 && value <= 10) {
        metrics[key as keyof TradingMetrics] = value;
      }
    }
  }

  // Log what we found
  const foundCount = Object.keys(metrics).length;
  if (foundCount > 0 && foundCount < 5) {
    console.log(
      "⚠️ Trading metrics partially found:",
      foundCount,
      "/5",
      Object.keys(metrics)
    );
  }

  // Return only if we found all 5 metrics
  if (foundCount === 5) {
    return metrics as TradingMetrics;
  }

  return null;
}

/**
 * Extracts crypto personality metrics from AI response
 * Looks for format: **FOMO resistance:** High (7/10)
 */
export function extractCryptoPersonalityMetrics(
  text: string
): CryptoPersonalityMetrics | null {
  // This function is kept for backward compatibility but is no longer used
  // We now only use trading profile metrics
  return null;
}

/**
 * Extracts all metrics (trading profile + crypto personality) from AI response
 */
export function extractAllMetrics(text: string): AllMetrics {
  return {
    tradingProfile: extractTradingMetrics(text),
    cryptoPersonality: extractCryptoPersonalityMetrics(text),
  };
}

/**
 * Extracts detailed trading metrics with descriptions and tips from AI response
 * Format: **Risk appetite:** 6/10
 *   - Description: ...
 *   - Tip: ...
 */
export function extractDetailedTradingMetrics(
  text: string
): DetailedTradingMetrics | null {
  const metrics: Partial<DetailedTradingMetrics> = {};

  const metricNames = [
    "riskAppetite",
    "impulseLevel",
    "timingInstincts",
    "panicFactor",
    "defiComplexityTolerance",
  ] as const;

  const metricPatterns: Record<string, string> = {
    riskAppetite: "Risk appetite",
    impulseLevel: "Impulse level",
    timingInstincts: "Timing instincts",
    panicFactor: "Panic factor",
    defiComplexityTolerance: "DeFi complexity tolerance",
  };

  for (const metricKey of metricNames) {
    const metricName = metricPatterns[metricKey];
    // Pattern supports multiple formats:
    // **Risk appetite:** 6/10
    //   - Description: ... OR
    //   - **Description:** ...
    //   - Tip: ... OR
    //   - **Tip:** ...
    
    // Try multiple patterns
    const patterns = [
      // Pattern 1: with ** around Description/Tip
      new RegExp(
        `\\*\\*${metricName}:\\*\\*\\s*(\\d+)/10[^\\n]*\\n` +
          `\\s+-\\s+\\*\\*Description:\\*\\*\\s*([^\\n]+?)\\n` +
          `\\s+-\\s+\\*\\*Tip:\\*\\*\\s*(.+?)(?=\\n\\n|\\n-|\\n\\*\\*|$)`,
        "is"
      ),
      // Pattern 2: without ** around Description/Tip
      new RegExp(
        `\\*\\*${metricName}:\\*\\*\\s*(\\d+)/10[^\\n]*\\n` +
          `\\s+-\\s+Description:\\s*([^\\n]+?)\\n` +
          `\\s+-\\s+Tip:\\s*(.+?)(?=\\n\\n|\\n-|\\n\\*\\*|$)`,
        "is"
      ),
    ];

    let match = null;
    for (const pattern of patterns) {
      match = text.match(pattern);
      if (match) break;
    }

    if (match) {
      const value = parseInt(match[1], 10);
      const description = match[2].trim();
      const tip = match[3].trim();

      if (value >= 1 && value <= 10 && description && tip) {
        metrics[metricKey] = {
          value,
          description,
          tip,
        };
        console.log(`✅ Extracted ${metricName}: ${value}/10`);
      }
    } else {
      // Debug: log what we're looking for vs what we found
      console.log(`⚠️ Could not match metric: ${metricName}`);
      // Try to find the metric line to see what format AI used
      const debugPattern = new RegExp(`\\*\\*${metricName}:\\*\\*[^\\n]*`, "i");
      const debugMatch = text.match(debugPattern);
      if (debugMatch) {
        console.log(`Found metric line: ${debugMatch[0]}`);
        // Also show next few lines
        const contextPattern = new RegExp(
          `\\*\\*${metricName}:\\*\\*[\\s\\S]{0,250}`,
          "i"
        );
        const contextMatch = text.match(contextPattern);
        if (contextMatch) {
          console.log(`Context:\n${contextMatch[0]}`);
        }
      }
    }
  }

  // Return only if we found all 5 metrics
  if (Object.keys(metrics).length === 5) {
    return metrics as DetailedTradingMetrics;
  }

  console.warn(
    "⚠️ Detailed trading metrics partially found:",
    Object.keys(metrics).length,
    "/5",
    Object.keys(metrics)
  );
  return null;
}

/**
 * Removes the metrics section from the AI response text
 * This prevents duplication since metrics are returned as a separate object
 */
export function removeMetricsFromText(text: string): string {
  // Remove everything from "Trading Profile Metrics:" onwards
  const metricsPattern = /\*\*📊\s*Trading Profile Metrics:\*\*[\s\S]*$/i;
  return text.replace(metricsPattern, "").trim();
}
