import { LogIn, LogOut, ClipboardList, UserPlus, Clock } from "lucide-react"
import Link from "next/link"
import { getProfile } from "@/lib/auth/session"
import { getTodayAttendance, getOverviewStats, getMissingWorkLogsToday } from "@/actions/attendance"
import { getWorkLogs } from "@/actions/work-logs"
import { AttendanceWidget } from "@/components/dashboard/attendance-widget"
import { StatsCards } from "@/components/dashboard/stats-cards"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { hasMinimumRole } from "@/lib/auth/roles"
import { ATTENDANCE_COLORS } from "@/lib/dashboard/utils"

export default async function DashboardPage() {
  const profile = await getProfile()
  if (!profile) return null

  const canManage = hasMinimumRole(profile.role, "manager")
  const [todayRecord, workLogs, stats, missing] = await Promise.all([
    getTodayAttendance(),
    getWorkLogs(),
    canManage ? getOverviewStats() : Promise.resolve(null),
    canManage ? getMissingWorkLogsToday() : Promise.resolve([]),
  ])

  const overviewStats = stats
    ? [
        { title: "Currently signed in", value: stats.signedIn, icon: LogIn, description: "Employees + students" },
        { title: "Not yet signed in", value: stats.notYetSignedIn, icon: Clock, description: "Absent / not arrived" },
        { title: "Signed out", value: stats.signedOut, icon: LogOut },
        { title: "Missing work logs", value: stats.missingWorkLogs, icon: ClipboardList, description: "Signed in, no tasks" },
        { title: "Pending students", value: stats.pendingStudentApprovals, icon: UserPlus },
      ]
    : [
        {
          title: "Today status",
          value: todayRecord?.status?.replace("_", " ") ?? "Not signed in",
          icon: Clock,
        },
      ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
          Welcome back, {profile.fullName.split(" ")[0] ?? "there"}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          Sign In when you arrive, Sign Out when you leave. Timezone: Asia/Karachi.
        </p>
      </div>

      <StatsCards stats={overviewStats} />

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <AttendanceWidget todayRecord={todayRecord} />

        <Card>
          <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <CardTitle className="text-base">Today&apos;s work</CardTitle>
            <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
              <Link href="/dashboard/work-log">Open work log</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {todayRecord?.checkIn && workLogs.length === 0 && (
              <p className="text-sm text-amber-700 dark:text-amber-300">
                You signed in. Log what you did today.
              </p>
            )}
            {workLogs.slice(0, 4).map((log) => (
              <div key={log.id} className="flex items-center justify-between gap-2 text-sm">
                <span className="min-w-0 truncate">{log.title}</span>
                <Badge variant="outline" className={ATTENDANCE_COLORS[log.status === "done" ? "present" : "absent"]}>
                  {log.status.replace("_", " ")}
                </Badge>
              </div>
            ))}
            {!workLogs.length && (
              <p className="text-sm text-muted-foreground">No work logged yet</p>
            )}
          </CardContent>
        </Card>

        {canManage && (
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <CardTitle className="text-base">Missing reports today</CardTitle>
              <Button variant="outline" size="sm" asChild className="w-full sm:w-auto">
                <Link href="/dashboard/attendance/live">Live board</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-2">
              {missing.map((person) => (
                <div key={person.id} className="flex items-center justify-between text-sm">
                  <span>{person.fullName}</span>
                  <Badge variant="outline" className={ATTENDANCE_COLORS.absent}>Missing work log</Badge>
                </div>
              ))}
              {!missing.length && (
                <p className="text-sm text-muted-foreground">Everyone who signed in has logged work</p>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
