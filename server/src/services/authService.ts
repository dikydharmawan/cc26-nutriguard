import * as argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { UserRecord } from "../types";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import * as userRepo from "../repositories/userRepository";

export type AuthTokens = { accessToken: string; refreshToken: string };

export const registerUser = async (
  prisma: PrismaClient,
  email: string,
  password: string,
): Promise<UserRecord> => {
  const existing = await userRepo.findUserByEmail(prisma, email);
  if (existing)
    throw Object.assign(new Error("Email already registered"), { status: 409 });

  const passwordHash = await argon2.hash(password);
  return userRepo.createUser(prisma, email, passwordHash);
};

export const loginUser = async (
  prisma: PrismaClient,
  email: string,
  password: string,
): Promise<AuthTokens> => {
  const user = await userRepo.findUserByEmail(prisma, email);
  if (!user)
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid)
    throw Object.assign(new Error("Invalid credentials"), { status: 401 });

  return {
    accessToken: signAccessToken(user.id),
    refreshToken: signRefreshToken(user.id),
  };
};

export const refreshTokens = async (
  refreshToken: string,
): Promise<AuthTokens> => {
  const userId = verifyRefreshToken(refreshToken); // throws on invalid
  return {
    accessToken: signAccessToken(userId),
    refreshToken: signRefreshToken(userId),
  };
};
