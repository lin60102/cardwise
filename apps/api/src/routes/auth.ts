import { Router } from "express";
import { Prisma } from "@prisma/client";
import { z } from "zod";
import { prisma } from "../db.js";
import { verifyAppleIdentityToken } from "../services/appleIdentityService.js";
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

const appleSignInSchema = z.object({
  identityToken: z.string().min(1),
  nonce: z.string().min(16).max(256),
  user: z.string().min(1),
  name: z.string().trim().min(1).max(80).optional()
});

interface AuthUserRecord {
  id: string;
  email: string;
  name: string | null;
  subscription: {
    plan: "FREE" | "PREMIUM";
  } | null;
}

function toAuthResponse(user: AuthUserRecord) {
  const token = signAuthToken(user.id);

  return {
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      plan: user.subscription?.plan ?? "FREE"
    }
  };
}

function isUniqueConstraintError(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002";
}

async function findUserByAppleProvider(appleUserId: string) {
  const provider = await prisma.userAuthProvider.findUnique({
    where: {
      provider_providerUserId: {
        provider: "APPLE",
        providerUserId: appleUserId
      }
    },
    include: {
      user: {
        include: {
          subscription: true
        }
      }
    }
  });

  return provider?.user ?? null;
}

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

    return res.status(201).json(toAuthResponse(user));
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

    if (!user?.passwordHash || !(await verifyPassword(input.password, user.passwordHash))) {
      throw new AppError(401, "Invalid email or password.", "INVALID_CREDENTIALS");
    }

    return res.json(toAuthResponse(user));
  })
);

authRouter.post(
  "/apple",
  asyncHandler(async (req, res) => {
    const input = appleSignInSchema.parse(req.body);
    const verifiedIdentity = await verifyAppleIdentityToken(input.identityToken, input.nonce);

    if (verifiedIdentity.appleUserId !== input.user) {
      throw new AppError(401, "Apple identity user did not match.", "APPLE_IDENTITY_USER_MISMATCH");
    }

    const linkedUser = await findUserByAppleProvider(verifiedIdentity.appleUserId);
    if (linkedUser) {
      return res.json(toAuthResponse(linkedUser));
    }

    if (!verifiedIdentity.email) {
      throw new AppError(422, "Apple did not return a verified email for this account.", "APPLE_EMAIL_REQUIRED");
    }

    const verifiedEmail = verifiedIdentity.email;
    let user: AuthUserRecord;
    try {
      const transactionUser = await prisma.$transaction(async (tx) => {
        const existingUser = await tx.user.findUnique({
          where: { email: verifiedEmail },
          include: { subscription: true }
        });

        if (existingUser) {
          await tx.userAuthProvider.create({
            data: {
              userId: existingUser.id,
              provider: "APPLE",
              providerUserId: verifiedIdentity.appleUserId,
              email: verifiedEmail
            }
          });

          if (!existingUser.subscription) {
            await tx.subscription.create({
              data: {
                userId: existingUser.id,
                plan: "FREE"
              }
            });
          }

          return tx.user.findUniqueOrThrow({
            where: { id: existingUser.id },
            include: { subscription: true }
          });
        }

        return tx.user.create({
          data: {
            email: verifiedEmail,
            passwordHash: null,
            name: input.name,
            subscription: {
              create: {
                plan: "FREE"
              }
            },
            authProviders: {
              create: {
                provider: "APPLE",
                providerUserId: verifiedIdentity.appleUserId,
                email: verifiedEmail
              }
            }
          },
          include: {
            subscription: true
          }
        });
      });

      user = transactionUser as AuthUserRecord;
    } catch (error) {
      if (!isUniqueConstraintError(error)) {
        throw error;
      }

      const retryUser = await findUserByAppleProvider(verifiedIdentity.appleUserId);
      if (!retryUser) {
        throw new AppError(409, "This Apple account could not be linked.", "APPLE_ACCOUNT_LINK_CONFLICT");
      }

      user = retryUser;
    }

    return res.json(toAuthResponse(user));
  })
);
