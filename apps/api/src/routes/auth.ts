import { Router } from "express";
import { z } from "zod";
import { prisma } from "../db.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { hashPassword, signAuthToken, verifyPassword } from "../utils/auth.js";
import { AppError } from "../utils/errors.js";

export const authRouter = Router();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(1).max(80).optional()
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

authRouter.post(
  "/register",
  asyncHandler(async (req, res) => {
    const input = registerSchema.parse(req.body);
    const passwordHash = await hashPassword(input.password);

    const user = await prisma.user.create({
      data: {
        email: input.email.toLowerCase(),
        passwordHash,
        name: input.name,
        subscription: {
          create: {
            plan: "FREE"
          }
        }
      },
      include: {
        subscription: true
      }
    });

    const token = signAuthToken(user.id);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.subscription?.plan ?? "FREE"
      }
    });
  })
);

authRouter.post(
  "/login",
  asyncHandler(async (req, res) => {
    const input = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({
      where: { email: input.email.toLowerCase() },
      include: { subscription: true }
    });

    if (!user || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
    }

    const token = signAuthToken(user.id);

    return res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        plan: user.subscription?.plan ?? "FREE"
      }
    });
  })
);

