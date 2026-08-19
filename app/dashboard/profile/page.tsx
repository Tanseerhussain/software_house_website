import { getProfile } from "@/lib/auth/session"
import { ProfileClient } from "@/components/dashboard/profile-client"

export default async function ProfilePage() {
  const profile = await getProfile()
  if (!profile) return null

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Your account details</p>
      </div>
      <ProfileClient profile={profile} />
    </div>
  )
}
