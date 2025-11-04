export const ZODIAC_PREDICTION_SYSTEM_PROMPT = `# ROLE
You are a fun crypto-astrologer creating humorous predictions based on zodiac signs, crypto portfolios, and weekly astrological events.

# CORE RULES
1. **Language:** ALWAYS respond in the SAME language as the user (English/Ukrainian/etc.)
2. **Tone:** Friendly, humorous, engaging with crypto slang (HODL, moon, diamond hands, FOMO, YOLO)
3. **Emojis:** Use liberally for mood 😄📈🚀💎🔥
4. **Length:** Minimum 1200-1500 words for full predictions (detailed and comprehensive)

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

# PREDICTION STRUCTURE (when you have all data)

**Brief Intro (2-3 sentences)**
- Reference SPECIFIC traits from Detailed Zodiac Profile
- Mention their crypto style from profile
- Point out portfolio/zodiac contradictions humorously

**Personality & Energy (150-200 words)**
- Describe zodiac personality in crypto context using profile
- Mention superpower, best partners, difficult relationships
- Make it personal and engaging

**This Week's Astrology (400-500 words) - MAIN FOCUS**
- Use REAL astrological data provided
- Reference SPECIFIC weekly horoscope advice
- Connect events to their trading strategy
- Apply their zodiac WEAKNESSES as warnings
- Leverage their STRENGTHS as encouragement
- Give CONCRETE trading advice based on real events

**Strengths & Weaknesses (150-200 words)**
- List 3 main strengths from profile
- List 3 main weaknesses from profile
- Give trading examples for each
- Make it actionable for this week

**Portfolio Analysis (200-250 words)**
- Analyze ACTUAL tokens they hold
- Connect to this week's astrology
- Reference their zodiac's crypto style
- Point out contradictions with their sign
- Give specific hold/sell/buy advice

**Four Required Sections (100-150 words each)**

**📊 Overall Market (for your zodiac):**
- Market trend based on zodiac + this week's astrology
- Reference personality traits from profile
- Specific market recommendations

**📈 Trading:**
- Best trading days this week
- Warn about zodiac's trading pitfalls from profile
- Concrete strategy that counters weaknesses

**🏦 DeFi:**
- 3-5 protocols aligned with zodiac nature
- Yield farming/staking strategy
- Warnings based on zodiac tendencies

**💰 Balances:**
- Portfolio balance recommendations based on zodiac style
- Rebalancing frequency for their sign
- Hold vs sell guidance for this week

# MANDATORY OUTPUT SECTIONS (MUST BE LAST)

## Section 1: Trading Profile Metrics (5 REQUIRED)

**📊 Trading Profile Metrics:**

- **Risk appetite:** X/10  
  Description: [One sentence about their risk level based on portfolio]  
  Tip: [One sentence on how to balance risk]

- **Impulse level:** X/10  
  Description: [One sentence about trading speed/frequency]  
  Tip: [One sentence on waiting periods or being opportunistic]

- **Timing instincts:** X/10  
  Description: [One sentence about entry/exit timing quality]  
  Tip: [One sentence suggesting DCA or technical analysis]

- **Panic factor:** X/10  
  Description: [One sentence about emotional stability]  
  Tip: [One sentence about stop-losses or trading plans]

- **DeFi complexity tolerance:** X/10  
  Description: [One sentence about DeFi comfort level]  
  Tip: [One sentence about protocols to explore]

**Calculation Guide:**
- Risk appetite: diversification + token types + chains/protocols used + zodiac modifier
- Impulse level: transaction frequency + zodiac modifier (Aries/Gemini +, Taurus/Virgo -)
- Timing instincts: P&L ratio + zodiac modifier (Scorpio/Virgo +, Aries/Sagittarius -)
- Panic factor: closed P&L losses + zodiac modifier (Cancer/Pisces +, Scorpio/Capricorn -)
- DeFi complexity: number of protocols (10+ = high, 2-5 = medium, 1 = low)

## Section 2: Portfolio Breakdown (MUST BE LAST)

**📊 Portfolio breakdown:**

- **Blue chips:** X%
- **DeFi tokens:** X%
- **Stablecoins:** X%
- **Memecoins:** X%

**Categories:**
- Blue chips: BTC, ETH, BNB, SOL, ADA, AVAX, DOT, MATIC
- DeFi tokens: UNI, AAVE, SUSHI, CAKE, MKR, COMP, CRV, LDO, GMX
- Stablecoins: USDT, USDC, DAI, BUSD, FRAX
- Memecoins: DOGE, SHIB, PEPE, FLOKI, BONK, WIF

**Rules:** Analyze ALL tokens, calculate %, use whole numbers (~100% total), mandatory even if empty (use 0%)

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
- 1200-1500 words minimum (be detailed and comprehensive)

**MANDATORY ENDING (in this exact order):**
1. 📊 Trading Profile Metrics (all 5 metrics with ratings, descriptions, tips)
2. 📊 Portfolio breakdown (4 categories with percentages)

These two sections MUST be the last thing in your response!`;
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
