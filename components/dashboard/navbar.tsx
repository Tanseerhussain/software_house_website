"use client"

import { LogOut, Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import Link from "next/link"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { getRoleLabel, getRoleBadgeVariant } from "@/lib/auth/roles"
import type { UserRole } from "@/lib/auth/roles"
import { logoutAction } from "@/actions/auth"

interface DashboardNavbarProps {
  profile: {
    fullName: string | null
    email: string
    avatarUrl: string | null
    role: UserRole
  }
  pendingLeave?: number
}

export function DashboardNavbar({ profile, pendingLeave = 0 }: DashboardNavbarProps) {
  const { resolvedTheme, setTheme } = useTheme()
  const initials = (profile.fullName ?? profile.email)
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  return (
    <header className="sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 px-3 backdrop-blur sm:px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-1 hidden h-4 sm:block" />
      <div className="flex min-w-0 flex-1 items-center justify-end gap-1 sm:gap-2">
        {pendingLeave > 0 && (
          <Button variant="outline" size="sm" asChild className="shrink-0">
            <Link href="/dashboard/leave">
              <span className="sm:hidden">{pendingLeave}</span>
              <span className="hidden sm:inline">{pendingLeave} pending leave</span>
            </Link>
          </Button>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="relative shrink-0"
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
        >
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild id="dashboard-user-menu">
            <Button variant="ghost" className="relative h-9 min-w-0 gap-2 px-1.5 sm:px-2">
              <Avatar className="h-7 w-7 shrink-0">
                <AvatarImage src={profile.avatarUrl ?? undefined} alt={profile.fullName ?? ""} />
                <AvatarFallback className="text-xs">{initials}</AvatarFallback>
              </Avatar>
              <span className="hidden max-w-[140px] truncate text-sm font-medium lg:inline-block">
                {profile.fullName ?? profile.email}
              </span>
              <Badge variant={getRoleBadgeVariant(profile.role)} className="hidden sm:inline-flex">
                {getRoleLabel(profile.role)}
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col gap-1">
                <span>{profile.fullName}</span>
                <span className="text-xs font-normal text-muted-foreground">{profile.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={() => logoutAction()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
