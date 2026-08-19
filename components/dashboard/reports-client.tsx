"use client"

import { useMemo, useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { Download } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { downloadCsv } from "@/lib/dashboard/csv"
import { formatDateTime, getTodayInTimezone, startOfMonthISO, startOfWeekISO, ATTENDANCE_COLORS, WORK_LOG_COLORS } from "@/lib/dashboard/utils"
import { toast } from "sonner"
import { cn } from "@/lib/utils"

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6", "#a855f7"]

interface ReportsClientProps {
  start: string
  end: string
  attendance: Record<string, unknown>[]
  work: Record<string, unknown>[]
  combined: Record<string, unknown>[]
  designation: Record<string, unknown>[]
  ownOnly?: boolean
}

export function ReportsClient({
  start,
  end,
  attendance,
  work,
  combined,
  designation,
  ownOnly = false,
}: ReportsClientProps) {
  const router = useRouter()
  const [from, setFrom] = useState(start)
  const [to, setTo] = useState(end)
  const [tab, setTab] = useState<"attendance" | "work" | "combined">("attendance")
  const [, startTransition] = useTransition()
  const today = getTodayInTimezone()

  const applyRange = (nextFrom: string, nextTo: string) => {
    setFrom(nextFrom)
    setTo(nextTo)
    startTransition(() => {
      router.push(`/dashboard/reports?from=${nextFrom}&to=${nextTo}`)
    })
  }

  const pieData = useMemo(() => {
    const present = attendance.reduce((s, r) => s + Number(r.days_present ?? 0), 0)
    const late = attendance.reduce((s, r) => s + Number(r.days_late ?? 0), 0)
    const absent = attendance.reduce((s, r) => s + Number(r.days_absent ?? 0), 0)
    return [
      { name: "present", value: present || 0 },
      { name: "late", value: late || 0 },
      { name: "absent", value: absent || 0 },
    ]
  }, [attendance])

  const exportAttendance = () => {
    downloadCsv(`attendance-${from}-to-${to}.csv`, attendance)
    toast.success("Attendance CSV downloaded — you can send this to admin")
  }
  const exportWork = () => {
    downloadCsv(`work-logs-${from}-to-${to}.csv`, work)
    toast.success("Work report CSV downloaded")
  }
  const exportCombined = () => {
    downloadCsv(`combined-report-${from}-to-${to}.csv`, combined)
    toast.success("Combined CSV downloaded")
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold sm:text-2xl">Reports</h1>
        <p className="text-sm text-muted-foreground sm:text-base">
          {ownOnly ? "Your attendance and work for the selected dates" : "Attendance + work for the selected date range"} (Asia/Karachi)
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Date range</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" onClick={() => applyRange(today, today)}>Today</Button>
            <Button variant="outline" size="sm" onClick={() => applyRange(startOfWeekISO(), today)}>This week</Button>
            <Button variant="outline" size="sm" onClick={() => applyRange(startOfMonthISO(), today)}>This month</Button>
          </div>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault()
              applyRange(from, to)
            }}
          >
            <div className="min-w-0 flex-1 space-y-1">
              <Label htmlFor="from">From</Label>
              <Input id="from" type="date" className="w-full" value={from} onChange={(e) => setFrom(e.target.value)} />
            </div>
            <div className="min-w-0 flex-1 space-y-1">
              <Label htmlFor="to">To</Label>
              <Input id="to" type="date" className="w-full" value={to} onChange={(e) => setTo(e.target.value)} />
            </div>
            <Button type="submit" className="w-full sm:w-auto">Apply</Button>
          </form>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={exportAttendance}>
          <Download className="h-4 w-4" /> Attendance CSV
        </Button>
        <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={exportWork}>
          <Download className="h-4 w-4" /> Work CSV
        </Button>
        <Button variant="outline" className="w-full gap-2 sm:w-auto" onClick={exportCombined}>
          <Download className="h-4 w-4" /> Combined CSV
        </Button>
      </div>

      <div className="grid min-w-0 gap-6 lg:grid-cols-2">
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Attendance breakdown</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[220px] w-full min-w-0 sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={70} label>
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        <Card className="min-w-0">
          <CardHeader>
            <CardTitle className="text-base">Work completion by designation</CardTitle>
          </CardHeader>
          <CardContent>
            {designation.length ? (
              <div className="h-[220px] w-full min-w-0 sm:h-[250px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={designation} margin={{ left: 0, right: 8, top: 8, bottom: 8 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="designation" tick={{ fontSize: 11 }} interval="preserveStartEnd" />
                    <YAxis width={32} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="work_completion_pct" fill="#22c55e" name="Work %" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <p className="py-10 text-center text-sm text-muted-foreground">No work data in this range</p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-3 gap-1 rounded-lg bg-muted p-1">
          {(
            [
              ["attendance", "Attendance"],
              ["work", "Work"],
              ["combined", "Day by day"],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={cn(
                "rounded-md px-2 py-2 text-center text-xs font-medium transition-colors sm:text-sm",
                tab === value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        {tab === "attendance" && (
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Designation</TableHead>
                    <TableHead>Present</TableHead>
                    <TableHead>Late</TableHead>
                    <TableHead>Absent</TableHead>
                    <TableHead>Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attendance.map((row) => (
                    <TableRow key={String(row.user_id)}>
                      <TableCell className="font-medium">{String(row.name)}</TableCell>
                      <TableCell>{String(row.designation)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={ATTENDANCE_COLORS.present}>{String(row.days_present)}</Badge>
                      </TableCell>
                      <TableCell>{String(row.days_late)}</TableCell>
                      <TableCell>{String(row.days_absent)}</TableCell>
                      <TableCell>{String(row.total_hours)}h</TableCell>
                    </TableRow>
                  ))}
                  {!attendance.length && (
                    <TableRow>
                      <TableCell colSpan={6} className="py-10 text-center text-muted-foreground">No attendance in this range</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {tab === "work" && (
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Done</TableHead>
                    <TableHead>Not done</TableHead>
                    <TableHead>Completion</TableHead>
                    <TableHead>Incomplete</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {work.map((row) => (
                    <TableRow key={String(row.user_id)}>
                      <TableCell className="font-medium">{String(row.name)}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={WORK_LOG_COLORS.done}>{String(row.tasks_done)}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className={WORK_LOG_COLORS.not_done}>{String(row.tasks_not_done)}</Badge>
                      </TableCell>
                      <TableCell>{String(row.completion_pct)}%</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{String(row.incomplete || "—")}</TableCell>
                    </TableRow>
                  ))}
                  {!work.length && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">No work logs in this range</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
        {tab === "combined" && (
          <Card>
            <CardContent className="overflow-x-auto pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Person</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Sign In</TableHead>
                    <TableHead>Sign Out</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Done / not done</TableHead>
                    <TableHead>Work</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {combined.filter((row) => row.date).map((row, i) => (
                    <TableRow key={`${row.user_id ?? row.name}-${row.date}-${i}`}>
                      <TableCell className="font-medium">{String(row.name)}</TableCell>
                      <TableCell>{String(row.date)}</TableCell>
                      <TableCell>{row.sign_in ? formatDateTime(String(row.sign_in)) : "—"}</TableCell>
                      <TableCell>{row.sign_out ? formatDateTime(String(row.sign_out)) : "—"}</TableCell>
                      <TableCell>{row.hours ? `${row.hours}h` : "—"}</TableCell>
                      <TableCell>{String(row.tasks_done)} / {String(row.tasks_not_done)}</TableCell>
                      <TableCell className="max-w-xs truncate text-muted-foreground">{String(row.work_summary || "—")}</TableCell>
                    </TableRow>
                  ))}
                  {!combined.filter((row) => row.date).length && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">No daily records in this range</TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
