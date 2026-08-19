import { SignJWT, jwtVerify } from "jose"
import type { UserRole } from "@/lib/auth/roles"
import type { ApprovalStatus } from "@/lib/types"

export const SESSION_COOKIE = "portal_session"
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7

export interface SessionPayload {
  sub: string
  email: string
  role: UserRole
  approvalStatus: ApprovalStatus
  fullName: string
}

function getSecret() {
  const secret = process.env.AUTH_SECRET
  if (!secret) {
    throw new Error("AUTH_SECRET is missing. Add it to software_house/.env")
  }
  return new TextEncoder().encode(secret)
}

export async function signSession(payload: SessionPayload): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(payload.sub)
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(getSecret())
}

export async function verifySession(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, getSecret())
    if (!payload.sub || typeof payload.email !== "string") return null
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role as UserRole,
      approvalStatus: payload.approvalStatus as ApprovalStatus,
      fullName: typeof payload.fullName === "string" ? payload.fullName : "",
    }
  } catch {
    return null
  }
}
