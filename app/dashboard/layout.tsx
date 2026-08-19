import { redirect } from "next/navigation"
import { getProfile } from "@/lib/auth/session"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { DashboardSidebar } from "@/components/dashboard/sidebar"
import { DashboardNavbar } from "@/components/dashboard/navbar"
import { DashboardProviders } from "@/components/dashboard/providers"
import { getPendingLeaveCount } from "@/actions/leave"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getProfile()
  if (!profile) redirect("/auth/login")
  if (profile.approvalStatus === "pending") redirect("/auth/pending-approval")
  if (profile.approvalStatus === "rejected") redirect("/auth/login")

  const pendingLeave = await getPendingLeaveCount().catch(() => 0)

  return (
    <DashboardProviders>
      <SidebarProvider>
        <DashboardSidebar role={profile.role} />
        <SidebarInset>
          <DashboardNavbar
            profile={{
              fullName: profile.fullName,
              email: profile.email,
              avatarUrl: profile.avatarUrl,
              role: profile.role,
            }}
            pendingLeave={pendingLeave}
          />
          <main className="min-w-0 flex-1 overflow-x-hidden p-3 sm:p-4 md:p-6">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </DashboardProviders>
  )
}
