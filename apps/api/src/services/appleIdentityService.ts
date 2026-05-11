import { createPublicKey } from "node:crypto";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";
import { AppError } from "../utils/errors.js";

const APPLE_ISSUER = "https://appleid.apple.com";
const APPLE_KEYS_URL = "https://appleid.apple.com/auth/keys";
const KEY_CACHE_TTL_MS = 60 * 60 * 1000;

interface ApplePublicKey {
  kty: "RSA";
  kid: string;
  use: "sig";
  alg: "RS256";
  n: string;
  e: string;
}

interface AppleKeysResponse {
  keys?: ApplePublicKey[];
}

interface AppleIdentityClaims extends JwtPayload {
  sub: string;
  email?: string;
  email_verified?: boolean | string;
  nonce?: string;
}

export interface VerifiedAppleIdentity {
  appleUserId: string;
  email?: string;
}

let cachedAppleKeys: { expiresAt: number; keys: ApplePublicKey[] } | null = null;

function isAppleKeysResponse(value: unknown): value is AppleKeysResponse {
  return typeof value === "object" && value !== null && Array.isArray((value as AppleKeysResponse).keys);
}

function isAppleIdentityClaims(value: JwtPayload | string): value is AppleIdentityClaims {
  return typeof value === "object" && value !== null && typeof value.sub === "string";
}

function getVerifiedEmail(claims: AppleIdentityClaims) {
  if (!claims.email) {
    return undefined;
  }

  const isVerified = claims.email_verified === true || claims.email_verified === "true";
  return isVerified ? claims.email.toLowerCase() : undefined;
}

async function fetchApplePublicKeys() {
  const response = await fetch(APPLE_KEYS_URL);

  if (!response.ok) {
    throw new AppError(502, "Unable to verify Apple identity right now.", "APPLE_KEYS_UNAVAILABLE");
  }

  const body = (await response.json()) as unknown;
  if (!isAppleKeysResponse(body)) {
    throw new AppError(502, "Apple identity keys response was invalid.", "APPLE_KEYS_INVALID");
  }

  cachedAppleKeys = {
    expiresAt: Date.now() + KEY_CACHE_TTL_MS,
    keys: body.keys ?? []
  };

  return cachedAppleKeys.keys;
}

async function getApplePublicKeys(forceRefresh = false) {
  if (!forceRefresh && cachedAppleKeys && cachedAppleKeys.expiresAt > Date.now()) {
    return cachedAppleKeys.keys;
  }

  return fetchApplePublicKeys();
}

function decodeTokenHeader(identityToken: string) {
  const decoded = jwt.decode(identityToken, { complete: true });

  if (!decoded || typeof decoded === "string" || decoded.header.alg !== "RS256" || !decoded.header.kid) {
    throw new AppError(401, "Apple identity token is invalid.", "APPLE_IDENTITY_TOKEN_INVALID");
  }

  return decoded.header;
}

async function getSigningKey(identityToken: string) {
  const header = decodeTokenHeader(identityToken);
  let keys = await getApplePublicKeys();
  let key = keys.find((candidate) => candidate.kid === header.kid);

  if (!key) {
    keys = await getApplePublicKeys(true);
    key = keys.find((candidate) => candidate.kid === header.kid);
  }

  if (!key) {
    throw new AppError(401, "Apple identity token signing key was not found.", "APPLE_IDENTITY_TOKEN_INVALID");
  }

  return createPublicKey({ key, format: "jwk" } as unknown as Parameters<typeof createPublicKey>[0]);
}

export async function verifyAppleIdentityToken(identityToken: string, nonce: string): Promise<VerifiedAppleIdentity> {
  const signingKey = await getSigningKey(identityToken);
  let decoded: JwtPayload | string;

  try {
    decoded = jwt.verify(identityToken, signingKey, {
      algorithms: ["RS256"],
      audience: env.APPLE_CLIENT_ID,
      issuer: APPLE_ISSUER
    });
  } catch {
    throw new AppError(401, "Apple identity token could not be verified.", "APPLE_IDENTITY_TOKEN_INVALID");
  }

  if (!isAppleIdentityClaims(decoded)) {
    throw new AppError(401, "Apple identity token claims were invalid.", "APPLE_IDENTITY_TOKEN_INVALID");
  }

  if (decoded.nonce !== nonce) {
    throw new AppError(401, "Apple identity token nonce did not match.", "APPLE_IDENTITY_NONCE_MISMATCH");
  }

  return {
    appleUserId: decoded.sub,
    email: getVerifiedEmail(decoded)
  };
}
