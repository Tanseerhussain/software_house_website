"use server"

import { revalidatePath } from "next/cache"
import { requireApproved, requireAuth, requireRole } from "@/lib/auth/session"
import { hasMinimumRole } from "@/lib/auth/roles"
import {
  getAttendanceCollection,
  getLeaveCollection,
  getUsersCollection,
  getWorkLogsCollection,
  toObjectId,
} from "@/lib/db/collections"
import { serializeAttendance, serializeUser } from "@/lib/db/serialize"
import { getPresenceStatus } from "@/lib/dashboard/presence"
import {
  determineCheckInStatus,
  getTodayInTimezone,
  hoursBetween,
  isEarlyCheckOut,
} from "@/lib/dashboard/utils"
import type { AttendanceStatus, DesignationGroup, LiveBoardPerson, OverviewStats, WorkMode } from "@/lib/types"

const checkInRateLimit = new Map<string, number>()
const RATE_LIMIT_MS = 5000

function isRateLimited(userId: string): boolean {
  const last = checkInRateLimit.get(userId)
  const now = Date.now()
  if (last && now - last < RATE_LIMIT_MS) return true
  checkInRateLimit.set(userId, now)
  return false
}

function revalidateAttendance() {
  revalidatePath("/dashboard")
  revalidatePath("/dashboard/attendance")
  revalidatePath("/dashboard/attendance/live")
  revalidatePath("/dashboard/attendance/by-designation")
  revalidatePath("/dashboard/reports")
}

export async function checkIn(workMode: WorkMode = "office") {
  const profile = await requireApproved()
  if (isRateLimited(profile.id)) {
    return { error: "Please wait before signing in again" }
  }

  const today = getTodayInTimezone()
  const attendance = await getAttendanceCollection()
  const existing = await attendance.findOne({ userId: profile.id, date: today })
  if (existing?.checkIn) {
    return { error: "Already signed in today" }
  }

  const now = new Date()
  const status: AttendanceStatus = workMode === "remote" ? "remote" : determineCheckInStatus()
  const payload = {
    userId: profile.id,
    date: today,
    checkIn: now,
    checkOut: null,
    status,
    workMode,
    totalHours: null,
    notes: null,
    updatedAt: now,
  }

  if (existing) {
    await attendance.updateOne({ _id: existing._id }, { $set: payload })
  } else {
    await attendance.insertOne({ ...payload, createdAt: now } as never)
  }

  revalidateAttendance()
  return { success: true, checkIn: now.toISOString() }
}

export async function checkOut(notes?: string) {
  const profile = await requireApproved()
  if (isRateLimited(profile.id)) {
    return { error: "Please wait before signing out again" }
  }

  const today = getTodayInTimezone()
  const attendance = await getAttendanceCollection()
  const record = await attendance.findOne({ userId: profile.id, date: today })
  if (!record?.checkIn) {
    return { error: "No Sign In found for today" }
  }
  if (record.checkOut) {
    return { error: "Already signed out today" }
  }

  const now = new Date()
  let status = record.status
  if (isEarlyCheckOut() && status !== "remote") {
    status = "half_day"
  }
  const totalHours = hoursBetween(record.checkIn.toISOString(), now.toISOString())

  await attendance.updateOne(
    { _id: record._id },
    {
      $set: {
        checkOut: now,
        status,
        notes: notes ?? record.notes,
        totalHours,
        updatedAt: now,
      },
    }
  )

  revalidateAttendance()
  return { success: true, checkOut: now.toISOString() }
}

export async function getTodayAttendance(userId?: string) {
  const profile = await requireAuth()
  const targetId = userId ?? profile.id
  if (targetId !== profile.id && !hasMinimumRole(profile.role, "manager")) {
    throw new Error("Forbidden")
  }
  const today = getTodayInTimezone()
  const attendance = await getAttendanceCollection()
  const record = await attendance.findOne({ userId: targetId, date: today })
  return record ? serializeAttendance(record) : null
}

export async function getAttendanceHistory(month: string, userId?: string) {
  const profile = await requireAuth()
  const targetId = userId ?? profile.id
  if (targetId !== profile.id && !hasMinimumRole(profile.role, "manager")) {
    throw new Error("Forbidden")
  }
  const attendance = await getAttendanceCollection()
  const rows = await attendance
    .find({ userId: targetId, date: { $regex: `^${month}` } })
    .sort({ date: 1 })
    .toArray()
  return rows.map(serializeAttendance)
}

