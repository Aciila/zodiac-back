/**
 * Detect language from text
 */

export type Language = 'en' | 'uk' | 'ru';

export function detectLanguage(text: string): Language {
  const lowerText = text.toLowerCase();

  // Ukrainian patterns
  const ukrainianPatterns = [
    /[їієґ]/,
    /\b(я|ти|він|вона|ми|ви|вони)\b/,
    /\b(хочу|можу|треба|потрібно|передбачення)\b/,
    /\b(привіт|добрий|день|ранок|вечір)\b/,
  ];

  // Russian patterns
  const russianPatterns = [
    /[ыэъ]/,
    /\b(я|ты|он|она|мы|вы|они)\b/,
    /\b(хочу|могу|нужно|предсказание)\b/,
    /\b(привет|добрый|день|утро|вечер)\b/,
  ];

  // Check Ukrainian
  let ukrainianScore = 0;
  for (const pattern of ukrainianPatterns) {
    if (pattern.test(lowerText)) {
      ukrainianScore++;
    }
  }

  // Check Russian
  let russianScore = 0;
  for (const pattern of russianPatterns) {
    if (pattern.test(lowerText)) {
      russianScore++;
    }
  }

  // Decide based on scores
  if (ukrainianScore > russianScore && ukrainianScore > 0) {
    return 'uk';
  }
  
  if (russianScore > ukrainianScore && russianScore > 0) {
    return 'ru';
  }

  // Default to English
  return 'en';
}

export function getLanguageName(lang: Language): string {
  const names = {
    en: 'English',
    uk: 'українською',
    ru: 'русском',
  };
  return names[lang];
}
