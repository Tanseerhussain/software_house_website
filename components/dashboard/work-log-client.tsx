"use client"

import { useState, useTransition } from "react"
import { Loader2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createWorkLog, deleteWorkLog, updateWorkLogStatus } from "@/actions/work-logs"
import { WORK_LOG_COLORS } from "@/lib/dashboard/utils"
import type { WorkLog, WorkLogStatus } from "@/lib/types"

const STATUSES: WorkLogStatus[] = ["done", "in_progress", "not_done", "blocked"]

export function WorkLogClient({ logs, signedIn, date }: { logs: WorkLog[]; signedIn: boolean; date: string }) {
  const [isPending, startTransition] = useTransition()
  const [status, setStatus] = useState<WorkLogStatus>("in_progress")

  const handleCreate = (formData: FormData) => {
    formData.set("status", status)
    startTransition(async () => {
      const result = await createWorkLog(formData)
      if (result.error) toast.error(result.error)
      else toast.success("Work log saved")
    })
  }

  const handleStatus = (id: string, next: WorkLogStatus) => {
    startTransition(async () => {
      const result = await updateWorkLogStatus(id, next)
      if (result.error) toast.error(result.error)
      else toast.success("Updated")
    })
  }

  const handleDelete = (id: string) => {
    startTransition(async () => {
      const result = await deleteWorkLog(id)
      if (result.error) toast.error(result.error)
      else toast.success("Removed")
    })
  }

  const done = logs.filter((l) => l.status === "done").length
  const notDone = logs.filter((l) => l.status === "not_done" || l.status === "blocked").length

  return (
    <div className="space-y-6">
      {!signedIn && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
          Sign In first, then log what you worked on today.
        </p>
      )}
      {signedIn && logs.length === 0 && (
        <p className="rounded-md border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-sm text-amber-800 dark:text-amber-300">
          You signed in but have not logged any work yet.
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Tasks</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold">{logs.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Done</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-green-600">{done}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Not done / blocked</CardTitle></CardHeader>
          <CardContent><p className="text-2xl font-bold text-red-600">{notDone}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add work for {date}</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">What did you work on?</Label>
              <Input id="title" name="title" placeholder="e.g. Fixed login bug" required />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Notes (optional)</Label>
              <Textarea id="description" name="description" placeholder="Details, blockers, pending items" />
            </div>
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={status} onValueChange={(v) => setStatus(v as WorkLogStatus)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="done">Done</SelectItem>
                  <SelectItem value="in_progress">In progress</SelectItem>
                  <SelectItem value="not_done">Not done</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="hoursSpent">Hours spent</Label>
              <Input id="hoursSpent" name="hoursSpent" type="number" min="0" max="24" step="0.5" />
            </div>
            <Button type="submit" disabled={isPending || !signedIn} className="w-full gap-2 sm:w-fit">
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Save task
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Today&apos;s tasks</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="space-y-1">
                <p className="font-medium">{log.title}</p>
                {log.description && <p className="text-sm text-muted-foreground">{log.description}</p>}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={WORK_LOG_COLORS[log.status]}>
                    {log.status.replace("_", " ")}
                  </Badge>
                  {log.hoursSpent != null && (
                    <span className="text-xs text-muted-foreground">{log.hoursSpent}h</span>
                  )}
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                {STATUSES.map((s) => (
                  <Button
                    key={s}
                    size="sm"
                    variant={log.status === s ? "default" : "outline"}
                    disabled={isPending}
                    onClick={() => handleStatus(log.id, s)}
                  >
                    {s.replace("_", " ")}
                  </Button>
                ))}
                <Button size="icon" variant="ghost" onClick={() => handleDelete(log.id)} disabled={isPending}>
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </div>
            </div>
          ))}
          {!logs.length && (
            <p className="py-6 text-center text-sm text-muted-foreground">No work logged yet today</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
