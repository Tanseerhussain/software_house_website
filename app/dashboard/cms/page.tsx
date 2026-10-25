import { getProfile } from "@/lib/auth/session"
import { getCmsDashboard } from "@/actions/cms"
import { RoleGuard } from "@/components/dashboard/role-guard"
import { CmsClient } from "@/components/dashboard/cms-client"

export default async function CmsPage() {
  const profile = await getProfile()
  if (!profile) return null
  const data = await getCmsDashboard()

  return (
    <RoleGuard role={profile.role} minRole="admin">
      <CmsClient data={data} />
    </RoleGuard>
  )
}
