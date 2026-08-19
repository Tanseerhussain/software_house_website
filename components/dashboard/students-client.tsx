"use client"

import { useState, useTransition } from "react"
import { Loader2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { inviteStudent, setStudentApproval } from "@/actions/students"
import { formatDateTime } from "@/lib/dashboard/utils"
import type { Profile } from "@/lib/types"

export function StudentsClient({ students }: { students: Profile[] }) {
  const [isPending, startTransition] = useTransition()
  const [filter, setFilter] = useState("")

  const handleInvite = (formData: FormData) => {
    startTransition(async () => {
      const result = await inviteStudent({
        email: formData.get("email")?.toString() ?? "",
        fullName: formData.get("fullName")?.toString() ?? "",
        phone: formData.get("phone")?.toString() || null,
        designation: formData.get("designation")?.toString() || "Student",
        courseProgram: formData.get("courseProgram")?.toString() || null,
        password: formData.get("password")?.toString() || undefined,
      })
      if (result.error) toast.error(result.error)
      else toast.success(`Student invited and approved${result.temporaryPassword ? ` — password: ${result.temporaryPassword}` : ""}`)
    })
  }

  const handleApproval = (id: string, status: "approved" | "rejected") => {
    startTransition(async () => {
      const result = await setStudentApproval(id, status)
      if (result.error) toast.error(result.error)
      else toast.success(status === "approved" ? "Student approved" : "Student rejected")
    })
  }

  const q = filter.trim().toLowerCase()
  const visible = students.filter((s) =>
    `${s.fullName} ${s.email} ${s.designation ?? ""}`.toLowerCase().includes(q)
  )
  const pending = students.filter((s) => s.approvalStatus === "pending").length

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Students</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{students.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Pending approvals</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-amber-600">{pending}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Approved</CardTitle></CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">
              {students.filter((s) => s.approvalStatus === "approved").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Invite student</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleInvite} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" placeholder="Intern / Student" defaultValue="Student" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="courseProgram">Course / program</Label>
              <Input id="courseProgram" name="courseProgram" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password (optional)</Label>
              <Input id="password" name="password" type="password" minLength={8} />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Invite & approve
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Student list</CardTitle>
          <Input
            className="w-full sm:max-w-xs"
            placeholder="Search students"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Approval</TableHead>
                  <TableHead>Joined</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <p className="font-medium">{student.fullName}</p>
                      <p className="text-xs text-muted-foreground">{student.email}</p>
                    </TableCell>
                    <TableCell>{student.designation ?? "Student"}</TableCell>
                    <TableCell>{student.courseProgram ?? "—"}</TableCell>
                    <TableCell>
                      <Badge variant={student.approvalStatus === "approved" ? "outline" : "secondary"}>
                        {student.approvalStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(student.createdAt)}
                    </TableCell>
                    <TableCell>
                      {student.approvalStatus === "pending" && (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" disabled={isPending} onClick={() => handleApproval(student.id, "approved")}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="icon" variant="ghost" disabled={isPending} onClick={() => handleApproval(student.id, "rejected")}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!visible.length && (
                  <TableRow>
                    <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">
                      No students yet
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
