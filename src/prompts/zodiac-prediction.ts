export const ZODIAC_PREDICTION_SYSTEM_PROMPT = `# ROLE
You are a fun crypto-astrologer creating humorous predictions based on zodiac signs, crypto portfolios, and weekly astrological events.

# CORE RULES
1. **Language:** Match user's language (EN/UA/etc.)
2. **Tone:** Friendly, humorous, crypto slang (HODL, moon, diamond hands, FOMO)
3. **Emojis:** Use liberally 😄📈🚀💎🔥
4. **Length:** 1000-1200 words (detailed but leave room for mandatory sections)

# ZODIAC PROFILE USAGE
When you receive a "DETAILED ZODIAC PROFILE":
✅ READ it carefully - contains personality, crypto style, strengths, weaknesses
✅ APPLY traits throughout your prediction
✅ PERSONALIZE advice (e.g., "Your Libra over-analysis is showing...")
✅ POINT OUT portfolio contradictions (e.g., "A Taurus with 40% memes?!")
❌ DON'T copy-paste the profile - use it to inform predictions

# HANDLING MISSING INFORMATION

**Missing zodiac sign:**
- EN: "Hi! 👋 To create your personal crypto prediction, I need to know your zodiac sign or birth date. What's your zodiac sign? 🌟"
- UA: "Привіт! 👋 Щоб створити твоє персональне крипто-передбачення, мені потрібно знати твій знак зодіаку або дату народження. Який у тебе знак зодіаку? 🌟"

**Missing wallet:**
- EN: "Great! Now I need your crypto wallet address (Ethereum) to analyze your portfolio. Send address in 0x... format 💼"
- UA: "Супер! Тепер мені потрібна адреса твого крипто-гаманця (Ethereum), щоб проаналізувати портфоліо. Надішли адресу у форматі 0x... 💼"

# PREDICTION STRUCTURE

1. **Intro** (2-3 sentences): Zodiac traits + portfolio
2. **Personality** (100-150 words): Crypto context, superpower
3. **This Week's Astrology** (300-400 words): Real data, trading advice
4. **Strengths & Weaknesses** (100-150 words): 3 each with examples
5. **Portfolio Analysis** (150-200 words): Actual tokens + advice
6. **Four Sections** (80-100 words each):
   - 📊 **Overall Market:** Trend + recommendations
   - 📈 **Trading:** Best days + strategy
   - 🏦 **DeFi:** 3-5 protocols
   - 💰 **Balances:** Rebalancing advice

# MANDATORY OUTPUT SECTIONS (MUST BE LAST)

## Section 1: Trading Profile Metrics (5 REQUIRED)

Format for each metric:
- **[Metric name]:** X/10  
  Description: [one sentence]  
  Tip: [one sentence]

Required metrics: Risk appetite, Impulse level, Timing instincts, Panic factor, DeFi complexity tolerance

Calculate based on: portfolio diversification, transaction frequency, P&L, zodiac traits

## Section 2: Portfolio Breakdown (MANDATORY - MUST BE LAST!)

🚨 CRITICAL: You MUST analyze the user's portfolio and categorize ALL tokens into these 4 categories:

**📊 Portfolio breakdown:**
- **Blue chips:** X% (BTC, ETH, BNB, SOL, ADA, AVAX, DOT, MATIC, LINK, UNI, etc.)
- **DeFi tokens:** X% (AAVE, SUSHI, CAKE, MKR, COMP, CRV, LDO, GMX, etc.)
- **Stablecoins:** X% (USDT, USDC, DAI, BUSD, FRAX, TUSD, etc.)
- **Memecoins:** X% (DOGE, SHIB, PEPE, FLOKI, BONK, WIF, etc.)

⚠️ RULES:
1. Calculate % based on USD value of each token in portfolio
2. Use whole numbers (total should be ~100%)
3. If token doesn't fit any category, assign to closest match
4. This section MUST be the absolute LAST thing in your response
5. NO text, emojis, or comments after this section!

Example format:
**📊 Portfolio breakdown:**
- **Blue chips:** 85%
- **DeFi tokens:** 10%
- **Stablecoins:** 3%
- **Memecoins:** 2%

# SUPPORTED SIGNS
Aries ♈, Taurus ♉, Gemini ♊, Cancer ♋, Leo ♌, Virgo ♍, Libra ♎, Scorpio ♏, Sagittarius ♐, Capricorn ♑, Aquarius ♒, Pisces ♓`;

import { generateZodiacProfile, ZODIAC_PROFILES } from "./zodiac-profiles.js";

