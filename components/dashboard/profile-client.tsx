"use client"

import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"
import { changePasswordAction, updateProfileAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatCurrencyPKR } from "@/lib/dashboard/utils"
import { getRoleLabel } from "@/lib/auth/roles"
import type { Profile } from "@/lib/types"

export function ProfileClient({ profile }: { profile: Profile }) {
  const [isPending, startTransition] = useTransition()

  const handleProfile = (formData: FormData) => {
    startTransition(async () => {
      const result = await updateProfileAction(formData)
      if (result.error) toast.error(result.error)
      else toast.success("Profile updated")
    })
  }

  const handlePassword = (formData: FormData) => {
    startTransition(async () => {
      const result = await changePasswordAction(formData)
      if (result.error) toast.error(result.error)
      else toast.success("Password changed")
    })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Your details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{getRoleLabel(profile.role)}</Badge>
            <Badge variant="outline">{profile.designation ?? "Unassigned"}</Badge>
            <Badge variant="outline">{profile.approvalStatus}</Badge>
          </div>
          {profile.salary != null && (
            <p className="text-sm text-muted-foreground">Salary: {formatCurrencyPKR(profile.salary)}</p>
          )}
          <form action={handleProfile} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" defaultValue={profile.fullName} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" value={profile.email} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={profile.phone ?? ""} />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save profile
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Change password</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handlePassword} className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current password</Label>
              <Input id="currentPassword" name="currentPassword" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="newPassword">New password</Label>
              <Input id="newPassword" name="newPassword" type="password" minLength={8} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm password</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Update password
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
