import { PrismaClient } from "../../generated/prisma/client";
import { FoodLogRecord } from "../types";

export type CreateLogInput = Omit<FoodLogRecord, "id" | "createdAt">;

export const createLog = async (
  prisma: PrismaClient,
  input: CreateLogInput,
): Promise<FoodLogRecord> => {
  const row = await prisma.foodLog.create({
    data: {
      userId: input.userId,
      imageUrl: input.imageUrl,
      detected: input.detected as object,
      nutrition: input.nutrition as object,
      confidence: input.confidence,
      modelVersion: input.modelVersion,
    },
  });
  return row as unknown as FoodLogRecord;
};

export const findLogsByUser = async (
  prisma: PrismaClient,
  userId: string,
  page: number,
  pageSize: number,
): Promise<{ data: FoodLogRecord[]; total: number }> => {
  const [data, total] = await prisma.$transaction([
    prisma.foodLog.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.foodLog.count({ where: { userId } }),
  ]);
  return { data: data as unknown as FoodLogRecord[], total };
};

export const findLogById = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<FoodLogRecord | null> => {
  const row = await prisma.foodLog.findFirst({ where: { id, userId } });
  return row ? (row as unknown as FoodLogRecord) : null;
};

export const deleteLog = async (
  prisma: PrismaClient,
  id: string,
  userId: string,
): Promise<boolean> => {
  const { count } = await prisma.foodLog.deleteMany({ where: { id, userId } });
  return count > 0;
};
