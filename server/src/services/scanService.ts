import { PrismaClient } from "@prisma/client";
import { Predictor, FoodLogRecord } from "../types";
import * as logRepo from "../repositories/logRepository";

export const processImageScan = async (deps: {
  prisma: PrismaClient;
  predictor: Predictor;
  userId: string;
  imageBuffer: Buffer;
  imageUrl?: string;
}): Promise<FoodLogRecord> => {
  const { prisma, predictor, userId, imageBuffer, imageUrl } = deps;

  // run ml inference
  const prediction = await predictor.predict(imageBuffer);

  // persist result
  const log = await logRepo.createLog(prisma, {
    userId,
    imageUrl: imageUrl ?? null,
    detected: prediction.detected,
    nutrition: prediction.nutrition,
    confidence: prediction.confidence,
    modelVersion: prediction.modelVersion,
  });

  return log;
};
