import { createApp } from "./app.js";
import { env } from "./config/env.js";

const app = createApp();
const server = app.listen(env.PORT, () => {
  console.info(`Tuition ERP API listening on http://localhost:${env.PORT}`);
});

function shutdown(signal: NodeJS.Signals) {
  console.info(`${signal} received; closing HTTP server.`);
  server.close(() => process.exit(0));
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
