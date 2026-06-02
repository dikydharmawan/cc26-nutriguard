import jwt from "jsonwebtoken";
import { env } from "../config/env";

const accessOpts: jwt.SignOptions = {
  expiresIn: env.JWT_ACCESS_TTL as jwt.SignOptions["expiresIn"],
};

const refreshOpts: jwt.SignOptions = {
  expiresIn: env.JWT_REFRESH_TTL as jwt.SignOptions["expiresIn"],
};

export const signAccessToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_SECRET, accessOpts);

export const signRefreshToken = (userId: string): string =>
  jwt.sign({ sub: userId }, env.JWT_REFRESH_SECRET, refreshOpts);

export const verifyAccessToken = (token: string): string => {
  const payload = jwt.verify(token, env.JWT_SECRET) as jwt.JwtPayload;
  return payload.sub as string;
};

export const verifyRefreshToken = (token: string): string => {
  const payload = jwt.verify(token, env.JWT_REFRESH_SECRET) as jwt.JwtPayload;
  return payload.sub as string;
};
