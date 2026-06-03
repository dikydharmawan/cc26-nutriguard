import { Request, Response, NextFunction } from "express";
import { prisma } from "../db/client";
import * as logRepo from "../repositories/logRepository";

type IdParam = { id: string };

export const getLogs = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const userId = req.user!.id;
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;
    const result = await logRepo.findLogsByUser(prisma, userId, page, pageSize);
    res.json({ ...result, page, pageSize });
  } catch (err) {
    next(err);
  }
};

export const getLogById = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const log = await logRepo.findLogById(prisma, req.params.id, req.user!.id);
    if (!log) {
      res.status(404).json({ error: "Log not found" });
      return;
    }
    res.json(log);
  } catch (err) {
    next(err);
  }
};

export const deleteLogById = async (
  req: Request<IdParam>,
  res: Response,
  next: NextFunction,
) => {
  try {
    const deleted = await logRepo.deleteLog(
      prisma,
      req.params.id,
      req.user!.id,
    );
    if (!deleted) {
      res.status(404).json({ error: "Log not found" });
      return;
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
