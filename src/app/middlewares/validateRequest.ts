/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { ZodObject } from "zod";

export const validateRequest =
  (zodChema: ZodObject<any>) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = JSON.parse(req.body.data) || req.body;
      // console.log("old body", req.body);
      req.body = await zodChema.parseAsync(req.body);
      console.log("New body", req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
