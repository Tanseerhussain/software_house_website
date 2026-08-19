import { ObjectId, type Collection } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import type { AttendanceDoc, LeaveRequestDoc, UserDoc, WorkLogDoc } from "@/lib/types"

export const COLLECTIONS = {
  users: "portal_users",
  attendance: "portal_attendance",
  workLogs: "portal_work_logs",
  leaveRequests: "portal_leave_requests",
} as const

let indexesReady = false

export async function getUsersCollection(): Promise<Collection<UserDoc>> {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection<UserDoc>(COLLECTIONS.users)
}

export async function getAttendanceCollection(): Promise<Collection<AttendanceDoc>> {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection<AttendanceDoc>(COLLECTIONS.attendance)
}

export async function getWorkLogsCollection(): Promise<Collection<WorkLogDoc>> {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection<WorkLogDoc>(COLLECTIONS.workLogs)
}

export async function getLeaveCollection(): Promise<Collection<LeaveRequestDoc>> {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection<LeaveRequestDoc>(COLLECTIONS.leaveRequests)
}

export function toObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

async function ensureIndexes() {
  if (indexesReady) return
  const { db } = await connectToDatabase()
  await Promise.all([
    db.collection(COLLECTIONS.users).createIndexes([
      { key: { email: 1 }, unique: true },
      { key: { role: 1 } },
      { key: { approvalStatus: 1 } },
      { key: { designation: 1 } },
    ]),
    db.collection(COLLECTIONS.attendance).createIndexes([
      { key: { userId: 1, date: 1 }, unique: true },
      { key: { date: 1 } },
    ]),
    db.collection(COLLECTIONS.workLogs).createIndexes([
      { key: { userId: 1, date: 1 } },
      { key: { date: 1 } },
    ]),
    db.collection(COLLECTIONS.leaveRequests).createIndexes([
      { key: { userId: 1, startDate: 1 } },
      { key: { status: 1 } },
    ]),
  ])
  indexesReady = true
}
