import { PrismaClient } from "@prisma/client";
import { UserRecord } from "../types";

export const findUserByEmail = async (
  prisma: PrismaClient,
  email: string,
): Promise<UserRecord | null> => {
  const row = await prisma.user.findUnique({ where: { email } });
  return row ? (row as unknown as UserRecord) : null;
};

export const createUser = async (
  prisma: PrismaClient,
  email: string,
  passwordHash: string,
): Promise<UserRecord> => {
  const row = await prisma.user.create({ data: { email, passwordHash } });
  return row as unknown as UserRecord;
};

export const findUserById = async (
  prisma: PrismaClient,
  id: string,
): Promise<UserRecord | null> => {
  const row = await prisma.user.findUnique({ where: { id } });
  return row ? (row as unknown as UserRecord) : null;
};
