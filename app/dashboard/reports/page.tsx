import { getProfile } from "@/lib/auth/session"
import { getDateRangeReport } from "@/actions/reports"
import { ReportsClient } from "@/components/dashboard/reports-client"
import { getTodayInTimezone, startOfMonthISO } from "@/lib/dashboard/utils"

interface PageProps {
  searchParams: Promise<{ from?: string; to?: string }>
}

export default async function ReportsPage({ searchParams }: PageProps) {
  const profile = await getProfile()
  if (!profile) return null

  const params = await searchParams
  const today = getTodayInTimezone()
  const from = params.from || startOfMonthISO()
  const to = params.to || today
  const report = await getDateRangeReport(from, to)
  const ownOnly = !["admin", "hr", "manager"].includes(profile.role)

  return (
    <ReportsClient
      start={report.start}
      end={report.end}
      attendance={report.attendance}
      work={report.work}
      combined={report.combined}
      designation={report.designation}
      ownOnly={ownOnly}
    />
  )
}
