"use server"

import { revalidatePath } from "next/cache"
import { requireApproved, requireAuth } from "@/lib/auth/session"
import { hasMinimumRole } from "@/lib/auth/roles"
import { getAttendanceCollection, getLeaveCollection, getUsersCollection, toObjectId } from "@/lib/db/collections"
import { serializeLeave, serializeUser } from "@/lib/db/serialize"
import { getTodayInTimezone } from "@/lib/dashboard/utils"
import type { LeaveStatus, LeaveType } from "@/lib/types"

const LEAVE_TYPES: LeaveType[] = ["sick", "casual", "annual", "unpaid", "short"]

function revalidateLeave() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/leave")
  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/attendance/live")
}

export async function getLeaveRequests() {
  const profile = await requireAuth()
  const leaves = await getLeaveCollection()
  const canManage = hasMinimumRole(profile.role, "manager")
  const rows = await leaves
    .find(canManage ? {} : { userId: profile.id })
    .sort({ createdAt: -1 })
    .limit(200)
    .toArray()

  if (!canManage) return rows.map(serializeLeave)

  const users = await getUsersCollection()
  const ids = rows.map((r) => toObjectId(r.userId)).filter((id): id is NonNullable<typeof id> => id !== null)
  const people = await users.find({ _id: { $in: ids } }).toArray()
  const byId = new Map(people.map((p) => [p._id.toString(), serializeUser(p)]))
  return rows.map((row) => ({
    ...serializeLeave(row),
    profile: byId.get(row.userId)
      ? {
          id: byId.get(row.userId)!.id,
          fullName: byId.get(row.userId)!.fullName,
          email: byId.get(row.userId)!.email,
          designation: byId.get(row.userId)!.designation,
          role: byId.get(row.userId)!.role,
        }
      : undefined,
  }))
}

export async function applyLeave(formData: FormData) {
  const profile = await requireApproved()
  const leaveType = (formData.get("leaveType")?.toString() as LeaveType) || "casual"
  const startDate = formData.get("startDate")?.toString() ?? ""
  const endDate = formData.get("endDate")?.toString() || startDate
  const startTime = formData.get("startTime")?.toString() || null
  const endTime = formData.get("endTime")?.toString() || null
  const reason = formData.get("reason")?.toString().trim() ?? ""

  if (!LEAVE_TYPES.includes(leaveType)) return { error: "Invalid leave type" }
  if (!startDate || !reason) return { error: "Date and reason are required" }
  if (endDate < startDate) return { error: "End date cannot be before start date" }
  if (leaveType === "short" && (!startTime || !endTime)) {
    return { error: "Short leave needs start and end time" }
  }

  const now = new Date()
  const leaves = await getLeaveCollection()
  await leaves.insertOne({
    userId: profile.id,
    leaveType,
    startDate,
    endDate,
    startTime,
    endTime,
    reason,
    status: "pending",
    createdAt: now,
    updatedAt: now,
  } as never)

  revalidateLeave()
  return { success: true }
}

export async function updateLeaveStatus(id: string, status: LeaveStatus) {
  const profile = await requireApproved()
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid request" }

  const leaves = await getLeaveCollection()
  const existing = await leaves.findOne({ _id })
  if (!existing) return { error: "Leave request not found" }

  const canManage = hasMinimumRole(profile.role, "manager")
  if (status === "cancelled") {
    if (existing.userId !== profile.id) return { error: "Forbidden" }
  } else if (!canManage) {
    return { error: "Forbidden" }
  }

  await leaves.updateOne({ _id }, { $set: { status, updatedAt: new Date() } })

  if (status === "approved") {
    const attendance = await getAttendanceCollection()
    const today = getTodayInTimezone()
    if (existing.startDate <= today && existing.endDate >= today) {
      await attendance.updateOne(
        { userId: existing.userId, date: today },
        {
          $set: {
            status: "on_leave",
            updatedAt: new Date(),
          },
          $setOnInsert: {
            userId: existing.userId,
            date: today,
            checkIn: null,
            checkOut: null,
            workMode: "office",
            totalHours: null,
            notes: `${existing.leaveType} leave`,
            createdAt: new Date(),
          },
        },
        { upsert: true }
      )
    }
  }

  revalidateLeave()
  return { success: true }
}

export async function getPendingLeaveCount() {
  const profile = await requireAuth()
  if (!hasMinimumRole(profile.role, "manager")) return 0
  const leaves = await getLeaveCollection()
  return leaves.countDocuments({ status: "pending" })
}
