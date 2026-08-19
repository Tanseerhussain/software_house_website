import { getProfile } from "@/lib/auth/session"
import { getLiveAttendanceBoard } from "@/actions/attendance"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { LiveAttendanceBoard } from "@/components/dashboard/live-attendance-board"
import { getTodayInTimezone } from "@/lib/dashboard/utils"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default async function LiveAttendancePage() {
  const profile = await getProfile()
  if (!profile) return null

  const date = getTodayInTimezone()
  const people = await getLiveAttendanceBoard(date)

  return (
    <RoleGuard role={profile.role} minRole="manager">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Live attendance</h1>
          <p className="text-muted-foreground">Who is signed in, signed out, or not yet arrived</p>
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Board</CardTitle>
          </CardHeader>
          <CardContent>
            <LiveAttendanceBoard initialPeople={people} date={date} />
          </CardContent>
        </Card>
      </div>
    </RoleGuard>
  )
}
