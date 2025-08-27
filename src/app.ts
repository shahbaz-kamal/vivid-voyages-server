import express, { Request, Response } from "express";

const app = express();
app.get("/", (req: Request, res: Response) =>
  res.send("✈️ Vivid Voyages server is running")
);

export default app;
