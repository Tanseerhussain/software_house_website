import type { LucideIcon } from "lucide-react"
import {
  Award,
  Brain,
  Cloud,
  Code,
  Database,
  Eye,
  Palette,
  Shield,
  Smartphone,
  Target,
  TrendingUp,
  Users,
  Zap,
} from "lucide-react"
import type { CmsIconName } from "@/lib/cms/types"

export const CMS_ICON_MAP: Record<CmsIconName, LucideIcon> = {
  code: Code,
  smartphone: Smartphone,
  palette: Palette,
  brain: Brain,
  database: Database,
  cloud: Cloud,
  shield: Shield,
  zap: Zap,
  "trending-up": TrendingUp,
  award: Award,
  users: Users,
  target: Target,
  eye: Eye,
}

export function CmsIcon({
  name,
  className,
  size = 24,
}: {
  name: string
  className?: string
  size?: number
}) {
  const Icon = CMS_ICON_MAP[name as CmsIconName] ?? Code
  return <Icon className={className} size={size} />
}
