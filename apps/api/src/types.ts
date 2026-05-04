import type { PlanStatus } from "@prisma/client";
import type { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  plan: PlanStatus;
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
}

