"use client"

import { useEffect, useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { getRoleLabel, type UserRole } from "@/lib/auth/roles"
import { formatTime, formatHours, hoursBetween, ATTENDANCE_COLORS } from "@/lib/dashboard/utils"
import { PRESENCE_LABELS, presenceColor } from "@/lib/dashboard/presence"
import type { LiveBoardPerson, PresenceStatus } from "@/lib/types"

export function LiveAttendanceBoard({ initialPeople, date }: { initialPeople: LiveBoardPerson[]; date: string }) {
  const router = useRouter()
  const [people, setPeople] = useState(initialPeople)
  const [search, setSearch] = useState("")
  const [role, setRole] = useState<"all" | "employee" | "student">("all")
  const [designation, setDesignation] = useState("all")
  const [status, setStatus] = useState<"all" | PresenceStatus>("all")
  const [, startTransition] = useTransition()

  useEffect(() => {
    setPeople(initialPeople)
  }, [initialPeople])

  useEffect(() => {
    const timer = setInterval(() => {
      startTransition(() => router.refresh())
    }, 15000)
    return () => clearInterval(timer)
  }, [router])

  const designations = useMemo(
    () => [...new Set(people.map((p) => p.designation?.trim() || "Unassigned"))].sort(),
    [people]
  )

  const filtered = people.filter((person) => {
    const q = search.trim().toLowerCase()
    if (q && !`${person.fullName} ${person.email}`.toLowerCase().includes(q)) return false
    if (role === "student" && person.role !== "student") return false
    if (role === "employee" && person.role === "student") return false
    if (designation !== "all" && (person.designation?.trim() || "Unassigned") !== designation) return false
    if (status !== "all" && person.presence !== status) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1">
          <Label htmlFor="live-search">Search</Label>
          <Input
            id="live-search"
            placeholder="Name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="space-y-1">
          <Label>Role</Label>
          <Select value={role} onValueChange={(v) => setRole(v as typeof role)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="employee">Employees</SelectItem>
              <SelectItem value="student">Students</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Designation</Label>
          <Select value={designation} onValueChange={setDesignation}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {designations.map((d) => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1">
          <Label>Status</Label>
          <Select value={status} onValueChange={(v) => setStatus(v as typeof status)}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="in">Signed In</SelectItem>
              <SelectItem value="out">Signed Out</SelectItem>
              <SelectItem value="not_arrived">Not yet signed in</SelectItem>
              <SelectItem value="on_leave">On leave</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Live board for {date} (Asia/Karachi). Refreshes every 15 seconds.
      </p>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Designation</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Sign In</TableHead>
              <TableHead>Sign Out</TableHead>
              <TableHead>Hours</TableHead>
              <TableHead>Work log</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((person) => {
              const hours =
                person.attendance?.totalHours ??
                hoursBetween(person.attendance?.checkIn, person.attendance?.checkOut)
              return (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.fullName}</TableCell>
                  <TableCell>{getRoleLabel(person.role as UserRole)}</TableCell>
                  <TableCell>{person.designation ?? "—"}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className={presenceColor(person.presence)}>
                      {PRESENCE_LABELS[person.presence]}
                    </Badge>
                    {person.attendance?.status && person.presence !== "not_arrived" && (
                      <Badge variant="outline" className={`ml-1 ${ATTENDANCE_COLORS[person.attendance.status]}`}>
                        {person.attendance.status.replace("_", " ")}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{person.attendance?.checkIn ? formatTime(person.attendance.checkIn) : "—"}</TableCell>
                  <TableCell>{person.attendance?.checkOut ? formatTime(person.attendance.checkOut) : "—"}</TableCell>
                  <TableCell>{formatHours(hours)}</TableCell>
                  <TableCell>
                    {person.workLogCount > 0 ? (
                      <Badge variant="outline" className={ATTENDANCE_COLORS.present}>
                        {person.workLogCount} task{person.workLogCount === 1 ? "" : "s"}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className={ATTENDANCE_COLORS.absent}>
                        Missing
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
            {!filtered.length && (
              <TableRow>
                <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                  No people match these filters
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
