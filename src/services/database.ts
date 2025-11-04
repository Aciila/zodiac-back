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
   */
  async getOrCreateUser(walletAddress: string, birthDate?: Date, zodiacSign?: string): Promise<IUser> {
    const normalizedAddress = walletAddress.toLowerCase();
    
    let user = await User.findOne({ walletAddress: normalizedAddress });
    
    if (!user) {
      user = await User.create({
        walletAddress: normalizedAddress,
        birthDate,
        zodiacSign,
      });
      console.log(`✅ Created new user: ${normalizedAddress}`);
    } else if (birthDate || zodiacSign) {
      // Оновлюємо дані якщо передані нові
      if (birthDate) user.birthDate = birthDate;
      if (zodiacSign) user.zodiacSign = zodiacSign;
      await user.save();
      console.log(`✅ Updated user: ${normalizedAddress}`);
    }
    
    return user;
  }

  /**
   * Отримати користувача по адресі гаманця
   */
  async getUserByWallet(walletAddress: string): Promise<IUser | null> {
    return User.findOne({ walletAddress: walletAddress.toLowerCase() });
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
  async getPredictionForCurrentWeek(walletAddress: string): Promise<IPrediction | null> {
    const weekStart = this.getCurrentWeekStart();
    const normalizedAddress = walletAddress.toLowerCase();
    
    return Prediction.findOne({
      walletAddress: normalizedAddress,
      weekStart: weekStart,
    });
  }

  /**
   * Зберегти новий предикшн
   */
  async savePrediction(
    walletAddress: string,
    prediction: string,
    zodiacSign: string,
    portfolioSnapshot?: any
  ): Promise<IPrediction> {
    const weekStart = this.getCurrentWeekStart();
    const weekEnd = this.getWeekEnd(weekStart);
    const normalizedAddress = walletAddress.toLowerCase();

    // Видаляємо старий предикшн для цього тижня (якщо є)
    await Prediction.deleteOne({
      walletAddress: normalizedAddress,
      weekStart: weekStart,
    });

    // Створюємо новий
    const newPrediction = await Prediction.create({
      walletAddress: normalizedAddress,
      weekStart,
      weekEnd,
      prediction,
      zodiacSign,
      portfolioSnapshot,
    });

    console.log(`✅ Saved prediction for ${normalizedAddress} (week: ${weekStart.toISOString()})`);
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
