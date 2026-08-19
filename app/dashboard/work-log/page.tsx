import { getProfile } from "@/lib/auth/session"
import { getTodayAttendance } from "@/actions/attendance"
import { getWorkLogs } from "@/actions/work-logs"
import { WorkLogClient } from "@/components/dashboard/work-log-client"
import { getTodayInTimezone } from "@/lib/dashboard/utils"

export default async function WorkLogPage() {
  const profile = await getProfile()
  if (!profile) return null

  const [todayRecord, logs] = await Promise.all([getTodayAttendance(), getWorkLogs()])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Daily work log</h1>
        <p className="text-muted-foreground">After Sign In, record what you did and what is still pending</p>
      </div>
      <WorkLogClient logs={logs} signedIn={!!todayRecord?.checkIn} date={getTodayInTimezone()} />
    </div>
  )
}
