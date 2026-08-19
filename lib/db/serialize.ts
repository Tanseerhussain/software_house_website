import type { Attendance, AttendanceDoc, LeaveRequest, LeaveRequestDoc, Profile, UserDoc, WorkLog, WorkLogDoc } from "@/lib/types"

function iso(value: Date | string | null | undefined): string | null {
  if (!value) return null
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return null
  return d.toISOString()
}

export function serializeUser(doc: UserDoc, includeSalary = false): Profile {
  return {
    id: doc._id.toString(),
    email: doc.email,
    fullName: doc.fullName,
    role: doc.role,
    designation: doc.designation,
    phone: doc.phone,
    courseProgram: doc.courseProgram,
    salary: includeSalary ? doc.salary : null,
    approvalStatus: doc.approvalStatus,
    avatarUrl: doc.avatarUrl,
    isActive: doc.isActive,
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
    updatedAt: iso(doc.updatedAt) ?? new Date().toISOString(),
  }
}

export function serializeAttendance(doc: AttendanceDoc): Attendance {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    date: doc.date,
    checkIn: iso(doc.checkIn),
    checkOut: iso(doc.checkOut),
    status: doc.status,
    workMode: doc.workMode,
    totalHours: doc.totalHours,
    notes: doc.notes,
  }
}

export function serializeWorkLog(doc: WorkLogDoc): WorkLog {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    date: doc.date,
    title: doc.title,
    description: doc.description,
    status: doc.status,
    planned: doc.planned,
    hoursSpent: doc.hoursSpent,
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
  }
}

export function serializeLeave(doc: LeaveRequestDoc): LeaveRequest {
  return {
    id: doc._id.toString(),
    userId: doc.userId,
    leaveType: doc.leaveType,
    startDate: doc.startDate,
    endDate: doc.endDate,
    startTime: doc.startTime,
    endTime: doc.endTime,
    reason: doc.reason,
    status: doc.status,
    createdAt: iso(doc.createdAt) ?? new Date().toISOString(),
  }
}