export async function getLiveAttendanceBoard(date = getTodayInTimezone()): Promise<LiveBoardPerson[]> {
  await requireRole("manager")
  const [users, attendance, workLogs, leaves] = await Promise.all([
    getUsersCollection(),
    getAttendanceCollection(),
    getWorkLogsCollection(),
    getLeaveCollection(),
  ])

  const people = await users
    .find({ isActive: { $ne: false }, approvalStatus: "approved" })
    .sort({ fullName: 1 })
    .toArray()

  const [records, logs, leaveRows] = await Promise.all([
    attendance.find({ date }).toArray(),
    workLogs.find({ date }).toArray(),
    leaves.find({ status: "approved", startDate: { $lte: date }, endDate: { $gte: date } }).toArray(),
  ])

  const attendanceByUser = new Map(records.map((row) => [row.userId, serializeAttendance(row)]))
  const logCount = new Map<string, number>()
  for (const log of logs) {
    logCount.set(log.userId, (logCount.get(log.userId) ?? 0) + 1)
  }
  const onLeave = new Set(leaveRows.map((row) => row.userId))

  return people.map((person) => {
    const id = person._id.toString()
    const att = attendanceByUser.get(id) ?? null
    return {
      id,
      fullName: person.fullName,
      email: person.email,
      role: person.role,
      designation: person.designation,
      presence: getPresenceStatus(att, onLeave.has(id)),
      attendance: att,
      workLogCount: logCount.get(id) ?? 0,
    }
  })
}

export async function getDesignationBoard(): Promise<DesignationGroup[]> {
  const people = await getLiveAttendanceBoard()
  const groups = new Map<string, LiveBoardPerson[]>()
  for (const person of people) {
    const key = person.designation?.trim() || "Unassigned"
    const list = groups.get(key) ?? []
    list.push(person)
    groups.set(key, list)
  }

  return [...groups.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([designation, members]) => ({
      designation,
      total: members.length,
      in: members.filter((p) => p.presence === "in").length,
      out: members.filter((p) => p.presence === "out").length,
      not_arrived: members.filter((p) => p.presence === "not_arrived").length,
      on_leave: members.filter((p) => p.presence === "on_leave").length,
      people: members,
    }))
}

export async function getOverviewStats(): Promise<OverviewStats> {
  const profile = await requireApproved()
  if (!hasMinimumRole(profile.role, "manager")) {
    return {
      signedIn: 0,
      notYetSignedIn: 0,
      signedOut: 0,
      missingWorkLogs: 0,
      pendingStudentApprovals: 0,
      onLeave: 0,
    }
  }

  const people = await getLiveAttendanceBoard()
  const users = await getUsersCollection()
  const pendingStudentApprovals = await users.countDocuments({
    role: "student",
    approvalStatus: "pending",
  })

  return {
    signedIn: people.filter((p) => p.presence === "in").length,
    notYetSignedIn: people.filter((p) => p.presence === "not_arrived").length,
    signedOut: people.filter((p) => p.presence === "out").length,
    missingWorkLogs: people.filter((p) => p.presence === "in" && p.workLogCount === 0).length,
    pendingStudentApprovals,
    onLeave: people.filter((p) => p.presence === "on_leave").length,
  }
}

export async function getCompanyAttendance() {
  await requireRole("hr")
  const today = getTodayInTimezone()
  const [attendance, users] = await Promise.all([getAttendanceCollection(), getUsersCollection()])
  const records = await attendance.find({ date: today }).sort({ checkIn: 1 }).toArray()
  const ids = records.map((r) => toObjectId(r.userId)).filter((id): id is NonNullable<typeof id> => id !== null)
  const people = await users.find({ _id: { $in: ids } }).toArray()
  const byId = new Map(people.map((p) => [p._id.toString(), serializeUser(p)]))
  return records.map((record) => ({
    ...serializeAttendance(record),
    profile: byId.get(record.userId) ?? null,
  }))
}

export async function getMissingWorkLogsToday() {
  const people = await getLiveAttendanceBoard()
  return people.filter((p) => p.presence === "in" && p.workLogCount === 0)
}
