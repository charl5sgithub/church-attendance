import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: Number(process.env.PORT) || 4000,
  jwtSecret: process.env.JWT_SECRET || "dev-secret-change-me",
  adminEmail: process.env.ADMIN_EMAIL || "admin@church.local",
  adminPassword: process.env.ADMIN_PASSWORD || "password123"
};
