import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { processImageScan } from "../services/scanService";
import { Predictor } from "../types";
import { prisma } from "../db/client";

export const handleScan = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    // userId attached by authenticate middleware
    const userId = req.user!.id;
    const predictor: Predictor = req.app.locals.predictor;

    // support both file upload and url
    let imageBuffer: Buffer;
    let imageUrl: string | undefined;

    if (req.file) {
      imageBuffer = req.file.buffer;
    } else if (req.body.imageUrl) {
      // fetch remote image (basic fetch here)
      const resp = await fetch(req.body.imageUrl as string);
      imageBuffer = Buffer.from(await resp.arrayBuffer());
      imageUrl = req.body.imageUrl as string;
    } else {
      res.status(400).json({ error: "Provide an image file or imageUrl" });
      return;
    }

    const log = await processImageScan({
      prisma,
      predictor,
      userId,
      imageBuffer,
      imageUrl,
    });
    res.status(201).json({
      logId: log.id,
      nutrition: log.nutrition,
      confidence: log.confidence,
    });
  } catch (err) {
    next(err);
  }
};
