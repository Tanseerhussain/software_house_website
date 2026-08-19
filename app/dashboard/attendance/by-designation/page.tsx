import { getProfile } from "@/lib/auth/session"
import { getDesignationBoard } from "@/actions/attendance"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { DesignationBoard } from "@/components/dashboard/designation-board"

export default async function DesignationAttendancePage() {
  const profile = await getProfile()
  if (!profile) return null

  const groups = await getDesignationBoard()

  return (
    <RoleGuard role={profile.role} minRole="manager">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">By designation</h1>
          <p className="text-muted-foreground">
            Frontend / Intern / Student — who is in, who is out, who is absent
          </p>
        </div>
        <DesignationBoard groups={groups} />
      </div>
    </RoleGuard>
  )
}
