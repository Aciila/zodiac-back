import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  walletAddress: string;
  birthDate?: Date;
  zodiacSign?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
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
    zodiacSign: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index для унікальності: один гаманець може мати кілька користувачів з різними датами народження
UserSchema.index({ walletAddress: 1, birthDate: 1 }, { unique: true, sparse: true });

export const User = mongoose.model<IUser>('User', UserSchema);
