/**
 * Universal Zodiac Profiles - Detailed content for all zodiac signs
 * This provides comprehensive information about each zodiac sign in crypto context
 */

export interface ZodiacProfile {
  personality: {
    description: string;
    bestPartners: string[];
    difficultWith: string[];
    superpower: string;
    cryptoStyle: string;
    warning: string;
  };
  financialProfile: {
    characteristics: string[];
  };
  strengths: {
    points: string[];
  };
  weaknesses: {
    points: string[];
  };
}

export const ZODIAC_PROFILES: Record<string, ZodiacProfile> = {
  libra: {
    personality: {
      description: "Your sign is one of the most refined and intelligent. Libra can see beauty in details, find harmony in chaos, and bring a sense of balance to the world. Your strength is the ability to negotiate, analyze, and see both sides of any situation. You love aesthetics, value fairness, and always strive for the perfect balance between business and emotions.",
      bestPartners: ["Gemini", "Aquarius", "Leo"],
      difficultWith: ["Capricorn", "Cancer"],
      superpower: "Charm, logic, and taste — together it's magic that no one can replicate.",
      cryptoStyle: "Libra is about the beauty of balance. You're a peacemaker and diplomat of the crypto world. You know how to listen to both sides — growth and decline — before making a decision. You have a desire for aesthetics, order, and justice, which is reflected even in your choice of tokens and DeFi strategies.",
      warning: "Be careful: striving for the perfect moment, you might hold onto an idea too long, miss an entry, or fail to exit on time. Your strength is in the ability to analyze and see the game beyond just candlestick charts.",
    },
    financialProfile: {
      characteristics: [
        "You enter trades slowly but don't exit emotionally",
        "You prefer reliable tokens and medium risk",
        "You rarely enter 'on hype', more often by logic and calculations",
        "You keep a clean portfolio: you love clear tokens and transparent strategies",
        "Libras aren't meme fans, but may hold them in portfolio 'just for fun'",
      ],
    },
    strengths: {
      points: [
        "**Logic > Emotions:** You can think even when the market is burning",
        "**Smart Risk:** You enter alts when there's real data",
        "**Beautiful Portfolio:** You likely have order in your allocation",
      ],
    },
    weaknesses: {
      points: [
        "Over-analysis → missing profits",
        "Doubts when you need to move quickly",
        "Sometimes hard to say 'no' — even to a shitcoin",
      ],
    },
  },
  
  aries: {
    personality: {
      description: "You're a born leader and pioneer. Aries never waits — you act first, think later. Your energy is explosive, your confidence is unshakeable, and your FOMO is legendary. You're the first to jump into new projects and the last to admit a mistake.",
      bestPartners: ["Leo", "Sagittarius", "Gemini"],
      difficultWith: ["Cancer", "Capricorn"],
      superpower: "Speed, courage, and the ability to turn any dip into 'buying opportunity'.",
      cryptoStyle: "Aries is the ultimate degen trader. You see a green candle, you buy. You see a red candle, you buy more. Risk management? Never heard of it. But somehow, you often come out on top because you're fearless.",
      warning: "Your impulsiveness can lead to buying tops and panic selling bottoms. Learn to pause before clicking 'buy'.",
    },
    financialProfile: {
      characteristics: [
        "You enter trades on impulse and emotion",
        "You love high-risk, high-reward plays",
        "You're always chasing the next 100x",
        "Your portfolio is a rollercoaster",
        "Meme coins are your guilty pleasure",
      ],
    },
    strengths: {
      points: [
        "**Fearless:** You take risks others won't",
        "**Quick:** You catch opportunities fast",
        "**Optimistic:** You never give up on your bags",
      ],
    },
    weaknesses: {
      points: [
        "FOMO is your middle name",
        "You buy tops more than you'd like to admit",
        "Patience is not your virtue",
      ],
    },
  },

  taurus: {
    personality: {
      description: "You're the ultimate HODLer. Taurus doesn't chase pumps — you build wealth slowly and steadily. Your patience is legendary, your conviction unshakeable. Once you believe in a project, you're in it for the long haul, through bear markets and FUD.",
      bestPartners: ["Virgo", "Capricorn", "Cancer"],
      difficultWith: ["Leo", "Aquarius"],
      superpower: "Diamond hands that could outlast any bear market. You don't panic sell — ever.",
      cryptoStyle: "Taurus is the Warren Buffett of crypto. You research thoroughly, buy quality assets, and hold. Volatility doesn't scare you because you think in years, not days. Your portfolio is your garden — you nurture it patiently.",
      warning: "Your stubbornness can make you hold losing positions too long. Sometimes it's okay to cut losses and move on.",
    },
    financialProfile: {
      characteristics: [
        "You prefer blue-chip cryptocurrencies over meme coins",
        "DCA (Dollar Cost Averaging) is your religion",
        "You hate volatility but tolerate it for long-term gains",
        "Staking and passive income are your favorites",
        "You rarely check prices — you're in it for years",
      ],
    },
    strengths: {
      points: [
        "**Diamond Hands:** You never panic sell",
        "**Patient:** You can wait years for your thesis to play out",
        "**Stable:** Your emotions don't control your trades",
      ],
    },
    weaknesses: {
      points: [
        "Too stubborn to admit when you're wrong",
        "Miss quick opportunities because you move slowly",
        "Can be overly conservative and miss high-growth plays",
      ],
    },
  },

  gemini: {
    personality: {
      description: "You're the chameleon of crypto. Gemini can trade anything, anytime, anywhere. Your mind moves at lightning speed, processing information from ten different sources simultaneously. You're equally comfortable with DeFi, NFTs, meme coins, and serious projects.",
      bestPartners: ["Libra", "Aquarius", "Aries"],
      difficultWith: ["Virgo", "Pisces"],
      superpower: "Adaptability and information processing. You can pivot strategies faster than anyone.",
      cryptoStyle: "Gemini is the day trader extraordinaire. You're in five different Discord servers, following twenty Twitter accounts, and have alerts for every market move. You can be bullish and bearish at the same time — and somehow make money on both sides.",
      warning: "Your scattered attention can lead to overtrading and analysis paralysis. Focus is your challenge.",
    },
    financialProfile: {
      characteristics: [
        "You trade frequently — sometimes too frequently",
        "Your portfolio changes weekly",
        "You love trying new protocols and platforms",
        "You can argue both bull and bear cases convincingly",
        "Information is your edge — you're always researching",
      ],
    },
    strengths: {
      points: [
        "**Quick Thinker:** You process information faster than others",
        "**Versatile:** You can trade any market condition",
        "**Connected:** Your network gives you alpha",
      ],
    },
    weaknesses: {
      points: [
        "Overtrading eats into your profits",
        "You change your mind too often",
        "FOMO on every new trend",
      ],
    },
  },

  cancer: {
    personality: {
      description: "You're the emotional investor. Cancer feels the market deeply — every pump brings joy, every dump brings anxiety. But beneath that emotional surface lies a shrewd investor who knows when to protect capital. You're cautious, protective, and deeply intuitive.",
      bestPartners: ["Scorpio", "Pisces", "Taurus"],
      difficultWith: ["Aries", "Libra"],
      superpower: "Intuition and emotional intelligence. You can sense market sentiment shifts before they happen.",
      cryptoStyle: "Cancer is the cautious accumulator. You prefer stablecoins and established projects. Risk terrifies you, but you're smart enough to take calculated risks when your intuition says so. You're the first to move to stables when things feel off.",
      warning: "Your emotions can override logic. Fear can make you sell bottoms, and euphoria can make you buy tops.",
    },
    financialProfile: {
      characteristics: [
        "You keep a large portion in stablecoins for safety",
        "You panic during dips but often buy them anyway",
        "You prefer established projects over new launches",
        "You check your portfolio too often",
        "Security is your top priority — you use hardware wallets",
      ],
    },
    strengths: {
      points: [
        "**Intuitive:** Your gut feelings are often right",
        "**Protective:** You preserve capital well",
        "**Cautious:** You avoid obvious scams and rugs",
      ],
    },
    weaknesses: {
      points: [
        "Emotional trading leads to bad timing",
        "Fear prevents you from taking good opportunities",
        "You stress too much about portfolio performance",
      ],
    },
  },

  leo: {
    personality: {
      description: "You're the king of crypto. Leo doesn't just invest — you make statements. Your portfolio is a reflection of your personality: bold, confident, and impossible to ignore. You love projects that have prestige, strong communities, and make you look smart.",
      bestPartners: ["Aries", "Sagittarius", "Libra"],
      difficultWith: ["Taurus", "Scorpio"],
      superpower: "Confidence and charisma. You can convince others (and yourself) of any investment thesis.",
      cryptoStyle: "Leo is the NFT collector and blue-chip maximalist. You want the best, the biggest, the most prestigious. You'll flex your portfolio on Twitter and in Discord. You're not just investing — you're building a legacy.",
      warning: "Your ego can cloud judgment. Not every investment needs to be flashy or impressive.",
    },
    financialProfile: {
      characteristics: [
        "You love NFTs and high-profile projects",
        "You prefer being early on projects that will be famous",
        "You'll pay premium for quality and prestige",
        "You share your wins publicly (and hide your losses)",
        "Community and social proof matter to you",
      ],
    },
    strengths: {
      points: [
        "**Confident:** You make bold moves that pay off",
        "**Leader:** You spot trends before they go mainstream",
        "**Loyal:** You support your projects through thick and thin",
      ],
    },
    weaknesses: {
      points: [
        "Ego prevents you from admitting mistakes",
        "You overpay for hype and prestige",
        "Pride keeps you in losing positions too long",
      ],
    },
  },

  virgo: {
    personality: {
      description: "You're the analyst. Virgo doesn't invest without research — deep, thorough, obsessive research. You read whitepapers, analyze tokenomics, check team backgrounds, and still feel like you haven't done enough. Your standards are impossibly high.",
      bestPartners: ["Taurus", "Capricorn", "Cancer"],
      difficultWith: ["Gemini", "Sagittarius"],
      superpower: "Analysis and attention to detail. You spot red flags others miss.",
      cryptoStyle: "Virgo is the fundamental analyst. You have spreadsheets for everything. You know the exact tokenomics of every project you hold. You DCA religiously and rebalance on schedule. Your portfolio is optimized to perfection.",
      warning: "Perfectionism leads to analysis paralysis. Sometimes 'good enough' is better than 'perfect but too late'.",
    },
    financialProfile: {
      characteristics: [
        "You read every whitepaper cover to cover",
        "DCA and rebalancing are scheduled in your calendar",
        "You track every metric in detailed spreadsheets",
        "You prefer fundamentally sound projects",
        "You're skeptical of hype and marketing",
      ],
    },
    strengths: {
      points: [
        "**Analytical:** Your research is unmatched",
        "**Disciplined:** You stick to your strategy",
        "**Risk-Aware:** You understand what you're investing in",
      ],
    },
    weaknesses: {
      points: [
        "Analysis paralysis makes you miss opportunities",
        "Perfectionism prevents you from taking action",
        "You're too critical and skeptical sometimes",
      ],
    },
  },

  scorpio: {
    personality: {
      description: "You're the crypto detective. Scorpio sees what others miss. You're intense, secretive, and strategic. You don't share your moves, you don't follow the crowd, and you definitely don't trust easily. Your research goes deeper than anyone else's.",
      bestPartners: ["Cancer", "Pisces", "Capricorn"],
      difficultWith: ["Leo", "Aquarius"],
      superpower: "Intuition and investigative skills. You uncover hidden gems and avoid scams.",
      cryptoStyle: "Scorpio is the privacy maximalist and deep researcher. You use cold wallets, VPNs, and never share your holdings. You find projects months before they trend. You're comfortable with complexity — privacy coins, advanced DeFi, layer 2s.",
      warning: "Your paranoia can be excessive. Not everything is a conspiracy, and not everyone is out to get you.",
    },
    financialProfile: {
      characteristics: [
        "You hold privacy coins and use cold storage",
        "You never share your portfolio size or holdings",
        "You do your own research — deeply",
        "You're comfortable with complex DeFi strategies",
        "You trust your intuition over market sentiment",
      ],
    },
    strengths: {
      points: [
        "**Investigative:** You find hidden opportunities",
        "**Strategic:** You plan moves carefully",
        "**Resilient:** You handle volatility without flinching",
      ],
    },
    weaknesses: {
      points: [
        "Paranoia can prevent good opportunities",
        "You're too secretive and miss community insights",
        "Trust issues make collaboration difficult",
      ],
    },
  },

  sagittarius: {
    personality: {
      description: "You're the eternal optimist. Sagittarius sees opportunity everywhere. You're adventurous, philosophical, and always ready to bet on the next big thing. Bear markets don't scare you — they're just buying opportunities. You believe in crypto's mission.",
      bestPartners: ["Aries", "Leo", "Aquarius"],
      difficultWith: ["Virgo", "Pisces"],
      superpower: "Optimism and vision. You see the big picture when others panic.",
      cryptoStyle: "Sagittarius is the moonshot hunter. You're in every new L1, every promising DeFi protocol, every meme coin with a good story. You believe in the technology and the revolution. Your portfolio is diverse, risky, and full of conviction plays.",
      warning: "Your optimism can blind you to risks. Not every project will go to the moon.",
    },
    financialProfile: {
      characteristics: [
        "You invest in moonshots and high-risk plays",
        "You believe in crypto's revolutionary potential",
        "You're comfortable with extreme volatility",
        "You explore new chains and protocols fearlessly",
        "You HODL through bear markets with conviction",
      ],
    },
    strengths: {
      points: [
        "**Optimistic:** You stay bullish when others panic",
        "**Adventurous:** You find opportunities in new frontiers",
        "**Visionary:** You understand crypto's long-term potential",
      ],
    },
    weaknesses: {
      points: [
        "Excessive optimism leads to ignoring red flags",
        "You take too many risks simultaneously",
        "You don't cut losses because you 'believe'",
      ],
    },
  },

  capricorn: {
    personality: {
      description: "You're the institutional investor. Capricorn approaches crypto like a business. You have goals, timelines, and strategies. You're disciplined, ambitious, and patient. You're building generational wealth, not chasing quick flips.",
      bestPartners: ["Taurus", "Virgo", "Scorpio"],
      difficultWith: ["Aries", "Cancer"],
      superpower: "Discipline and long-term thinking. You build wealth systematically.",
      cryptoStyle: "Capricorn is the strategic accumulator. You have a 5-year plan. You stake everything for passive income. You rebalance quarterly. You treat crypto like a serious investment, not a casino. Your portfolio is built to last.",
      warning: "Your rigidity can make you miss opportunities. Sometimes you need to adapt faster.",
    },
    financialProfile: {
      characteristics: [
        "You have a detailed investment plan with timelines",
        "Staking and yield farming are core strategies",
        "You prefer established projects with proven track records",
        "You rebalance on a strict schedule",
        "You think in years, not days or weeks",
      ],
    },
    strengths: {
      points: [
        "**Disciplined:** You stick to your plan no matter what",
        "**Strategic:** Every move is calculated",
        "**Patient:** You can wait years for returns",
      ],
    },
    weaknesses: {
      points: [
        "Too rigid — you miss opportunities outside your plan",
        "Conservative approach limits upside potential",
        "You're slow to adapt to market changes",
      ],
    },
  },

  aquarius: {
    personality: {
      description: "You're the true believer. Aquarius doesn't just invest in crypto — you believe in the revolution. You're innovative, independent, and ahead of your time. You were into DeFi before it was cool. You understand the technology because you care about changing the world.",
      bestPartners: ["Gemini", "Libra", "Sagittarius"],
      difficultWith: ["Taurus", "Scorpio"],
      superpower: "Innovation and vision. You spot paradigm shifts before they happen.",
      cryptoStyle: "Aquarius is the DeFi native and Web3 pioneer. You were early to Ethereum, early to DeFi, early to NFTs. You don't follow trends — you create them. You care about decentralization, not just profits. Your portfolio reflects your values.",
      warning: "Your idealism can override pragmatism. Not every decentralized project will succeed.",
    },
    financialProfile: {
      characteristics: [
        "You were early to DeFi and still exploring new protocols",
        "You care about decentralization and technology",
        "You invest in projects aligned with your values",
        "You're comfortable with experimental and cutting-edge tech",
        "Community and governance matter to you",
      ],
    },
    strengths: {
      points: [
        "**Innovative:** You're always ahead of trends",
        "**Independent:** You think for yourself",
        "**Visionary:** You understand where crypto is going",
      ],
    },
    weaknesses: {
      points: [
        "Idealism can blind you to practical concerns",
        "You invest in tech over fundamentals sometimes",
        "You're contrarian even when the crowd is right",
      ],
    },
  },

  pisces: {
    personality: {
      description: "You're the dreamer. Pisces invests with heart and intuition. You feel the market, you believe in stories, and you're drawn to projects with soul. You're empathetic, creative, and sometimes too trusting. Your portfolio is a reflection of your dreams.",
      bestPartners: ["Cancer", "Scorpio", "Taurus"],
      difficultWith: ["Gemini", "Sagittarius"],
      superpower: "Intuition and emotional intelligence. You sense market vibes others miss.",
      cryptoStyle: "Pisces is the intuitive investor. You buy projects that resonate with you emotionally. You believe in communities and narratives. You're drawn to art, NFTs, and projects with meaning. Your decisions are guided by feeling as much as analysis.",
      warning: "Your emotions and trust can be exploited. Not every good story is a good investment.",
    },
    financialProfile: {
      characteristics: [
        "You invest in projects that resonate emotionally",
        "NFTs and art projects attract you",
        "You trust your intuition over data sometimes",
        "You're drawn to community-driven projects",
        "You believe in narratives and stories",
      ],
    },
    strengths: {
      points: [
        "**Intuitive:** Your gut feelings can be surprisingly accurate",
        "**Creative:** You see value in unconventional places",
        "**Empathetic:** You understand community sentiment",
      ],
    },
    weaknesses: {
      points: [
        "Too trusting — you fall for scams and rugs",
        "Emotions override logic too often",
        "You hold losing positions because you 'believe'",
      ],
    },
  },
};