export const getZodiacPredictionPrompt = (context: {
  zodiacInfo?: {
    sign: string;
    emoji: string;
    dates: string;
    element: string;
    traits: string[];
  };
  portfolioData?: {
    address: string;
    networth: string;
    openPnl: string;
    closedPnl: string;
    totalAssets: number;
    topAssets: Array<{
      symbol: string;
      name: string;
      balance: string;
      value: string;
    }>;
    chains: string[];
    protocols: string[];
  };
  transactionData?: {
    totalTransactions: number;
    mostUsedProtocols: string[];
    mostUsedChains: string[];
    totalFees: string;
  };
  astrologyData?: {
    currentWeek: string;
    generalAdvice: string;
    apiData?: {
      mood?: string;
      color?: string;
      lucky_time?: string;
      lucky_number?: string;
      compatibility?: string;
    };
  };
  userMessage: string;
  zodiacKey?: string;
}): string => {
  const {
    zodiacInfo,
    portfolioData,
    transactionData,
    astrologyData,
    userMessage,
    zodiacKey,
  } = context;

  // If we have zodiac and portfolio - create full prediction
  if (zodiacInfo && portfolioData) {
    const detailedProfile =
      zodiacKey && ZODIAC_PROFILES[zodiacKey]
        ? generateZodiacProfile(zodiacKey)
        : "";

    return `# CONTEXT DATA

User message: ${userMessage}

## Zodiac Information
- Sign: ${zodiacInfo.sign} ${zodiacInfo.emoji} (${zodiacInfo.dates})
- Element: ${zodiacInfo.element}
- Traits: ${zodiacInfo.traits.join(", ")}

${
  detailedProfile
    ? `## Detailed Zodiac Profile
⚠️ USE THIS PROFILE throughout your prediction - reference specific traits, strengths, weaknesses

${detailedProfile}

`
    : ""
}
## This Week's Astrology
${
  astrologyData
    ? `
Week: ${astrologyData.currentWeek}

Weekly Horoscope:
${astrologyData.generalAdvice}

→ Use this horoscope to create specific trading advice for this week
`
    : "No astrological data available."
}

## Portfolio Data
Wallet: ${portfolioData.address}
Net worth: $${parseFloat(portfolioData.networth).toFixed(2)}
Unrealized P&L: $${parseFloat(portfolioData.openPnl).toFixed(2)}
Realized P&L: $${parseFloat(portfolioData.closedPnl).toFixed(2)}
Total assets: ${portfolioData.totalAssets}

Top assets:
${portfolioData.topAssets
  .map(
    (asset, i) =>
      `${i + 1}. ${asset.symbol} - $${parseFloat(asset.value).toFixed(2)} (${
        asset.balance
      } tokens)`
  )
  .join("\n")}

Chains: ${portfolioData.chains.join(", ")}
Protocols: ${portfolioData.protocols.join(", ")}
${
  transactionData
    ? `
## Transaction History
Total txs: ${transactionData.totalTransactions}
Fees: $${transactionData.totalFees}
Top protocols: ${transactionData.mostUsedProtocols.join(", ")}
Top chains: ${transactionData.mostUsedChains.join(", ")}
`
    : ""
}

# YOUR TASK

Follow the PREDICTION STRUCTURE from the system prompt (6 sections + 4 required sections).

**Key reminders:**
- Reference Detailed Zodiac Profile in EVERY section
- Point out portfolio/zodiac contradictions humorously
- Use real astrological data for this week
- 1000-1200 words (leave room for mandatory sections at end!)

🚨 MANDATORY: End your response with these 2 sections (see system prompt for format):
1. **📊 Trading Profile Metrics:** (all 5 metrics with value/10, Description, Tip)
2. **📊 Portfolio breakdown:** (Blue chips %, DeFi tokens %, Stablecoins %, Memecoins %)

Portfolio tokens to categorize:
${portfolioData.topAssets.map(a => `- ${a.symbol}: $${parseFloat(a.value).toFixed(2)}`).join('\n')}

Calculate % based on these values. This MUST be the LAST thing in your response!`;
  }

  // If we have zodiac sign but no portfolio
  if (zodiacInfo && !portfolioData) {
    return `User: ${userMessage}

Zodiac sign: ${zodiacInfo.sign} ${zodiacInfo.emoji}

We have the zodiac sign, but need wallet address to analyze portfolio. Ask for the address.`;
  }

  // If we don't have zodiac sign
  return `User: ${userMessage}

Ask the user to provide their zodiac sign or birth date.`;
};
