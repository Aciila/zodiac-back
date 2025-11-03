// Direct HTTP calls to Aztro API instead of using buggy aztro-js library

export interface AstrologyData {
  currentWeek: string;
  weeklyEvents: Array<{
    event: string;
    description: string;
    tradingAdvice: string;
  }>;
  generalAdvice: string;
}

export interface AztroHoroscope {
  date_range: string;
  current_date: string;
  description: string;
  compatibility: string;
  mood: string;
  color: string;
  lucky_number: string;
  lucky_time: string;
}

export class AstrologyService {
  private readonly HOROSCOPE_API = "https://horoscope-app-api.vercel.app/api/v1/get-horoscope";

  constructor() {
    // No initialization needed for direct HTTP calls
  }


  /**
   * Виконує запит до альтернативного Horoscope API
   */
  private async fetchFromHoroscopeAPI(
    sign: string,
    day: "today" | "tomorrow" | "yesterday"
  ): Promise<AztroHoroscope | null> {
    try {
      const dayMap = { today: "daily", tomorrow: "daily", yesterday: "daily" };
      const response = await fetch(
        `${this.HOROSCOPE_API}/${dayMap[day]}?sign=${sign.toLowerCase()}&day=${day === "today" ? "TODAY" : day === "tomorrow" ? "TOMORROW" : "YESTERDAY"}`
      );

      if (!response.ok) {
        console.error(`Horoscope API error for ${sign} ${day}: ${response.status}`);
        return null;
      }

      const result = await response.json() as any;
      if (result && result.data) {
        // Конвертуємо формат в AztroHoroscope
        return {
          date_range: result.data.date || "",
          current_date: new Date().toISOString().split("T")[0],
          description: result.data.horoscope_data || "",
          compatibility: "",
          mood: "",
          color: "",
          lucky_number: "",
          lucky_time: "",
        };
      }

      return null;
    } catch (error) {
      console.error(`Failed to fetch ${day} horoscope from Horoscope API:`, error);
      return null;
    }
  }


  /**
   * Отримує гороскоп з Horoscope API
   */
  private async fetchHoroscope(
    sign: string,
    day: "today" | "tomorrow" | "yesterday"
  ): Promise<AztroHoroscope | null> {
    const result = await this.fetchFromHoroscopeAPI(sign, day);
    if (result) {
      console.log(`✅ Got ${day} horoscope from Horoscope API`);
      return result;
    }

    console.error(`❌ Horoscope API failed for ${sign} ${day}`);
    return null;
  }

  /**
   * Отримує гороскоп з Aztro API
   */
  async getDailyHoroscope(sign: string): Promise<AztroHoroscope | null> {
    return this.fetchHoroscope(sign, "today");
  }

  /**
   * Отримує гороскоп на завтра
   */
  async getTomorrowHoroscope(sign: string): Promise<AztroHoroscope | null> {
    return this.fetchHoroscope(sign, "tomorrow");
  }

  /**
   * Отримує гороскоп на вчора
   */
  async getYesterdayHoroscope(sign: string): Promise<AztroHoroscope | null> {
    return this.fetchHoroscope(sign, "yesterday");
  }

  /**
   * Отримує всі гороскопи (вчора, сьогодні, завтра)
   */
  async getAllHoroscopes(sign: string): Promise<{
    today: AztroHoroscope | null;
    tomorrow: AztroHoroscope | null;
    yesterday: AztroHoroscope | null;
  }> {
    // Використовуємо окремі виклики замість getAllHoroscope, який має баги
    const [today, tomorrow, yesterday] = await Promise.all([
      this.getDailyHoroscope(sign),
      this.getTomorrowHoroscope(sign),
      this.getYesterdayHoroscope(sign),
    ]);

    return {
      today,
      tomorrow,
      yesterday,
    };
  }

  /**
   * Генерує тижневі астрологічні дані на основі API
   */
  async getWeeklyAstrologyData(sign: string): Promise<AstrologyData> {
    try {
      // Отримуємо всі гороскопи з API
      const horoscopes = await this.getAllHoroscopes(sign);
      const { today, tomorrow, yesterday } = horoscopes;

      // Якщо API недоступний, кидаємо помилку
      if (!today) {
        throw new Error("Failed to fetch horoscope from API");
      }

      // Формуємо поточний тиждень
      const now = new Date();
      const dayOfWeek = now.getDay();
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek + 1);
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);

