"use client"

import { useTransition } from "react"
import { LogIn, LogOut, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { checkIn, checkOut } from "@/actions/attendance"
import type { Attendance } from "@/lib/types"
import { formatDateTime, formatHours, hoursBetween } from "@/lib/dashboard/utils"

interface CheckInButtonProps {
  todayRecord: Attendance | null
}

export function CheckInButton({ todayRecord }: CheckInButtonProps) {
  const [isPending, startTransition] = useTransition()

  const handleCheckIn = (workMode: "office" | "remote" | "hybrid") => {
    startTransition(async () => {
      const result = await checkIn(workMode)
      if (result.error) toast.error(result.error)
      else toast.success("Signed in successfully")
    })
  }

  const handleCheckOut = () => {
    startTransition(async () => {
      const result = await checkOut()
      if (result.error) toast.error(result.error)
      else toast.success("Signed out successfully")
    })
  }

  const checkedIn = !!todayRecord?.checkIn
  const checkedOut = !!todayRecord?.checkOut
  const hours = todayRecord?.totalHours ?? hoursBetween(todayRecord?.checkIn, todayRecord?.checkOut)

  return (
    <div className="flex flex-col gap-3">
      {todayRecord?.checkIn && (
        <p className="text-sm text-muted-foreground">
          Sign In (Check In): {formatDateTime(todayRecord.checkIn)}
        </p>
      )}
      {todayRecord?.checkOut && (
        <p className="text-sm text-muted-foreground">
          Sign Out (Check Out): {formatDateTime(todayRecord.checkOut)}
        </p>
      )}
      {checkedIn && <p className="text-sm font-medium">Hours: {formatHours(hours)}</p>}

      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap">
        {!checkedIn && (
          <>
            <Button
              onClick={() => handleCheckIn("office")}
              disabled={isPending}
              className="w-full gap-2 sm:w-auto"
              size="lg"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
              Sign In
            </Button>
            <Select onValueChange={(v) => handleCheckIn(v as "remote" | "hybrid")}>
              <SelectTrigger className="w-full sm:w-[160px]">
                <SelectValue placeholder="Remote / Hybrid" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="remote">Sign In (Remote)</SelectItem>
                <SelectItem value="hybrid">Sign In (Hybrid)</SelectItem>
              </SelectContent>
            </Select>
          </>
        )}
        {checkedIn && !checkedOut && (
          <Button
            variant="outline"
            onClick={handleCheckOut}
            disabled={isPending}
            className="w-full gap-2 sm:w-auto"
            size="lg"
          >
            {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign Out
          </Button>
        )}
        {checkedOut && (
          <p className="text-sm font-medium text-green-600 dark:text-green-400">
            Day complete — {formatHours(hours)} logged
          </p>
        )}
      </div>
    </div>
  )
}
