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
import { formatTime, formatHours, hoursBetween } from "@/lib/dashboard/utils"
import { PRESENCE_LABELS, presenceColor } from "@/lib/dashboard/presence"
import type { DesignationGroup } from "@/lib/types"

export function DesignationBoard({ groups }: { groups: DesignationGroup[] }) {
  if (!groups.length) {
    return (
      <p className="py-10 text-center text-sm text-muted-foreground">
        No active people to group by designation
      </p>
    )
  }

  return (
    <div className="space-y-6">
      {groups.map((group) => (
        <Card key={group.designation}>
          <CardHeader>
            <CardTitle className="flex flex-wrap items-center justify-between gap-2 text-base">
              <span>{group.designation}</span>
              <div className="flex flex-wrap gap-2 text-xs font-normal">
                <Badge variant="outline">{group.total} total</Badge>
                <Badge variant="outline" className={presenceColor("in")}>{group.in} in</Badge>
                <Badge variant="outline" className={presenceColor("out")}>{group.out} out</Badge>
                <Badge variant="outline" className={presenceColor("not_arrived")}>{group.not_arrived} absent</Badge>
                <Badge variant="outline" className={presenceColor("on_leave")}>{group.on_leave} leave</Badge>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Sign In</TableHead>
                    <TableHead>Sign Out</TableHead>
                    <TableHead>Hours</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {group.people.map((person) => (
                    <TableRow key={person.id}>
                      <TableCell className="font-medium">{person.fullName}</TableCell>
                      <TableCell>
                        <Badge variant="outline" className={presenceColor(person.presence)}>
                          {PRESENCE_LABELS[person.presence]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {person.attendance?.checkIn ? formatTime(person.attendance.checkIn) : "—"}
                      </TableCell>
                      <TableCell>
                        {person.attendance?.checkOut ? formatTime(person.attendance.checkOut) : "—"}
                      </TableCell>
                      <TableCell>
                        {formatHours(
                          person.attendance?.totalHours ??
                            hoursBetween(person.attendance?.checkIn, person.attendance?.checkOut)
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
