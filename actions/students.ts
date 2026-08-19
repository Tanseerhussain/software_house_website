"use server"

import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { revalidatePath } from "next/cache"
import { SESSION_COOKIE, SESSION_MAX_AGE, signSession } from "@/lib/auth/jwt"
import { hashPassword } from "@/lib/auth/password"
import { requireRole } from "@/lib/auth/session"
import { getUsersCollection, toObjectId } from "@/lib/db/collections"
import { serializeUser } from "@/lib/db/serialize"
import type { ApprovalStatus } from "@/lib/types"

export async function registerStudent(formData: FormData) {
  const fullName = formData.get("fullName")?.toString().trim() ?? ""
  const email = formData.get("email")?.toString().trim().toLowerCase() ?? ""
  const phone = formData.get("phone")?.toString().trim() || null
  const designation = formData.get("designation")?.toString().trim() || "Student"
  const courseProgram = formData.get("courseProgram")?.toString().trim() || null
  const password = formData.get("password")?.toString() ?? ""
  const confirmPassword = formData.get("confirmPassword")?.toString() ?? ""

  if (!fullName || !email || !phone || !password) {
    return { error: "Name, email, phone, and password are required" }
  }
  if (password.length < 8) return { error: "Password must be at least 8 characters" }
  if (password !== confirmPassword) return { error: "Passwords do not match" }

  const users = await getUsersCollection()
  const existing = await users.findOne({ email })
  if (existing) return { error: "An account with this email already exists" }

  const now = new Date()
  const result = await users.insertOne({
    email,
    passwordHash: await hashPassword(password),
    fullName,
    role: "student",
    designation,
    phone,
    courseProgram,
    salary: null,
    approvalStatus: "pending",
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  } as never)

  const token = await signSession({
    sub: result.insertedId.toString(),
    email,
    role: "student",
    approvalStatus: "pending",
    fullName,
  })
  const jar = await cookies()
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })

  redirect("/auth/pending-approval")
}

export async function getStudents() {
  await requireRole("hr")
  const users = await getUsersCollection()
  const rows = await users.find({ role: "student" }).sort({ createdAt: -1 }).toArray()
  return rows.map((row) => serializeUser(row))
}

export async function setStudentApproval(id: string, status: Extract<ApprovalStatus, "approved" | "rejected">) {
  await requireRole("hr")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid student" }

  const users = await getUsersCollection()
  const student = await users.findOne({ _id, role: "student" })
  if (!student) return { error: "Student not found" }

  await users.updateOne({ _id }, { $set: { approvalStatus: status, updatedAt: new Date() } })
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/students")
  return { success: true }
}

export async function inviteStudent(input: {
  email: string
  fullName: string
  phone?: string | null
  designation?: string
  courseProgram?: string | null
  password?: string
}) {
  await requireRole("hr")
  const email = input.email.trim().toLowerCase()
  const fullName = input.fullName.trim()
  if (!email || !fullName) return { error: "Name and email are required" }

  const users = await getUsersCollection()
  const existing = await users.findOne({ email })
  if (existing) return { error: "An account with this email already exists" }

  const password = input.password?.trim() || `Student@${Math.random().toString(36).slice(2, 8)}`
  const now = new Date()
  await users.insertOne({
    email,
    passwordHash: await hashPassword(password),
    fullName,
    role: "student",
    designation: input.designation?.trim() || "Student",
    phone: input.phone?.trim() || null,
    courseProgram: input.courseProgram?.trim() || null,
    salary: null,
    approvalStatus: "approved",
    avatarUrl: null,
    isActive: true,
    createdAt: now,
    updatedAt: now,
  } as never)

  revalidatePath("/dashboard/students")
  return { success: true, temporaryPassword: password }
}
