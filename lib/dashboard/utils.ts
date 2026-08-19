import { format, parseISO } from "date-fns"

export const DEFAULT_TIMEZONE = "Asia/Karachi"
export const WORK_START_TIME = "09:00"
export const WORK_END_TIME = "18:00"
export const LATE_THRESHOLD_MINUTES = 15

export function getTodayInTimezone(timezone = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date())
}

export function getTimeInTimezone(timezone = DEFAULT_TIMEZONE): string {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(new Date())
}

export function formatDate(date: string | Date, fmt = "MMM d, yyyy"): string {
  const d = typeof date === "string" ? parseISO(date) : date
  if (Number.isNaN(d.getTime())) return "—"
  return format(d, fmt)
}

export function formatDateTime(date: string | Date, timezone = DEFAULT_TIMEZONE): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d)
}

export function formatTime(date: string | Date, timezone = DEFAULT_TIMEZONE): string {
  const d = typeof date === "string" ? new Date(date) : date
  if (Number.isNaN(d.getTime())) return "—"
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(d)
}

export function hoursBetween(start: string | null | undefined, end?: string | null): number | null {
  if (!start) return null
  const a = new Date(start).getTime()
  const b = end ? new Date(end).getTime() : Date.now()
  if (Number.isNaN(a) || Number.isNaN(b) || b < a) return null
  return Math.round(((b - a) / 3_600_000) * 100) / 100
}

export function formatHours(hours: number | null | undefined): string {
  if (hours == null) return "—"
  return `${hours.toFixed(1)}h`
}

export function formatCurrencyPKR(amount: number | null | undefined): string {
  if (amount == null) return "—"
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount)
}

export const ATTENDANCE_COLORS: Record<string, string> = {
  present: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  late: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
  half_day: "bg-orange-500/15 text-orange-700 dark:text-orange-400 border-orange-500/30",
  absent: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  remote: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  on_leave: "bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30",
  in: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  out: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
  not_arrived: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  signed_in: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  signed_out: "bg-slate-500/15 text-slate-700 dark:text-slate-300 border-slate-500/30",
}

export const WORK_LOG_COLORS: Record<string, string> = {
  done: "bg-green-500/15 text-green-700 dark:text-green-400 border-green-500/30",
  in_progress: "bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30",
  not_done: "bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/30",
  blocked: "bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30",
}

export function startOfWeekISO(timezone = DEFAULT_TIMEZONE): string {
  const today = getTodayInTimezone(timezone)
  const d = parseISO(today)
  const day = d.getUTCDay() || 7
  d.setUTCDate(d.getUTCDate() - day + 1)
  return d.toISOString().slice(0, 10)
}

export function startOfMonthISO(timezone = DEFAULT_TIMEZONE): string {
  const today = getTodayInTimezone(timezone)
  return `${today.slice(0, 7)}-01`
}

export function datesInRange(start: string, end: string): string[] {
  const dates: string[] = []
  const cursor = parseISO(start)
  const last = parseISO(end)
  while (cursor.getTime() <= last.getTime()) {
    dates.push(cursor.toISOString().slice(0, 10))
    cursor.setUTCDate(cursor.getUTCDate() + 1)
  }
  return dates
}

export function determineCheckInStatus(
  timezone = DEFAULT_TIMEZONE,
  workStart = WORK_START_TIME,
  threshold = LATE_THRESHOLD_MINUTES
): "present" | "late" {
  const [startHour, startMin] = workStart.split(":").map(Number)
  const lateMinutes = startHour * 60 + startMin + threshold
  const currentTime = getTimeInTimezone(timezone)
  const [curHour, curMin] = currentTime.split(":").map(Number)
  return curHour * 60 + curMin > lateMinutes ? "late" : "present"
}

export function isEarlyCheckOut(timezone = DEFAULT_TIMEZONE, workEnd = WORK_END_TIME): boolean {
  const [endHour, endMin] = workEnd.split(":").map(Number)
  const currentTime = getTimeInTimezone(timezone)
  const [curHour, curMin] = currentTime.split(":").map(Number)
  return curHour * 60 + curMin < endHour * 60 + endMin - 60
}
