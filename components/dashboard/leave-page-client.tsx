"use client"

import { useEffect, useState, useTransition } from "react"
import { Loader2, Check, X } from "lucide-react"
import { toast } from "sonner"
import { applyLeave, getLeaveRequests, updateLeaveStatus } from "@/actions/leave"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatDate } from "@/lib/dashboard/utils"
import type { LeaveRequest, LeaveType } from "@/lib/types"
import type { UserRole } from "@/lib/auth/roles"

export function LeavePageClient({
  initialRequests,
  role,
}: {
  initialRequests: LeaveRequest[]
  role: UserRole
}) {
  const [requests, setRequests] = useState(initialRequests)
  const [leaveType, setLeaveType] = useState<LeaveType>("casual")
  const [isPending, startTransition] = useTransition()
  const canApprove = ["admin", "hr", "manager"].includes(role)

  useEffect(() => {
    setRequests(initialRequests)
  }, [initialRequests])

  const handleApply = (formData: FormData) => {
    formData.set("leaveType", leaveType)
    startTransition(async () => {
      const result = await applyLeave(formData)
      if (result.error) toast.error(result.error)
      else {
        toast.success("Leave request submitted")
        setRequests(await getLeaveRequests())
      }
    })
  }

  const handleStatus = (id: string, status: "approved" | "rejected" | "cancelled") => {
    startTransition(async () => {
      const result = await updateLeaveStatus(id, status)
      if (result.error) toast.error(result.error)
      else {
        toast.success(`Leave ${status}`)
        setRequests(await getLeaveRequests())
      }
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Leave</h1>
        <p className="text-muted-foreground">Apply for short leave, casual, sick, or unpaid time off</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Apply for leave</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleApply} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Leave type</Label>
              <Select value={leaveType} onValueChange={(v) => setLeaveType(v as LeaveType)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">Short leave (chhoti)</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                  <SelectItem value="sick">Sick</SelectItem>
                  <SelectItem value="annual">Annual</SelectItem>
                  <SelectItem value="unpaid">Unpaid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="startDate">Start date</Label>
              <Input id="startDate" name="startDate" type="date" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate">End date</Label>
              <Input id="endDate" name="endDate" type="date" required />
            </div>
            {leaveType === "short" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="startTime">From</Label>
                  <Input id="startTime" name="startTime" type="time" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="endTime">To</Label>
                  <Input id="endTime" name="endTime" type="time" required />
                </div>
              </>
            )}
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea id="reason" name="reason" required />
            </div>
            <Button type="submit" disabled={isPending} className="w-full sm:w-fit">
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Submit request
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Leave requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  {canApprove && <TableHead>Person</TableHead>}
                  <TableHead>Type</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((req) => (
                  <TableRow key={req.id}>
                    {canApprove && <TableCell>{req.profile?.fullName ?? "—"}</TableCell>}
                    <TableCell className="capitalize">{req.leaveType.replace("_", " ")}</TableCell>
                    <TableCell>
                      {formatDate(req.startDate)} – {formatDate(req.endDate)}
                      {req.leaveType === "short" && req.startTime && req.endTime && (
                        <span className="block text-xs text-muted-foreground">
                          {req.startTime} – {req.endTime}
                        </span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{req.status}</Badge>
                    </TableCell>
                    <TableCell>
                      {req.status === "pending" && canApprove && (
                        <div className="flex gap-1">
                          <Button size="icon" variant="ghost" onClick={() => handleStatus(req.id, "approved")} disabled={isPending}>
                            <Check className="h-4 w-4 text-green-600" />
                          </Button>
                          <Button size="icon" variant="ghost" onClick={() => handleStatus(req.id, "rejected")} disabled={isPending}>
                            <X className="h-4 w-4 text-red-600" />
                          </Button>
                        </div>
                      )}
                      {req.status === "pending" && !canApprove && (
                        <Button size="sm" variant="ghost" onClick={() => handleStatus(req.id, "cancelled")} disabled={isPending}>
                          Cancel
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {!requests.length && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                      No leave requests
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
