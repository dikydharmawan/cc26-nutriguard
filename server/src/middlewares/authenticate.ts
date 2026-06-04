import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../utils/token";

// extend express request to carry the authenticated user
declare global {
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    res
      .status(401)
      .json({ error: "Missing or malformed Authorization header" });
    return;
  }
  try {
    const token = header.slice(7);
    const userId = verifyAccessToken(token);
    req.user = { id: userId };
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
