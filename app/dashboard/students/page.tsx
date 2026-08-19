import { getProfile } from "@/lib/auth/session"
import { getStudents } from "@/actions/students"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { StudentsClient } from "@/components/dashboard/students-client"

export default async function StudentsPage() {
  const profile = await getProfile()
  if (!profile) return null

  const students = await getStudents()

  return (
    <RoleGuard role={profile.role} minRole="hr">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">Students</h1>
          <p className="text-muted-foreground">
            Approve registrations, then students use the same Sign In / Sign Out flow
          </p>
        </div>
        <StudentsClient students={students} />
      </div>
    </RoleGuard>
  )
}
