import { Types } from "mongoose";

export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
  GUIDE = "GUIDE",
}
export interface IAuthProvider {
  provider: string; //"google", "credentials"
  providerId: string;
}
export enum IsActive {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
}

export interface IUser {
  name: string;
  email: string;
  password?: string;
  role: Role;
  phone?: string;
  picture?: string;
  address?: string;
  isDeleted?: boolean;
  isACtive?: IsActive;
  isVerified?: boolean;
  auths: IAuthProvider[];
  bookings: Types.ObjectId[];
  guides?: Types.ObjectId[];
}
