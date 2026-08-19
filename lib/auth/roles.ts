export const ROLES = ["admin", "hr", "manager", "employee", "student"] as const
export type UserRole = (typeof ROLES)[number]

const ROLE_HIERARCHY: Record<UserRole, number> = {
  admin: 4,
  hr: 3,
  manager: 2,
  employee: 1,
  student: 1,
}

const STUDENT_ALLOWED_PREFIXES = [
  "/dashboard/attendance",
  "/dashboard/work-log",
  "/dashboard/leave",
  "/dashboard/profile",
  "/dashboard/reports",
]

export function hasMinimumRole(
  userRole: UserRole | null | undefined,
  requiredRole: UserRole
): boolean {
  if (!userRole) return false
  if (userRole === "student" && requiredRole !== "student") return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function isStaffRole(role: UserRole | null | undefined): boolean {
  return !!role && role !== "student"
}

export function canAccessRoute(
  userRole: UserRole | null | undefined,
  routePrefix: string
): boolean {
  if (!userRole) return false

  if (userRole === "student") {
    if (routePrefix === "/dashboard") return true
    if (routePrefix.startsWith("/dashboard/attendance/live")) return false
    if (routePrefix.startsWith("/dashboard/attendance/by-designation")) return false
    return STUDENT_ALLOWED_PREFIXES.some(
      (p) => routePrefix === p || routePrefix.startsWith(`${p}/`)
    )
  }

  if (routePrefix.startsWith("/dashboard/staff")) {
    return hasMinimumRole(userRole, "hr")
  }
  if (routePrefix.startsWith("/dashboard/students")) {
    return hasMinimumRole(userRole, "hr")
  }
  if (routePrefix.startsWith("/dashboard/attendance/live")) {
    return hasMinimumRole(userRole, "manager")
  }
  if (routePrefix.startsWith("/dashboard/attendance/by-designation")) {
    return hasMinimumRole(userRole, "manager")
  }

  return true
}

export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    admin: "Admin",
    hr: "HR",
    manager: "Manager",
    employee: "Employee",
    student: "Student",
  }
  return labels[role]
}

export function getRoleBadgeVariant(
  role: UserRole
): "default" | "secondary" | "destructive" | "outline" {
  const variants: Record<UserRole, "default" | "secondary" | "destructive" | "outline"> = {
    admin: "destructive",
    hr: "default",
    manager: "secondary",
    employee: "outline",
    student: "secondary",
  }
  return variants[role]
}

export function canReadSalary(role: UserRole | null | undefined): boolean {
  return role === "admin" || role === "hr"
}
