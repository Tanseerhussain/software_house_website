import { getProfile } from "@/lib/auth/session"
import { getLeaveRequests } from "@/actions/leave"
import { LeavePageClient } from "@/components/dashboard/leave-page-client"

export default async function LeavePage() {
  const profile = await getProfile()
  if (!profile) return null
  const requests = await getLeaveRequests()
  return <LeavePageClient initialRequests={requests} role={profile.role} />
}
