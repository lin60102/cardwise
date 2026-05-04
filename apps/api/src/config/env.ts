import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  JWT_SECRET: z.string().min(16),
  PORT: z.coerce.number().default(4000),
  CORS_ORIGIN: z.string().default("*"),
  REVENUECAT_WEBHOOK_SECRET: z.string().optional()
});

export const env = envSchema.parse(process.env);

