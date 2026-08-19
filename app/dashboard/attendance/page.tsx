import { getProfile } from "@/lib/auth/session"
import { getTodayAttendance, getAttendanceHistory, getCompanyAttendance } from "@/actions/attendance"
import { getWorkLogs } from "@/actions/work-logs"
import { CheckInButton } from "@/components/dashboard/check-in-button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ATTENDANCE_COLORS, formatDate, formatDateTime, formatHours } from "@/lib/dashboard/utils"
import Link from "next/link"
import { hasMinimumRole } from "@/lib/auth/roles"

export default async function AttendancePage() {
  const profile = await getProfile()
  if (!profile) return null

  const now = new Date()
  const month = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`
  const canManage = hasMinimumRole(profile.role, "manager")

  const [todayRecord, history, companyData, workLogs] = await Promise.all([
    getTodayAttendance(),
    getAttendanceHistory(month),
    ["admin", "hr"].includes(profile.role) ? getCompanyAttendance() : Promise.resolve([]),
    getWorkLogs(),
  ])

  const presentDays = history.filter((h) => ["present", "late", "remote"].includes(h.status)).length
  const lateDays = history.filter((h) => h.status === "late").length
  const totalHours = history.reduce((sum, h) => sum + (h.totalHours ?? 0), 0)
  const signedInNoWork = !!todayRecord?.checkIn && workLogs.length === 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Attendance</h1>
          <p className="text-muted-foreground">Sign In when you arrive, Sign Out when you leave (Asia/Karachi)</p>
        </div>
        {canManage && (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" asChild>
              <Link href="/dashboard/attendance/live">Live board</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard/attendance/by-designation">By designation</Link>
            </Button>
          </div>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sign In / Sign Out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <CheckInButton todayRecord={todayRecord} />
          {signedInNoWork && (
            <p className="text-sm text-amber-700 dark:text-amber-300">
              You signed in. Log today&apos;s work on{" "}
              <Link href="/dashboard/work-log" className="underline">Work log</Link>.
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Present days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{presentDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Late days</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-amber-600">{lateDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total hours</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{formatHours(totalHours)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">This month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {history.map((record) => (
              <div
                key={record.id}
                className={`flex h-10 w-10 items-center justify-center rounded-md border text-xs font-medium ${ATTENDANCE_COLORS[record.status]}`}
                title={`${record.date}: ${record.status}`}
              >
                {new Date(record.date).getDate()}
              </div>
            ))}
            {!history.length && (
              <p className="text-sm text-muted-foreground">No attendance records this month</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your history</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sign In</TableHead>
                  <TableHead>Sign Out</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {history.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{formatDate(record.date)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ATTENDANCE_COLORS[record.status]}>
                        {record.status.replace("_", " ")}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.checkIn ? formatDateTime(record.checkIn) : "—"}</TableCell>
                    <TableCell>{record.checkOut ? formatDateTime(record.checkOut) : "—"}</TableCell>
                    <TableCell>{formatHours(record.totalHours)}</TableCell>
                  </TableRow>
                ))}
                {!history.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No records yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {["admin", "hr"].includes(profile.role) && companyData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Company attendance today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Person</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Sign In</TableHead>
                  <TableHead>Hours</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {companyData.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell>{record.profile?.fullName ?? record.userId.slice(0, 8)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={ATTENDANCE_COLORS[record.status]}>
                        {record.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{record.checkIn ? formatDateTime(record.checkIn) : "—"}</TableCell>
                    <TableCell>{formatHours(record.totalHours)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
