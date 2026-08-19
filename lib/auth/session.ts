import { cookies } from "next/headers"
import { SESSION_COOKIE, verifySession } from "@/lib/auth/jwt"
import { hasMinimumRole, type UserRole } from "@/lib/auth/roles"
import { getUsersCollection, toObjectId } from "@/lib/db/collections"
import { ensureSeedAdmin } from "@/lib/db/seed"
import { serializeUser } from "@/lib/db/serialize"
import type { Profile } from "@/lib/types"

export async function getSessionUser() {
  const jar = await cookies()
  const token = jar.get(SESSION_COOKIE)?.value
  if (!token) return null
  return verifySession(token)
}

export async function getProfile(): Promise<Profile | null> {
  await ensureSeedAdmin()
  const session = await getSessionUser()
  if (!session) return null

  const users = await getUsersCollection()
  const _id = toObjectId(session.sub)
  if (!_id) return null
  const doc = await users.findOne({ _id, isActive: { $ne: false } })
  if (!doc) return null
  return serializeUser(doc, true)
}

export async function requireAuth() {
  const profile = await getProfile()
  if (!profile) {
    throw new Error("Unauthorized")
  }
  return profile
}

export async function requireApproved() {
  const profile = await requireAuth()
  if (profile.approvalStatus === "pending") {
    throw new Error("Account pending approval")
  }
  if (profile.approvalStatus === "rejected") {
    throw new Error("Account was not approved")
  }
  return profile
}

export async function requireRole(minRole: UserRole) {
  const profile = await requireApproved()
  if (!hasMinimumRole(profile.role, minRole)) {
    throw new Error("Forbidden")
  }
  return profile
}
