import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";
import { error } from "console";

let server: Server;

const port = 5000;

const startServer = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://note-app-admin:gFzaAkT0r9oCzZKh@cluster0.xnok4yx.mongodb.net/vivid-voyages?retryWrites=true&w=majority&appName=Cluster0"
    );
    console.log("🍃 Connected to mongoose");

    server = app.listen(port, () => {
      console.log(`✈️ "Vivid Voyages" server is running on port  ${port}`);
    });
  } catch (error) {}
};

startServer();

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
