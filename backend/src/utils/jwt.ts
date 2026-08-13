import jwt, { Secret, SignOptions } from "jsonwebtoken";
import { env } from "../config/env";

import { JwtPayload } from "../middleware/authenticate";
export { JwtPayload };

const ACCESS_SECRET: Secret = env.JWT_SECRET;
const REFRESH_SECRET: Secret = env.JWT_REFRESH_SECRET;

import settingsCache from "../modules/system-settings/settingsCache.service";

export const generateAccessToken = (payload: JwtPayload, expiresIn?: string | number): string => {
  const dynamicExpiry = settingsCache.get<string>("JWT_ACCESS_EXPIRY");
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: (expiresIn || dynamicExpiry || env.JWT_EXPIRES_IN) as SignOptions["expiresIn"],
  });
};

export const generateRefreshToken = (payload: JwtPayload): string => {
  const dynamicExpiry = settingsCache.get<string>("JWT_REFRESH_EXPIRY");
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: (dynamicExpiry || env.JWT_REFRESH_EXPIRES_IN) as SignOptions["expiresIn"],
  });
};

export const verifyAccessToken = (token: string) => {
  return jwt.verify(token, ACCESS_SECRET);
};

export const verifyRefreshToken = (token: string) => {
  return jwt.verify(token, REFRESH_SECRET);
};
