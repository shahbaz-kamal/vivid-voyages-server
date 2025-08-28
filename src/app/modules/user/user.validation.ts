// import { NextFunction, Request, Response } from "express";
import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, { message: "Name should be at least two characters" })
    .max(50, { message: "Name can not exceed more than 50 characters" }),
  email: z
    .string("email must be string")
    .email("Invalid email format")
    .min(2, { message: "Email should be at least five characters" })
    .max(50, { message: "Email can not exceed more than 50 characters" }),
  password: z
    .string("Password must be string")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .optional(),
  phone: z
    .string("Phone number must be a string")
    .regex(
      /^(\+8801[3-9][0-9]{8}|01[3-9][0-9]{8})$/,
      "Invalid Bangladeshi phone number format"
    )
    .optional(),

  address: z
    .string("Address must be string")
    .max(200, {
      message: "Address can not exceed more than 200 characters",
    })
    .optional(),
});
export const updateUserZodSchema = z.object({
  name: z
    .string("Name is required")
    .min(2, { message: "Name should be at least two characters" })
    .max(50, { message: "Name can not exceed more than 50 characters" })
    .optional(),
  password: z
    .string("Password must be string")
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .optional(),
  phone: z
    .string("Phone number must be a string")
    .regex(
      /^(\+8801[3-9][0-9]{8}|01[3-9][0-9]{8})$/,
      "Invalid Bangladeshi phone number format"
    )
    .optional(),

  address: z
    .string("Address must be string")
    .max(200, {
      message: "Address can not exceed more than 200 characters",
    })
    .optional(),
  role: z.enum(Object.values(Role) as [string]).optional(),
  isActive: z.enum(Object.values(IsActive) as [string]).optional(),
  isDeleted: z.boolean("isVerified Must be true or false.").optional(),
  isVerified: z.enum(Object.values(IsActive) as [string]).optional(),
});
