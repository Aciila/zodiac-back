// Direct HTTP calls to Aztro API instead of using buggy aztro-js library

export interface AstrologyData {
  currentWeek: string;
  generalAdvice: string;
  apiData?: {
    mood?: string;
    color?: string;
    lucky_time?: string;
    lucky_number?: string;
    compatibility?: string;
  };
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

      return {
        currentWeek,
        generalAdvice: today.description,
        apiData: {
          mood: today.mood,
          color: today.color,
          lucky_time: today.lucky_time,
          lucky_number: today.lucky_number,
          compatibility: today.compatibility,
        },
      };
    } catch (error) {
      console.error("Error generating weekly astrology data:", error);
      throw error;
    }
  }

}
