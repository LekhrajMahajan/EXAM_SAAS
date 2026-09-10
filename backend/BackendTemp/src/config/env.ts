import dotenv from "dotenv";

dotenv.config();

export const env = {
  PORT: Number(process.env.PORT) || 5000,

  NODE_ENV: process.env.NODE_ENV || "development",

  MONGODB_URI: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/exam_saas",

  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",

  JWT_SECRET: process.env.JWT_SECRET as string,

  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,

  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "7d",

  JWT_REFRESH_EXPIRES_IN: process.env.JWT_REFRESH_EXPIRES_IN || "30d",

  RAZORPAY_KEY_ID: process.env.RAZORPAY_KEY_ID as string,

  RAZORPAY_KEY_SECRET: process.env.RAZORPAY_KEY_SECRET as string,

  RAZORPAY_WEBHOOK_SECRET: process.env.RAZORPAY_WEBHOOK_SECRET as string,

  MASTER_ADMIN_EMAIL: process.env.MASTER_ADMIN_EMAIL as string,

  MASTER_ADMIN_PASSWORD: process.env.MASTER_ADMIN_PASSWORD as string,

  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "LOCAL",

  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME as string,

  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY as string,

  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET as string,
};
