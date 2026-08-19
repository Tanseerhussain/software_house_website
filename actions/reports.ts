"use server"

import { requireApproved } from "@/lib/auth/session"
import { hasMinimumRole } from "@/lib/auth/roles"
import { getAttendanceCollection, getUsersCollection, getWorkLogsCollection } from "@/lib/db/collections"
import { datesInRange, getTodayInTimezone, hoursBetween, startOfMonthISO } from "@/lib/dashboard/utils"

function clampRange(from?: string, to?: string) {
  const today = getTodayInTimezone()
  const start = from || startOfMonthISO()
  const end = to || today
  return start <= end ? { start, end } : { start: end, end: start }
}

export async function getDateRangeReport(from?: string, to?: string) {
  const profile = await requireApproved()
  const { start, end } = clampRange(from, to)
  const ownOnly = !hasMinimumRole(profile.role, "manager")

  const [usersCol, attendanceCol, workCol] = await Promise.all([
    getUsersCollection(),
    getAttendanceCollection(),
    getWorkLogsCollection(),
  ])

  const people = await usersCol
    .find({
      isActive: { $ne: false },
      approvalStatus: "approved",
      ...(ownOnly ? { email: profile.email } : {}),
    })
    .sort({ fullName: 1 })
    .toArray()

  const userIds = people.map((p) => p._id.toString())
  const [attendanceRows, workRows] = await Promise.all([
    attendanceCol.find({ userId: { $in: userIds }, date: { $gte: start, $lte: end } }).toArray(),
    workCol.find({ userId: { $in: userIds }, date: { $gte: start, $lte: end } }).toArray(),
  ])

  const days = datesInRange(start, end)
  const attendanceByUser = new Map<string, typeof attendanceRows>()
  for (const row of attendanceRows) {
    const list = attendanceByUser.get(row.userId) ?? []
    list.push(row)
    attendanceByUser.set(row.userId, list)
  }
  const workByUser = new Map<string, typeof workRows>()
  for (const row of workRows) {
    const list = workByUser.get(row.userId) ?? []
    list.push(row)
    workByUser.set(row.userId, list)
  }

  const attendance = people.map((person) => {
    const id = person._id.toString()
    const records = attendanceByUser.get(id) ?? []
    const daysPresent = records.filter((r) => ["present", "late", "remote", "half_day"].includes(r.status)).length
    const daysLate = records.filter((r) => r.status === "late").length
    const daysAbsent = Math.max(days.length - daysPresent - records.filter((r) => r.status === "on_leave").length, 0)
    const totalHours = records.reduce((sum, r) => {
      const hours = r.totalHours ?? hoursBetween(r.checkIn?.toISOString(), r.checkOut?.toISOString())
      return sum + (hours ?? 0)
    }, 0)
    return {
      user_id: id,
      name: person.fullName,
      designation: person.designation ?? "Unassigned",
      role: person.role,
      days_present: daysPresent,
      days_late: daysLate,
      days_absent: daysAbsent,
      total_hours: Math.round(totalHours * 100) / 100,
    }
  })

  const work = people.map((person) => {
    const id = person._id.toString()
    const logs = workByUser.get(id) ?? []
    const tasksDone = logs.filter((l) => l.status === "done").length
    const tasksNotDone = logs.filter((l) => l.status === "not_done" || l.status === "blocked").length
    const total = logs.length
    const incomplete = logs
      .filter((l) => l.status !== "done")
      .map((l) => l.title)
      .join("; ")
    return {
      user_id: id,
      name: person.fullName,
      designation: person.designation ?? "Unassigned",
      tasks_done: tasksDone,
      tasks_not_done: tasksNotDone,
      tasks_total: total,
      completion_pct: total ? Math.round((tasksDone / total) * 100) : 0,
      incomplete,
    }
  })

  const combined: Record<string, unknown>[] = []
  for (const person of people) {
    const id = person._id.toString()
    const records = attendanceByUser.get(id) ?? []
    const logs = workByUser.get(id) ?? []
    const dates = new Set([...records.map((r) => r.date), ...logs.map((l) => l.date)])
    for (const date of [...dates].sort()) {
      const record = records.find((r) => r.date === date)
      const dayLogs = logs.filter((l) => l.date === date)
      combined.push({
        user_id: id,
        name: person.fullName,
        designation: person.designation ?? "Unassigned",
        date,
        sign_in: record?.checkIn?.toISOString() ?? "",
        sign_out: record?.checkOut?.toISOString() ?? "",
        hours: record?.totalHours ?? hoursBetween(record?.checkIn?.toISOString(), record?.checkOut?.toISOString()) ?? "",
        status: record?.status ?? "absent",
        tasks_done: dayLogs.filter((l) => l.status === "done").length,
        tasks_not_done: dayLogs.filter((l) => l.status === "not_done" || l.status === "blocked").length,
        work_summary: dayLogs.map((l) => `${l.title} (${l.status.replace("_", " ")})`).join("; "),
      })
    }
  }

  const designationMap = new Map<string, { designation: string; done: number; total: number }>()
  for (const row of work) {
    const key = String(row.designation)
    const current = designationMap.get(key) ?? { designation: key, done: 0, total: 0 }
    current.done += Number(row.tasks_done)
    current.total += Number(row.tasks_total)
    designationMap.set(key, current)
  }
  const designation = [...designationMap.values()].map((row) => ({
    designation: row.designation,
    work_completion_pct: row.total ? Math.round((row.done / row.total) * 100) : 0,
  }))

  return { start, end, attendance, work, combined, designation }
}
