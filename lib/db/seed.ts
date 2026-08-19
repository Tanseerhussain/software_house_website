import { hashPassword } from "@/lib/auth/password"
import { getUsersCollection } from "@/lib/db/collections"

export async function ensureSeedAdmin() {
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase()
  const password = process.env.ADMIN_PASSWORD
  if (!email || !password) return

  const users = await getUsersCollection()
  const existing = await users.findOne({ email })
  if (existing) return

  const now = new Date()
  await users.insertOne({
    email,
    passwordHash: await hashPassword(password),
    fullName: process.env.ADMIN_NAME?.trim() || "APPRIC Admin",
    role: "admin",
    designation: "Admin",
    phone: null,
    courseProgram: null,
    salary: null,
    approvalStatus: "approved",
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  } as never)
}
