import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (zodChema: ZodObject<any>) =>
    async (req: Request, res: Response, next: NextFunction) => {
      try {
        console.log("old body", req.body);
        req.body = await zodChema.parseAsync(req.body);
        console.log("New body", req.body);
        next();
      } catch (error) {
        next(error);
      }
    };