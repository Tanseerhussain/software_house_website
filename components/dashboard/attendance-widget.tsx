import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckInButton } from "./check-in-button"
import type { Attendance } from "@/lib/types"
import { ATTENDANCE_COLORS } from "@/lib/dashboard/utils"

export function AttendanceWidget({ todayRecord }: { todayRecord: Attendance | null }) {
  const status = todayRecord?.status ?? "absent"

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between pb-2">
        <CardTitle className="text-base font-medium">Today&apos;s Attendance</CardTitle>
        <Badge variant="outline" className={ATTENDANCE_COLORS[status]}>
          {status.replace("_", " ")}
        </Badge>
      </CardHeader>
      <CardContent>
        <CheckInButton todayRecord={todayRecord} />
        <Link
          href="/dashboard/attendance"
          className="mt-4 inline-block text-sm text-muted-foreground hover:text-foreground"
        >
          View attendance history →
        </Link>
      </CardContent>
    </Card>
  )
}
