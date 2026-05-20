import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  APPLE_CLIENT_ID: z.string().min(1).default("com.kensa.cardwise"),
  PROMO_CODES: z.string().optional(),
  REVENUECAT_WEBHOOK_SECRET: z.string().optional(),
  REVENUECAT_SECRET_API_KEY: z.string().optional(),
  REVENUECAT_ENTITLEMENT_ID: z.string().default("premium")
});

export const env = envSchema.parse(process.env);