      const formatDate = (date: Date) => {
        return date.toLocaleDateString("en-US", {
          day: "numeric",
          month: "long",
        });
      };

      console.log(today, tomorrow, yesterday);

      const currentWeek = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;

      // Генеруємо події на основі API даних
      const weeklyEvents = this.generateWeeklyEventsFromAPI(
        today,
        tomorrow,
        yesterday
      );

      return {
        currentWeek,
        weeklyEvents,
        generalAdvice: today.description,
      };
    } catch (error) {
      console.error("Error generating weekly astrology data:", error);
      throw error;
    }
  }

  /**
   * Генерує тижневі події на основі API даних
   */
  private generateWeeklyEventsFromAPI(
    today: AztroHoroscope,
    tomorrow: AztroHoroscope | null,
    yesterday: AztroHoroscope | null
  ): Array<{ event: string; description: string; tradingAdvice: string }> {
    const events = [];

    // 1. Основна подія тижня - з сьогоднішнього гороскопу
    const weeklyMood = today.mood ? `${today.mood} Energy` : "Weekly Energy";
    events.push({
      event: `${weeklyMood} Week`,
      description:
        today.description || "Focus on your trading strategy this week",
      tradingAdvice: this.generateEventTradingAdvice(today.mood, today.color),
    });

    // 2. Lucky Time Event - з API
    if (today.lucky_time) {
      events.push({
        event: "Peak Trading Hours",
        description: `Your optimal trading window: ${today.lucky_time}`,
        tradingAdvice: `Schedule important trades and portfolio decisions during ${today.lucky_time} for best results`,
      });
    }

    // 3. Compatibility Event - з API
    if (today.compatibility) {
      events.push({
        event: "Cosmic Compatibility",
        description: `This week you're in harmony with ${today.compatibility} energy`,
        tradingAdvice: `Consider collaborating or following insights from ${today.compatibility} traders in your network`,
      });
    }

    // 4. Завтрашній тренд - якщо є дані
    if (tomorrow && tomorrow.mood) {
      events.push({
        event: "Tomorrow's Trend",
        description: `Tomorrow's mood: ${tomorrow.mood}`,
        tradingAdvice: this.generateTomorrowAdvice(tomorrow.mood),
      });
    }

    return events;
  }

  /**
   * Генерує trading advice на основі mood та color з API
   */
  private generateEventTradingAdvice(mood: string, color: string): string {
    if (!mood || !color) {
      return "Maintain balanced approach - stay disciplined with your trading strategy";
    }

    const moodLower = mood.toLowerCase();

    // Positive moods
    if (
      moodLower.includes("happy") ||
      moodLower.includes("joyful") ||
      moodLower.includes("relaxed")
    ) {
      return `Your ${mood.toLowerCase()} energy supports confident decisions - good time for calculated risks in established cryptos. Lucky color: ${color}`;
    }

    // Cautious moods
    if (
      moodLower.includes("stressed") ||
      moodLower.includes("anxious") ||
      moodLower.includes("tense")
    ) {
      return "High stress detected - stick to stablecoins, avoid impulsive trades, focus on capital preservation";
    }

    // Neutral/balanced
    return `${mood} energy this week - maintain your current strategy and stay disciplined. Focus on ${color.toLowerCase()} chip projects`;
  }

  /**
   * Генерує пораду на завтра
   */
  private generateTomorrowAdvice(mood: string): string {
    if (!mood) {
      return "Tomorrow brings new opportunities - stay prepared and flexible";
    }

    const moodLower = mood.toLowerCase();

    if (moodLower.includes("happy") || moodLower.includes("joyful")) {
      return "Prepare for positive momentum tomorrow - research opportunities today";
    }
    if (moodLower.includes("stressed") || moodLower.includes("anxious")) {
      return "Tomorrow may be volatile - set stop-losses and secure profits today";
    }
    return "Tomorrow brings balanced energy - stay flexible and ready to adapt";
  }

}
