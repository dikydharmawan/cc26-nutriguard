import { Request, Response, NextFunction } from "express";

// attach { status: number } to thrown errors
export const errorHandler = (
  err: Error & { status?: number },
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const status = err.status ?? 500;
  const message = status < 500 ? err.message : "Internal server error";
  if (status >= 500) console.error("[Error]", err);
  res.status(status).json({ error: message });
};
