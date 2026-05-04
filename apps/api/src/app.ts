import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { authRouter } from "./routes/auth.js";
import { cardsRouter } from "./routes/cards.js";
import { recommendationsRouter } from "./routes/recommendations.js";
import { subscriptionRouter } from "./routes/subscription.js";
import { userCardsRouter } from "./routes/userCards.js";

export function createApp() {
  const app = express();

  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN }));
  app.use(express.json({ limit: "1mb" }));
  app.use(morgan("dev"));

  app.get("/health", (_req, res) => {
    res.json({ ok: true, name: "CardWise API" });
  });

  app.use("/auth", authRouter);
  app.use("/cards", cardsRouter);
  app.use("/user/cards", userCardsRouter);
  app.use("/recommendations", recommendationsRouter);
  app.use("/subscription", subscriptionRouter);
  app.use(errorHandler);

  return app;
}

