import type { Attendance, PresenceStatus } from "@/lib/types"
import { ATTENDANCE_COLORS } from "./utils"

export const PRESENCE_LABELS: Record<PresenceStatus, string> = {
  in: "Signed In",
  out: "Signed Out",
  not_arrived: "Not yet signed in",
  on_leave: "On leave",
}

export function getPresenceStatus(
  attendance: Pick<Attendance, "checkIn" | "checkOut" | "status"> | null | undefined,
  onLeave = false
): PresenceStatus {
  if (onLeave || attendance?.status === "on_leave") return "on_leave"
  if (attendance?.checkIn && !attendance.checkOut) return "in"
  if (attendance?.checkIn && attendance.checkOut) return "out"
  return "not_arrived"
}

export function presenceColor(status: PresenceStatus): string {
  return ATTENDANCE_COLORS[status] ?? ATTENDANCE_COLORS.absent
}
