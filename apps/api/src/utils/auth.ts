import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

const TOKEN_EXPIRES_IN = "30d";

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function signAuthToken(userId: string): string {
  return jwt.sign({ sub: userId }, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });
}

export function verifyAuthToken(token: string): { sub: string } {
  return jwt.verify(token, env.JWT_SECRET) as { sub: string };
}

