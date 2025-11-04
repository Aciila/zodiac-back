import mongoose from 'mongoose';
import { User, IUser } from '../models/User.js';
import { Prediction, IPrediction } from '../models/Prediction.js';

export class DatabaseService {
  private isConnected = false;

  /**
   * Підключення до MongoDB
   */
  async connect(mongoUri: string): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await mongoose.connect(mongoUri);
      this.isConnected = true;
      console.log('✅ Connected to MongoDB');
    } catch (error) {
      console.error('❌ MongoDB connection error:', error);
      throw error;
    }
  }

  /**
   * Отримати або створити користувача
   * Унікальність визначається комбінацією walletAddress + birthDate
   */
  async getOrCreateUser(walletAddress: string, birthDate?: Date, zodiacSign?: string): Promise<IUser> {
    const normalizedAddress = walletAddress.toLowerCase();
    
    // Шукаємо користувача по walletAddress + birthDate
    const query: any = { walletAddress: normalizedAddress };
    if (birthDate) {
      query.birthDate = birthDate;
    } else {
      query.birthDate = { $exists: false };
    }
    
    let user = await User.findOne(query);
    
    if (!user) {
      user = await User.create({
        walletAddress: normalizedAddress,
        birthDate,
        zodiacSign,
      });
      console.log(`✅ Created new user: ${normalizedAddress} ${birthDate ? `(birthDate: ${birthDate.toISOString().split('T')[0]})` : ''}`);
    } else if (zodiacSign && user.zodiacSign !== zodiacSign) {
      // Оновлюємо zodiacSign якщо змінився
      user.zodiacSign = zodiacSign;
      await user.save();
      console.log(`✅ Updated user zodiacSign: ${normalizedAddress}`);
    }
    
    return user;
  }

  /**
   * Отримати користувача по адресі гаманця та даті народження
   */
  async getUserByWallet(walletAddress: string, birthDate?: Date): Promise<IUser | null> {
    const query: any = { walletAddress: walletAddress.toLowerCase() };
    if (birthDate) {
      query.birthDate = birthDate;
    } else {
      query.birthDate = { $exists: false };
    }
    return User.findOne(query);
  }

  /**
   * Отримати поточний тиждень (понеділок 00:00 UTC)
   */
  private getCurrentWeekStart(): Date {
    const now = new Date();
    const dayOfWeek = now.getUTCDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // Якщо неділя (0), то -6, інакше 1 - dayOfWeek
    const weekStart = new Date(now);
    weekStart.setUTCDate(now.getUTCDate() + diff);
    weekStart.setUTCHours(0, 0, 0, 0);
    return weekStart;
  }

  /**
   * Отримати кінець тижня (неділя 23:59:59 UTC)
   */
  private getWeekEnd(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setUTCDate(weekStart.getUTCDate() + 6);
    weekEnd.setUTCHours(23, 59, 59, 999);
    return weekEnd;
  }

  /**
   * Отримати предикшн для поточного тижня
   */
  async getPredictionForCurrentWeek(walletAddress: string, birthDate?: Date): Promise<IPrediction | null> {
    const weekStart = this.getCurrentWeekStart();
    const normalizedAddress = walletAddress.toLowerCase();
    
    const query: any = {
      walletAddress: normalizedAddress,
      weekStart: weekStart,
    };
    
    // Додаємо birthDate до запиту якщо він є
    if (birthDate) {
      query.birthDate = birthDate;
    } else {
      // Якщо birthDate не передано, шукаємо предикшн без birthDate
      query.birthDate = { $exists: false };
    }
    
    return Prediction.findOne(query);
  }

  /**
   * Зберегти новий предикшн
   */
  async savePrediction(
    walletAddress: string,
    prediction: string,
    zodiacSign: string,
    portfolioSnapshot?: any,
    birthDate?: Date
  ): Promise<IPrediction> {
    const weekStart = this.getCurrentWeekStart();
    const weekEnd = this.getWeekEnd(weekStart);
    const normalizedAddress = walletAddress.toLowerCase();

    // Видаляємо старий предикшн для цього тижня (якщо є)
    const deleteQuery: any = {
      walletAddress: normalizedAddress,
      weekStart: weekStart,
    };
    
    if (birthDate) {
      deleteQuery.birthDate = birthDate;
    } else {
      deleteQuery.birthDate = { $exists: false };
    }
    
    await Prediction.deleteOne(deleteQuery);

    // Створюємо новий
    const newPrediction = await Prediction.create({
      walletAddress: normalizedAddress,
      birthDate: birthDate || undefined,
      weekStart,
      weekEnd,
      prediction,
      zodiacSign,
      portfolioSnapshot,
    });

    console.log(`✅ Saved prediction for ${normalizedAddress} ${birthDate ? `(birthDate: ${birthDate.toISOString().split('T')[0]})` : ''} (week: ${weekStart.toISOString()})`);
    return newPrediction;
  }

  /**
   * Видалити старі предикшни (старіші за 2 тижні)
   */
  async cleanupOldPredictions(): Promise<void> {
    const twoWeeksAgo = new Date();
    twoWeeksAgo.setUTCDate(twoWeeksAgo.getUTCDate() - 14);

    const result = await Prediction.deleteMany({
      weekStart: { $lt: twoWeeksAgo },
    });

    console.log(`🧹 Cleaned up ${result.deletedCount} old predictions`);
  }

  /**
   * Відключення від MongoDB
   */
  async disconnect(): Promise<void> {
    if (this.isConnected) {
      await mongoose.disconnect();
      this.isConnected = false;
      console.log('✅ Disconnected from MongoDB');
    }
  }
}
