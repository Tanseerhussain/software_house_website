"use server"

import { revalidatePath } from "next/cache"
import { requireApproved, requireAuth } from "@/lib/auth/session"
import { hasMinimumRole } from "@/lib/auth/roles"
import { getTodayAttendance } from "@/actions/attendance"
import { getWorkLogsCollection, toObjectId } from "@/lib/db/collections"
import { serializeWorkLog } from "@/lib/db/serialize"
import { getTodayInTimezone } from "@/lib/dashboard/utils"
import type { WorkLogStatus } from "@/lib/types"

const STATUSES: WorkLogStatus[] = ["done", "in_progress", "not_done", "blocked"]

function parseWholeNumber(raw: string | undefined, emptyValue: number): number | null {
  const value = raw?.trim() ?? ""
  if (!value) return emptyValue
  if (!/^\d+$/.test(value)) return null
  return Number(value)
}

function parseHoursAndMinutes(formData: FormData): { hoursSpent: number | null; error?: string } {
  const hoursRaw = formData.get("hoursSpent")?.toString()
  const minutesRaw = formData.get("minutesSpent")?.toString()
  const hoursFilled = Boolean(hoursRaw?.trim())
  const minutesFilled = Boolean(minutesRaw?.trim())

  if (!hoursFilled && !minutesFilled) return { hoursSpent: null }

  const hours = parseWholeNumber(hoursRaw, 0)
  const minutes = parseWholeNumber(minutesRaw, 0)
  if (hours == null || hours < 0 || hours > 24) {
    return { hoursSpent: null, error: "Hours must be a whole number from 0 to 24" }
  }
  if (minutes == null || minutes < 0 || minutes > 59) {
    return { hoursSpent: null, error: "Minutes must be a whole number from 0 to 59" }
  }

  const totalMinutes = hours * 60 + minutes
  if (totalMinutes > 24 * 60) {
    return { hoursSpent: null, error: "Time spent cannot exceed 24 hours" }
  }

  return { hoursSpent: Math.round((totalMinutes / 60) * 10000) / 10000 }
}

function revalidateWork() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/work-log")
  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/attendance/live")
  revalidatePath("/dashboard/reports")
}

export async function getWorkLogs(date = getTodayInTimezone(), userId?: string) {
  const profile = await requireAuth()
  const targetId = userId ?? profile.id
  if (targetId !== profile.id && !hasMinimumRole(profile.role, "manager")) {
    throw new Error("Forbidden")
  }
  const logs = await getWorkLogsCollection()
  const rows = await logs.find({ userId: targetId, date }).sort({ createdAt: 1 }).toArray()
  return rows.map(serializeWorkLog)
}

export async function createWorkLog(formData: FormData) {
  const profile = await requireApproved()
  const today = getTodayInTimezone()
  const signedIn = await getTodayAttendance()
  if (!signedIn?.checkIn) {
    return { error: "Sign In first, then log today's work" }
  }

  const title = formData.get("title")?.toString().trim() ?? ""
  const description = formData.get("description")?.toString().trim() || null
  const status = (formData.get("status")?.toString() as WorkLogStatus) || "in_progress"
  const time = parseHoursAndMinutes(formData)
  if (time.error) return { error: time.error }

  if (!title) return { error: "Task title is required" }
  if (!STATUSES.includes(status)) return { error: "Invalid status" }

  const now = new Date()
  const logs = await getWorkLogsCollection()
  await logs.insertOne({
    userId: profile.id,
    date: today,
    title,
    description,
    status,
    planned: true,
    hoursSpent: time.hoursSpent,
    createdAt: now,
    updatedAt: now,
  } as never)

  revalidateWork()
  return { success: true }
}

export async function updateWorkLogStatus(id: string, status: WorkLogStatus) {
  const profile = await requireApproved()
  if (!STATUSES.includes(status)) return { error: "Invalid status" }
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid task" }

  const logs = await getWorkLogsCollection()
  const existing = await logs.findOne({ _id })
  if (!existing) return { error: "Task not found" }
  if (existing.userId !== profile.id && !hasMinimumRole(profile.role, "hr")) {
    return { error: "Forbidden" }
  }

  await logs.updateOne({ _id }, { $set: { status, updatedAt: new Date() } })
  revalidateWork()
  return { success: true }
}

export async function deleteWorkLog(id: string) {
  const profile = await requireApproved()
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid task" }

  const logs = await getWorkLogsCollection()
  const existing = await logs.findOne({ _id })
  if (!existing) return { error: "Task not found" }
  if (existing.userId !== profile.id && !hasMinimumRole(profile.role, "hr")) {
    return { error: "Forbidden" }
  }

  await logs.deleteOne({ _id })
  revalidateWork()
  return { success: true }
}
