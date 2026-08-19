"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/auth/jwt"
import { hashPassword, verifyPassword } from "@/lib/auth/password"
import { getUsersCollection } from "@/lib/db/collections"
import { ensureSeedAdmin } from "@/lib/db/seed"
import { requireAuth } from "@/lib/auth/session"

function cookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  }
}

export async function loginAction(formData: FormData) {
  await ensureSeedAdmin()
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? ""
  const password = formData.get("password")?.toString() ?? ""
  const next = formData.get("redirect")?.toString() || "/dashboard"

  if (!email || !password) {
    return { error: "Email and password are required" }
  }

  const users = await getUsersCollection()
  const user = await users.findOne({ email })
  if (!user || !(await verifyPassword(password, user.passwordHash))) {
    return { error: "Invalid email or password" }
  }
  if (user.isActive === false) {
    return { error: "This account is disabled" }
  }

  const token = await signSession({
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    approvalStatus: user.approvalStatus,
    fullName: user.fullName,
  })

  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, cookieOptions())

  if (user.approvalStatus === "pending") {
    redirect("/auth/pending-approval")
  }
  if (user.approvalStatus === "rejected") {
    jar.delete(SESSION_COOKIE)
    return { error: "Your registration was not approved" }
  }

  redirect(next.startsWith("/") ? next : "/dashboard")
}

export async function logoutAction() {
  const jar = await cookies()
  jar.delete(SESSION_COOKIE)
  redirect("/auth/login")
}

export async function updateProfileAction(formData: FormData) {
  const profile = await requireAuth()
  const fullName = formData.get("fullName")?.toString().trim()
  const phone = formData.get("phone")?.toString().trim() || null
  if (!fullName) return { error: "Name is required" }

  const users = await getUsersCollection()
  await users.updateOne(
    { email: profile.email },
    { $set: { fullName, phone, updatedAt: new Date() } }
  )
  return { success: true }
}

export async function changePasswordAction(formData: FormData) {
  const profile = await requireAuth()
  const current = formData.get("currentPassword")?.toString() ?? ""
  const next = formData.get("newPassword")?.toString() ?? ""
  const confirm = formData.get("confirmPassword")?.toString() ?? ""

  if (next.length < 8) return { error: "New password must be at least 8 characters" }
  if (next !== confirm) return { error: "Passwords do not match" }

  const users = await getUsersCollection()
  const user = await users.findOne({ email: profile.email })
  if (!user || !(await verifyPassword(current, user.passwordHash))) {
    return { error: "Current password is incorrect" }
  }

  await users.updateOne(
    { _id: user._id },
    { $set: { passwordHash: await hashPassword(next), updatedAt: new Date() } }
  )
  return { success: true }
}
