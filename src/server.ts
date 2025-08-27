import { Server } from "http";

import mongoose from "mongoose";
import app from "./app";

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
