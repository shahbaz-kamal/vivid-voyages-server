import express, { Request, Response } from "express";
import cors from "cors";

import httpStatus from "http-status-codes";
import { router } from "./app/router";
import { globalErrorHandlers, notFoundError } from "./app/middlewares/errorHandler";

const app = express();

// middlewares
app.use(express.json());
app.use(cors());

// router middlware
app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) =>
  res.send("✈️ Vivid Voyages server is running")
);

// error handling
app.use(globalErrorHandlers);
// handles 404 error
app.use(notFoundError);

export default app;
