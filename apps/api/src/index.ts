import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { prisma } from "./db.js";

const app = createApp();

const server = app.listen(env.PORT, () => {
  console.log(`CardWise API running on http://localhost:${env.PORT}`);
});

async function shutdown() {
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
