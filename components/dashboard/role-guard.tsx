import { redirect } from "next/navigation"
import type { UserRole } from "@/lib/auth/roles"
import { hasMinimumRole } from "@/lib/auth/roles"

interface RoleGuardProps {
  role: UserRole | null | undefined
  minRole: UserRole
  children: React.ReactNode
}

export function RoleGuard({ role, minRole, children }: RoleGuardProps) {
  if (!hasMinimumRole(role, minRole)) {
    redirect("/dashboard")
  }
  return <>{children}</>
}
