export interface ZodiacSign {
  sign: string;
  emoji: string;
  dates: string;
  element: string;
  traits: string[];
}

export const ZODIAC_SIGNS: Record<string, ZodiacSign> = {
  aries: {
    sign: "Aries",
    emoji: "♈",
    dates: "March 21 - April 19",
    element: "Fire",
    traits: ["impulsive", "bold", "energetic", "FOMO-prone"],
  },
  taurus: {
    sign: "Taurus",
    emoji: "♉",
    dates: "April 20 - May 20",
    element: "Earth",
    traits: ["stable", "patient", "loves to HODL", "hates volatility"],
  },
  gemini: {
    sign: "Gemini",
    emoji: "♊",
    dates: "May 21 - June 20",
    element: "Air",
    traits: [
      "dual nature",
      "quick",
      "natural trader",
      "buys and sells simultaneously",
    ],
  },
  cancer: {
    sign: "Cancer",
    emoji: "♋",
    dates: "June 21 - July 22",
    element: "Water",
    traits: ["emotional", "cautious", "holds stablecoins", "panics on dips"],
  },
  leo: {
    sign: "Leo",
    emoji: "♌",
    dates: "July 23 - August 22",
    element: "Fire",
    traits: ["leader", "confident", "loves NFTs", "flexes portfolio"],
  },
  virgo: {
    sign: "Virgo",
    emoji: "♍",
    dates: "August 23 - September 22",
    element: "Earth",
    traits: [
      "analytical",
      "perfectionist",
      "reads whitepapers",
      "DCA strategy",
    ],
  },
  libra: {
    sign: "Libra",
    emoji: "♎",
    dates: "September 23 - October 22",
    element: "Air",
    traits: [
      "balanced",
      "diplomatic",
      "analytical",
      "aesthetic-driven",
      "harmony-seeking",
      "slow to enter trades",
      "logical over emotional",
      "prefers reliable tokens",
      "medium risk tolerance",
      "clean portfolio lover",
    ],
  },
  scorpio: {
    sign: "Scorpio",
    emoji: "♏",
    dates: "October 23 - November 21",
    element: "Water",
    traits: [
      "intense",
      "mysterious",
      "cold wallet holder",
      "knows about privacy coins",
    ],
  },
  sagittarius: {
    sign: "Sagittarius",
    emoji: "♐",
    dates: "November 22 - December 21",
    element: "Fire",
    traits: [
      "optimistic",
      "adventurous",
      "invests in all memecoins",
      "to the moon",
    ],
  },
  capricorn: {
    sign: "Capricorn",
    emoji: "♑",
    dates: "December 22 - January 19",
    element: "Earth",
    traits: [
      "disciplined",
      "ambitious",
      "long-term strategy",
      "stakes everything",
    ],
  },
  aquarius: {
    sign: "Aquarius",
    emoji: "♒",
    dates: "January 20 - February 18",
    element: "Air",
    traits: ["innovative", "independent", "early DeFi adopter", "loves Web3"],
  },
  pisces: {
    sign: "Pisces",
    emoji: "♓",
    dates: "February 19 - March 20",
    element: "Water",
    traits: [
      "dreamy",
      "intuitive",
      "buys on emotions",
      "believes in all pumps",
    ],
  },
};

/**
 * Визначає знак зодіаку за датою народження
 */
export function getZodiacSign(birthDate: string): string {
  const date = new Date(birthDate);
  const day = date.getDate();
  const month = date.getMonth() + 1; // JavaScript months are 0-indexed

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21))
    return "scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21))
    return "sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19))
    return "capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18))
    return "aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "pisces";

  return "aries"; // default fallback
}

/**
 * Валідує формат дати народження
 */
export function isValidBirthDate(birthDate: string): boolean {
  const date = new Date(birthDate);
  return !isNaN(date.getTime());
}

/**
 * Нормалізує дату народження - якщо дата в майбутньому, віднімає 100 років
 */
export function normalizeBirthDate(birthDate: string): string {
  const date = new Date(birthDate);
  const now = new Date();

  // Якщо дата в майбутньому, віднімаємо 100 років
  if (date > now) {
    date.setFullYear(date.getFullYear() - 100);
  }

  return date.toISOString().split("T")[0];
}

/**
 * Валідує формат адреси Ethereum гаманця
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Нормалізує назву знаку зодіаку (англійська назва в нижньому регістрі)
 */
export function normalizeZodiacSign(sign: string): string | null {
  const normalized = sign.toLowerCase().trim();

  // Перевірка англійських назв
  if (ZODIAC_SIGNS[normalized]) {
    return normalized;
  }

  // Мапа українських назв на англійські
  const ukrainianToEnglish: Record<string, string> = {
    овен: "aries",
    телець: "taurus",
    близнюки: "gemini",
    рак: "cancer",
    лев: "leo",
    діва: "virgo",
    терези: "libra",
    скорпіон: "scorpio",
    стрілець: "sagittarius",
    козеріг: "capricorn",
    козерог: "capricorn",
    водолій: "aquarius",
    водолей: "aquarius",
    риби: "pisces",
  };

  return ukrainianToEnglish[normalized] || null;
}

/**
 * Gets full information about zodiac sign
 */
export function getZodiacInfo(zodiacKey: string): ZodiacSign | null {
  return ZODIAC_SIGNS[zodiacKey] || null;
}
