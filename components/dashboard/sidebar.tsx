"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Clock,
  Users,
  CalendarDays,
  BarChart3,
  UserCircle,
  ClipboardList,
  GraduationCap,
  Wallet,
  Radio,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  useSidebar,
} from "@/components/ui/sidebar"
import type { UserRole } from "@/lib/auth/roles"
import { hasMinimumRole } from "@/lib/auth/roles"

const navItems = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Attendance", href: "/dashboard/attendance", icon: Clock },
  { title: "Live board", href: "/dashboard/attendance/live", icon: Radio, minRole: "manager" as UserRole },
  { title: "By designation", href: "/dashboard/attendance/by-designation", icon: Users, minRole: "manager" as UserRole },
  { title: "Work log", href: "/dashboard/work-log", icon: ClipboardList },
  { title: "Leave", href: "/dashboard/leave", icon: CalendarDays },
  { title: "Reports", href: "/dashboard/reports", icon: BarChart3 },
  { title: "Students", href: "/dashboard/students", icon: GraduationCap, minRole: "hr" as UserRole },
  { title: "Staff & salary", href: "/dashboard/staff", icon: Wallet, minRole: "hr" as UserRole },
  { title: "Profile", href: "/dashboard/profile", icon: UserCircle },
]

export function DashboardSidebar({ role }: { role: UserRole }) {
  const pathname = usePathname()
  const { setOpenMobile } = useSidebar()

  const visibleItems = navItems.filter((item) => {
    if (item.minRole) return hasMinimumRole(role, item.minRole)
    return true
  })

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border px-4 py-4">
        <Link href="/dashboard" className="flex items-center gap-2 font-semibold">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-sm font-bold">
            A
          </div>
          <span className="group-data-[collapsible=icon]:hidden">APPRIC Portal</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleItems.map((item) => {
                const isActive =
                  item.href === "/dashboard"
                    ? pathname === "/dashboard"
                    : item.href === "/dashboard/attendance"
                      ? pathname === "/dashboard/attendance"
                      : pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive} tooltip={item.title}>
                      <Link href={item.href} onClick={() => setOpenMobile(false)}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-4">
        <Link
          href="/"
          onClick={() => setOpenMobile(false)}
          className="text-xs text-muted-foreground hover:text-foreground group-data-[collapsible=icon]:hidden"
        >
          ← Back to website
        </Link>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
