"use client"

import { useState, useTransition } from "react"
import { Loader2 } from "lucide-react"
import { toast } from "sonner"
import { createStaff, updateStaffSalary } from "@/actions/staff"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { formatCurrencyPKR } from "@/lib/dashboard/utils"
import { getRoleLabel } from "@/lib/auth/roles"
import type { Profile } from "@/lib/types"

export function StaffClient({ staff, canEditSalary }: { staff: Profile[]; canEditSalary: boolean }) {
  const [isPending, startTransition] = useTransition()
  const [role, setRole] = useState("employee")
  const [filter, setFilter] = useState("")

  const handleCreate = (formData: FormData) => {
    formData.set("role", role)
    startTransition(async () => {
      const result = await createStaff(formData)
      if (result.error) toast.error(result.error)
      else toast.success("Staff member created")
    })
  }

  const handleSalary = (id: string, value: string) => {
    const salary = value.trim() === "" ? null : Number(value)
    if (salary != null && Number.isNaN(salary)) {
      toast.error("Invalid salary")
      return
    }
    startTransition(async () => {
      const result = await updateStaffSalary(id, salary)
      if (result.error) toast.error(result.error)
      else toast.success("Salary updated")
    })
  }

  const visible = staff.filter((s) =>
    `${s.fullName} ${s.email} ${s.designation ?? ""}`.toLowerCase().includes(filter.trim().toLowerCase())
  )

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add staff</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <Input id="fullName" name="fullName" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" name="password" type="password" minLength={8} required />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="employee">Employee</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="designation">Designation</Label>
              <Input id="designation" name="designation" placeholder="Frontend / Intern / Backend" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Salary (PKR)</Label>
              <Input id="salary" name="salary" type="number" min="0" />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create staff
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-base">Staff salaries</CardTitle>
          <Input className="w-full sm:max-w-xs" placeholder="Search staff" value={filter} onChange={(e) => setFilter(e.target.value)} />
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Designation</TableHead>
                  <TableHead>Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((person) => (
                  <TableRow key={person.id}>
                    <TableCell>
                      <p className="font-medium">{person.fullName}</p>
                      <p className="text-xs text-muted-foreground">{person.email}</p>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{getRoleLabel(person.role)}</Badge>
                    </TableCell>
                    <TableCell>{person.designation ?? "—"}</TableCell>
                    <TableCell>
                      {canEditSalary ? (
                        <form
                          className="flex min-w-[180px] flex-col gap-2 sm:flex-row"
                          onSubmit={(e) => {
                            e.preventDefault()
                            const value = new FormData(e.currentTarget).get("salary")?.toString() ?? ""
                            handleSalary(person.id, value)
                          }}
                        >
                          <Input name="salary" type="number" min="0" defaultValue={person.salary ?? ""} />
                          <Button type="submit" size="sm" variant="outline" disabled={isPending}>Save</Button>
                        </form>
                      ) : (
                        formatCurrencyPKR(person.salary)
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!visible.length && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No staff yet
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
