"use server"

import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/session"
import { canReadSalary, type UserRole } from "@/lib/auth/roles"
import { hashPassword } from "@/lib/auth/password"
import { getUsersCollection, toObjectId } from "@/lib/db/collections"
import { serializeUser } from "@/lib/db/serialize"

const STAFF_ROLES: UserRole[] = ["admin", "hr", "manager", "employee"]

export async function getStaff() {
  const profile = await requireRole("hr")
  const users = await getUsersCollection()
  const rows = await users
    .find({ role: { $in: STAFF_ROLES }, isActive: { $ne: false } })
    .sort({ fullName: 1 })
    .toArray()
  return rows.map((row) => serializeUser(row, canReadSalary(profile.role)))
}

export async function createStaff(formData: FormData) {
  await requireRole("hr")
  const fullName = formData.get("fullName")?.toString().trim() ?? ""
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? ""
  const password = formData.get("password")?.toString() ?? ""
  const role = (formData.get("role")?.toString() as UserRole) || "employee"
  const designation = formData.get("designation")?.toString().trim() || "Employee"
  const phone = formData.get("phone")?.toString().trim() || null
  const salaryRaw = formData.get("salary")?.toString()
  const salary = salaryRaw ? Number(salaryRaw) : null

  if (!fullName || !email || !password) return { error: "Name, email, and password are required" }
  if (password.length < 8) return { error: "Password must be at least 8 characters" }
  if (!STAFF_ROLES.includes(role)) return { error: "Invalid role" }

  const users = await getUsersCollection()
  const existing = await users.findOne({ email })
  if (existing) return { error: "An account with this email already exists" }

  const now = new Date()
  await users.insertOne({
    email,
    passwordHash: await hashPassword(password),
    fullName,
    role,
    designation,
    phone,
    courseProgram: null,
    salary: salary != null && Number.isFinite(salary) ? salary : null,
    approvalStatus: "approved",
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  } as never)

  revalidatePath("/dashboard/staff")
  return { success: true }
}

export async function updateStaffSalary(id: string, salary: number | null) {
  await requireRole("hr")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid staff member" }
  await (await getUsersCollection()).updateOne(
    { _id },
    { $set: { salary, updatedAt: new Date() } }
  )
  revalidatePath("/dashboard/staff")
  return { success: true }
}
