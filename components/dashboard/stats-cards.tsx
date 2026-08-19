import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"

interface StatCard {
  title: string
  value: string | number
  description?: string
  icon?: LucideIcon
}

export function StatsCards({ stats }: { stats: StatCard[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5 min-w-0">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            {stat.icon && <stat.icon className="h-4 w-4 text-muted-foreground" />}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            {stat.description && <p className="text-xs text-muted-foreground">{stat.description}</p>}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