/**
 * Generates a comprehensive zodiac profile text for any sign
 */
export function generateZodiacProfile(zodiacKey: string): string {
  const profile = ZODIAC_PROFILES[zodiacKey];
  if (!profile) {
    return "";
  }

  return `### 🧬 Personality and Energy

${profile.personality.description}

**Best Partners:** ${profile.personality.bestPartners.join(", ")}
**Not Always Easy With:** ${profile.personality.difficultWith.join(", ")}
**Your Superpower:** ${profile.personality.superpower}

**Crypto Style:**
${profile.personality.cryptoStyle}

**⚠️ Warning:**
${profile.personality.warning}

### 💰 Financial and Trading Profile

${profile.financialProfile.characteristics.map(c => `- ${c}`).join("\n")}

### 🎯 Strengths in Crypto

${profile.strengths.points.map(p => `- ${p}`).join("\n")}

### ⚠️ Weaknesses

${profile.weaknesses.points.map(p => `- ${p}`).join("\n")}`;
}

/**
 * Get zodiac-specific trading advice based on wallet data
 */
export function getZodiacWalletAdvice(
  zodiacKey: string,
  walletData: {
    memeCoinsPercentage?: number;
    diversificationScore?: number;
    topAssets?: string[];
  }
): string {
  const { memeCoinsPercentage = 0, diversificationScore = 5 } = walletData;
  const advice: string[] = [];

  // Zodiac-specific advice logic
  switch (zodiacKey) {
    case "aries":
      if (memeCoinsPercentage > 30) {
        advice.push("🔥 Over 30% in memes? Classic Aries move! But maybe save some for blue chips?");
      }
      if (diversificationScore < 3) {
        advice.push("⚡ You're going all-in on a few bets. Bold, but consider spreading the risk.");
      }
      advice.push("🚀 Weekly tip: Take a breath before your next YOLO. Just one breath.");
      break;

    case "taurus":
      if (memeCoinsPercentage > 5) {
        advice.push("🐂 Meme coins? That's not very Taurus of you. Stick to your blue-chip strategy.");
      }
      if (diversificationScore > 3) {
        advice.push("💎 Good diversification, but remember — you're a HODLer, not a trader.");
      }
      advice.push("🌱 Weekly tip: Your patience is your superpower. Keep DCA-ing and staking.");
      break;

    case "gemini":
      if (diversificationScore > 10) {
        advice.push("🦋 You're in too many things at once. Even for a Gemini, this is excessive.");
      }
      advice.push("💡 Weekly tip: Pick your top 5 convictions and focus. You're spreading yourself too thin.");
      break;

    case "cancer":
      if (memeCoinsPercentage < 50) {
        advice.push("🦀 Good job keeping stables high! Your cautious nature is protecting you.");
      }
      advice.push("🌊 Weekly tip: Trust your intuition, but don't let fear paralyze you.");
      break;

    case "leo":
      if (memeCoinsPercentage > 20) {
        advice.push("🦁 Your portfolio is as bold as you are. Just make sure it's not all for show.");
      }
      advice.push("👑 Weekly tip: Prestige is good, but profits are better. Don't let ego drive decisions.");
      break;

    case "virgo":
      if (diversificationScore > 7) {
        advice.push("📊 Your portfolio is perfectly balanced. Classic Virgo precision.");
      }
      advice.push("🔬 Weekly tip: Your research is excellent, but don't let perfectionism cause paralysis.");
      break;

    case "libra":
      if (memeCoinsPercentage > 15) {
        advice.push("⚠️ Your meme coin allocation exceeds 15% — not very Libra-like. Time to rebalance towards BTC/ETH or stables.");
      } else if (memeCoinsPercentage > 0 && memeCoinsPercentage <= 10) {
        advice.push("✅ Meme allocation is within normal range — you're balancing risk and stability.");
      }
      if (diversificationScore < 4) {
        advice.push("💡 Your portfolio is too concentrated. Libras love harmony — add 2-3 reliable tokens for balance.");
      } else if (diversificationScore > 8) {
        advice.push("🎯 Excellent diversification! Your portfolio looks like a work of art — exactly what Libras love.");
      }
      advice.push("🌟 Weekly tip: Update your token list, drop the excess, keep only what resonates with your strategy.");
      break;

    case "scorpio":
      advice.push("🦂 Your secretive nature serves you well. Keep researching deeply.");
      advice.push("🔍 Weekly tip: Your paranoia protects you, but don't miss opportunities because of it.");
      break;

    case "sagittarius":
      if (memeCoinsPercentage > 25) {
        advice.push("🏹 Your optimism is showing in your meme allocation. Moonshots are great, but so is stability.");
      }
      advice.push("🎯 Weekly tip: Not every project will 100x. Take some profits when you can.");
      break;

    case "capricorn":
      if (diversificationScore > 5) {
        advice.push("🐐 Your disciplined approach is evident. Your portfolio is built to last.");
      }
      advice.push("⏰ Weekly tip: Your long-term vision is your strength. Stay the course.");
      break;

    case "aquarius":
      advice.push("🌊 Your innovative portfolio reflects your values. Keep exploring new frontiers.");
      advice.push("💫 Weekly tip: Being early is great, but make sure the tech has real use cases.");
      break;

    case "pisces":
      if (memeCoinsPercentage > 20) {
        advice.push("🐟 Your emotional connection to projects is showing. Make sure you're not just believing stories.");
      }
      advice.push("🌙 Weekly tip: Your intuition is valuable, but verify it with research.");
      break;

    default:
      advice.push("📊 Your portfolio reflects your zodiac's unique approach to crypto.");
  }

  return advice.join("\n\n");
}
