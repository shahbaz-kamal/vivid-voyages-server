/* eslint-disable no-console */
import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";

import { envVars } from "./app/config/env";
import { seedSuperAdmin } from "./app/utils/seedSuperAdmin";
import { connectRedis } from "./app/config/redis.config";

let server: Server;

const startServer = async () => {
  try {
    await mongoose.connect(envVars.DB_URL);
    console.log("🍃 Connected to mongoose");

    server = app.listen(envVars.PORT, () => {
      console.log(
        `✈️ "Vivid Voyages" server is running on port  ${envVars.PORT}`
      );
    });
  } catch (error) {
    console.log("Error connecting to mongoose", error);
  }
};

(async () => {
  await connectRedis();
  await startServer();
  await seedSuperAdmin();
})();

//unhandled rejection
process.on("unhandledRejection", (error) => {
  console.log("unhandled rejection detected ...shutting down", error);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});

// Promise.reject(new Error("unhandled rejection!"));

//uncaught exception
process.on("uncaughtException", (error) => {
  console.log("uncaught exception detected ...shutting down", error);
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
});
// throw new Error("I forgot to handle this");

//Signal termination
process.on("SIGTERM", () => {
  console.log("object SIGTERM received...shutting down gracefully");
  if (server) {
    server.close(() => {
      console.log("💥 Process terminated!");
      process.exit(1);
    });
  }
});
