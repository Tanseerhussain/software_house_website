import { getProfile } from "@/lib/auth/session"
import { getStaff } from "@/actions/staff"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { StaffClient } from "@/components/dashboard/staff-client"
import { canReadSalary } from "@/lib/auth/roles"

export default async function StaffPage() {
  const profile = await getProfile()
  if (!profile) return null
  const staff = await getStaff()

  return (
    <RoleGuard role={profile.role} minRole="hr">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Staff & salary</h1>
          <p className="text-muted-foreground">Create employees and view salaries (PKR)</p>
        </div>
        <StaffClient staff={staff} canEditSalary={canReadSalary(profile.role)} />
      </div>
    </RoleGuard>
  )
}
