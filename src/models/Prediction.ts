import mongoose, { Schema, Document } from 'mongoose';

export interface IPrediction extends Document {
  walletAddress: string;
  birthDate?: Date; // Дата народження для унікальної ідентифікації користувача
  weekStart: Date; // Понеділок 00:00 UTC
  weekEnd: Date;   // Неділя 23:59 UTC
  prediction: string;
  zodiacSign: string;
  portfolioSnapshot?: {
    networth: string;
    totalAssets: number;
    topAssets: Array<{
      symbol: string;
      value: string;
    }>;
  };
  createdAt: Date;
  updatedAt: Date;
}

const PredictionSchema: Schema = new Schema(
  {
    walletAddress: {
      type: String,
      required: true,
      lowercase: true,
      index: true,
    },
    birthDate: {
      type: Date,
      required: false,
      index: true,
    },
    weekStart: {
      type: Date,
      required: true,
      index: true,
    },
    weekEnd: {
      type: Date,
      required: true,
    },
    prediction: {
      type: String,
      required: true,
    },
    zodiacSign: {
      type: String,
      required: true,
    },
    portfolioSnapshot: {
      type: Object,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index для швидкого пошуку по гаманцю, даті народження та тижню
// Унікальність: один гаманець + одна дата народження = один предикшн на тиждень
PredictionSchema.index({ walletAddress: 1, birthDate: 1, weekStart: 1 }, { unique: true });

export const Prediction = mongoose.model<IPrediction>('Prediction', PredictionSchema);
