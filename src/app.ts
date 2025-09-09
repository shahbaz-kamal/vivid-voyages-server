import express, { Request, Response } from "express";
import cors from "cors";

import cookieParser from "cookie-parser";
import { router } from "./app/router";
import { globalErrorHandlers } from "./app/middlewares/globalErrorHandler";
import passport from "passport";
import expressSession from "express-session";
import { envVars } from "./app/config/env";
import "./app/config/passport";
import { notFoundError } from "./app/middlewares/notFoundError";

const app = express();

// middlewares
//passport
app.use(
  expressSession({
    secret: envVars.EXPRESS_SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

//rest
app.use(cookieParser());
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
