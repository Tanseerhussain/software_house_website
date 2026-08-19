import Link from "next/link"
import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/session"
import { logoutAction } from "@/actions/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function PendingApprovalPage() {
  const profile = await getProfile()
  if (!profile) redirect("/auth/login")
  if (profile.approvalStatus === "approved") redirect("/dashboard")

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Waiting for approval</CardTitle>
          <CardDescription>
            {profile.approvalStatus === "rejected"
              ? "Your student registration was not approved."
              : "Admin/HR still needs to approve your student account."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-lg border bg-muted/40 p-3 text-sm">
            <p className="font-medium">{profile.fullName}</p>
            <p className="text-muted-foreground">{profile.email}</p>
          </div>
          <p className="text-sm text-muted-foreground">
            After approval you can Sign In / Sign Out and log daily work like employees.
          </p>
          <div className="flex flex-col gap-2">
            <Button asChild variant="outline">
              <Link href="/auth/login">Back to login</Link>
            </Button>
            <form action={logoutAction}>
              <Button type="submit" variant="ghost" className="w-full">
                Sign out
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
