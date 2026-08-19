import type { ObjectId } from "mongodb"
import type { UserRole } from "@/lib/auth/roles"

export type ApprovalStatus = "pending" | "approved" | "rejected"
export type AttendanceStatus = "present" | "late" | "absent" | "remote" | "half_day" | "on_leave"
export type WorkMode = "office" | "remote" | "hybrid"
export type WorkLogStatus = "done" | "in_progress" | "not_done" | "blocked"
export type LeaveType = "sick" | "casual" | "annual" | "unpaid" | "short"
export type LeaveStatus = "pending" | "approved" | "rejected" | "cancelled"
export type PresenceStatus = "in" | "out" | "not_arrived" | "on_leave"

export interface UserDoc {
  _id: ObjectId
  email: string
  passwordHash: string
  fullName: string
  role: UserRole
  designation: string | null
  phone: string | null
  courseProgram: string | null
  salary: number | null
  approvalStatus: ApprovalStatus
  avatarUrl: string | null
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface Profile {
  id: string
  email: string
  fullName: string
  role: UserRole
  designation: string | null
  phone: string | null
  courseProgram: string | null
  salary: number | null
  approvalStatus: ApprovalStatus
  avatarUrl: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface AttendanceDoc {
  _id: ObjectId
  userId: string
  date: string
  checkIn: Date | null
  checkOut: Date | null
  status: AttendanceStatus
  workMode: WorkMode
  totalHours: number | null
  notes: string | null
  createdAt: Date
  updatedAt: Date
}

export interface Attendance {
  id: string
  userId: string
  date: string
  checkIn: string | null
  checkOut: string | null
  status: AttendanceStatus
  workMode: WorkMode
  totalHours: number | null
  notes: string | null
}

export interface WorkLogDoc {
  _id: ObjectId
  userId: string
  date: string
  title: string
  description: string | null
  status: WorkLogStatus
  planned: boolean
  hoursSpent: number | null
  createdAt: Date
  updatedAt: Date
}

export interface WorkLog {
  id: string
  userId: string
  date: string
  title: string
  description: string | null
  status: WorkLogStatus
  planned: boolean
  hoursSpent: number | null
  createdAt: string
}

export interface LeaveRequestDoc {
  _id: ObjectId
  userId: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  startTime: string | null
  endTime: string | null
  reason: string
  status: LeaveStatus
  createdAt: Date
  updatedAt: Date
}

export interface LeaveRequest {
  id: string
  userId: string
  leaveType: LeaveType
  startDate: string
  endDate: string
  startTime: string | null
  endTime: string | null
  reason: string
  status: LeaveStatus
  createdAt: string
  profile?: Pick<Profile, "id" | "fullName" | "email" | "designation" | "role">
}

export interface LiveBoardPerson {
  id: string
  fullName: string
  email: string
  role: UserRole
  designation: string | null
  presence: PresenceStatus
  attendance: Attendance | null
  workLogCount: number
}

export interface DesignationGroup {
  designation: string
  total: number
  in: number
  out: number
  not_arrived: number
  on_leave: number
  people: LiveBoardPerson[]
}

export interface OverviewStats {
  signedIn: number
  notYetSignedIn: number
  signedOut: number
  missingWorkLogs: number
  pendingStudentApprovals: number
  onLeave: number
}
