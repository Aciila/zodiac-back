# Astrology Insights - Нові секції в API відповіді

## Огляд

AI тепер генерує 4 додаткові секції на основі знаку зодіаку та астрологічних даних:

1. **📊 Overall Market (for your zodiac)** - Загальний огляд ринку
2. **📈 Trading** - Торгові рекомендації
3. **🏦 DeFi** - DeFi можливості
4. **💰 Balances** - Управління балансами

## Як це працює

### 1. AI генерує секції

AI отримує інструкцію в промпті згенерувати ці 4 секції на основі:
- Знаку зодіаку користувача
- Астрологічних подій тижня
- Реального портфоліо користувача

### 2. Парсинг з відповіді

Функція `extractAstrologyInsights()` парсить ці секції з текстової відповіді AI:

```typescript
const astrologyInsights = extractAstrologyInsights(aiResponse.response);
```

### 3. Структура відповіді API

```json
{
  "success": true,
  "message": "...", // Основний текст без секцій
  "tradingProfile": { ... }, // 5 метрик (існуючі)
  "astrologyInsights": {
    "overallMarket": {
      "trend": "Bullish/Bearish/Neutral",
      "zodiacInfluence": "Як знак впливає на сприйняття ринку",
      "recommendation": "Конкретні рекомендації"
    },
    "trading": {
      "bestDays": ["Monday", "Wednesday"],
      "riskLevel": "High/Moderate/Conservative",
      "strategy": "Конкретна торгова стратегія"
    },
    "defi": {
      "favorableProtocols": ["Aave", "Uniswap", "Curve"],
      "yieldStrategy": "Стратегія yield farming",
      "warning": "Попередження на основі знаку"
    },
    "balances": {
      "recommendation": "Рекомендації щодо балансів",
      "rebalanceAdvice": "Як часто ребалансувати",
      "holdVsSell": "Hold vs Sell порада"
    }
  }
}
```

## Приклад використання на фронтенді

```typescript
// Отримати відповідь від API
const response = await fetch('/api/zodiac/predict', {
  method: 'POST',
  body: JSON.stringify({
    message: "Create prediction",
    birthDate: "1990-03-21",
    walletAddress: "0x..."
  })
});

const data = await response.json();

// Використати insights
if (data.astrologyInsights) {
  const { overallMarket, trading, defi, balances } = data.astrologyInsights;
  
  // Показати тренд ринку
  console.log(`Market trend: ${overallMarket?.trend}`);
  
  // Показати кращі дні для торгівлі
  console.log(`Best trading days: ${trading?.bestDays?.join(', ')}`);
  
  // Показати рекомендовані DeFi протоколи
  console.log(`DeFi protocols: ${defi?.favorableProtocols?.join(', ')}`);
  
  // Показати поради щодо балансів
  console.log(`Balance advice: ${balances?.holdVsSell}`);
}
```

## Формат в AI відповіді

AI генерує секції в такому форматі:

```
📊 1. Overall Market (for your zodiac):
- Trend: Bullish
- Zodiac Influence: Your fiery energy aligns with volatile market movements
- Recommendation: Good time to consider strategic entries

📈 2. Trading:
- Best Days: Monday, Wednesday
- Risk Level: High - but channel it wisely
- Strategy: Momentum trading with established cryptos

🏦 3. DeFi:
- Protocols: Aave, Uniswap, Curve
- Yield Strategy: Balanced yield farming approach
- Warning: Watch out for FOMO in new protocols

💰 4. Balances:
- Recommendation: Consider taking some profits on winners
- Rebalance Advice: Weekly rebalancing suits your active nature
- Hold vs Sell: HOLD majority of positions
```

## Переваги

✅ **Персоналізація** - AI сам аналізує знак зодіаку та портфоліо
✅ **Гнучкість** - AI може адаптувати поради під конкретну ситуацію
✅ **Структуровані дані** - Легко використовувати на фронтенді
✅ **Розширюваність** - Легко додати нові поля в майбутньому
