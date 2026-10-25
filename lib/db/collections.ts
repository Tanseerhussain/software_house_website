import { ObjectId, type Collection } from "mongodb"
import { connectToDatabase } from "@/lib/mongodb"
import type { AttendanceDoc, LeaveRequestDoc, UserDoc, WorkLogDoc } from "@/lib/types"

export const COLLECTIONS = {
  users: "portal_users",
  attendance: "portal_attendance",
  workLogs: "portal_work_logs",
  leaveRequests: "portal_leave_requests",
  websiteSettings: "website_settings",
  websiteServices: "website_services",
  websitePortfolio: "website_portfolio",
  websiteBlog: "website_blog",
  websiteTeam: "website_team",
  websiteLogos: "website_logos",
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

export async function getWebsiteSettingsCollection() {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection(COLLECTIONS.websiteSettings)
}

export async function getWebsiteServicesCollection() {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection(COLLECTIONS.websiteServices)
}

export async function getWebsitePortfolioCollection() {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection(COLLECTIONS.websitePortfolio)
}

export async function getWebsiteBlogCollection() {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection(COLLECTIONS.websiteBlog)
}

export async function getWebsiteTeamCollection() {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection(COLLECTIONS.websiteTeam)
}

export async function getWebsiteLogosCollection() {
  const { db } = await connectToDatabase()
  await ensureIndexes()
  return db.collection(COLLECTIONS.websiteLogos)
}

export function toObjectId(id: string): ObjectId | null {
  if (!ObjectId.isValid(id)) return null
  return new ObjectId(id)
}

async function createIndexesSafe(
  collectionName: string,
  indexes: Parameters<Collection["createIndexes"]>[0]
) {
  const { db } = await connectToDatabase()
  try {
    await db.collection(collectionName).createIndexes(indexes)
  } catch (error) {
    const code = typeof error === "object" && error && "code" in error ? Number(error.code) : 0
    if (code !== 86 && code !== 85) {
      console.error(`[db] Index setup failed for ${collectionName}`, error)
    }
  }
}

async function ensureIndexes() {
  if (indexesReady) return
  await Promise.all([
    createIndexesSafe(COLLECTIONS.users, [
      { key: { email: 1 }, unique: true },
      { key: { role: 1 } },
      { key: { approvalStatus: 1 } },
      { key: { designation: 1 } },
    ]),
    createIndexesSafe(COLLECTIONS.attendance, [
      { key: { userId: 1, date: 1 }, unique: true },
      { key: { date: 1 } },
    ]),
    createIndexesSafe(COLLECTIONS.workLogs, [
      { key: { userId: 1, date: 1 } },
      { key: { date: 1 } },
    ]),
    createIndexesSafe(COLLECTIONS.leaveRequests, [
      { key: { userId: 1, startDate: 1 } },
      { key: { status: 1 } },
    ]),
    createIndexesSafe(COLLECTIONS.websiteSettings, [{ key: { key: 1 }, unique: true, name: "website_settings_key_unique" }]),
    createIndexesSafe(COLLECTIONS.websiteServices, [{ key: { status: 1, sort_order: 1 }, name: "website_services_status_sort" }]),
    createIndexesSafe(COLLECTIONS.websitePortfolio, [{ key: { status: 1, sort_order: 1 }, name: "website_portfolio_status_sort" }]),
    createIndexesSafe(COLLECTIONS.websiteBlog, [
      { key: { slug: 1 }, name: "website_blog_slug" },
      { key: { status: 1, createdAt: -1 }, name: "website_blog_status_created" },
    ]),
    createIndexesSafe(COLLECTIONS.websiteTeam, [{ key: { status: 1, sort_order: 1 }, name: "website_team_status_sort" }]),
    createIndexesSafe(COLLECTIONS.websiteLogos, [{ key: { status: 1, sort_order: 1 }, name: "website_logos_status_sort" }]),
  ])
  indexesReady = true
}
