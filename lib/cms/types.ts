export type CmsStatus = "draft" | "published" | "archived"

export const CMS_STATUSES: CmsStatus[] = ["draft", "published", "archived"]

export const CMS_PUBLIC_PATHS = [
  "/",
  "/about",
  "/services",
  "/portfolio",
  "/blog",
  "/contact",
] as const

export const CMS_SETTING_KEYS = [
  "hero",
  "stats",
  "about",
  "contact",
  "site_branding",
  "services_page",
] as const

export type CmsSettingKey = (typeof CMS_SETTING_KEYS)[number]

export const CMS_ICON_OPTIONS = [
  "code",
  "smartphone",
  "palette",
  "brain",
  "database",
  "cloud",
  "shield",
  "zap",
  "trending-up",
  "award",
  "users",
  "target",
  "eye",
] as const

export type CmsIconName = (typeof CMS_ICON_OPTIONS)[number]

export const CMS_UPLOAD_FOLDERS = ["portfolio", "blog", "team", "logos"] as const
export type CmsUploadFolder = (typeof CMS_UPLOAD_FOLDERS)[number]

export interface HeroSetting {
  badge: string
  headline: string
  headlineHighlight: string
  subheadline: string
  primaryCtaLabel: string
  primaryCtaHref: string
  secondaryCtaLabel: string
  secondaryCtaHref: string
}

export interface StatItem {
  number: string
  label: string
}

export interface StatsSetting {
  items: StatItem[]
}

export interface AboutValue {
  icon: CmsIconName
  title: string
  description: string
}

export interface AboutTimelineItem {
  year: string
  event: string
  description: string
}

export interface AboutSetting {
  heading: string
  intro: string
  mission: string
  vision: string
  values: AboutValue[]
  timeline: AboutTimelineItem[]
}

export interface ContactHoursRow {
  days: string
  time: string
}

export interface ContactSetting {
  email: string
  phone: string
  address: string
  hours: ContactHoursRow[]
  mapEmbedUrl: string
  mapUrl: string
}

export interface SiteBranding {
  companyName: string
  tagline: string
  footerText: string
  githubUrl: string
  linkedinUrl: string
  twitterUrl: string
}

export interface ServicesPageSetting {
  heading: string
  subheading: string
  ctaHeading: string
  ctaText: string
  ctaLabel: string
  ctaHref: string
}

export interface CmsService {
  id: string
  title: string
  description: string
  features: string[]
  icon: CmsIconName
  colorGradient: string
  sortOrder: number
  isFeatured: boolean
  status: CmsStatus
}

export interface CmsPortfolioItem {
  id: string
  title: string
  category: string
  description: string
  imageUrl: string
  technologies: string[]
  projectUrl: string
  githubUrl: string
  sortOrder: number
  status: CmsStatus
}

export interface CmsBlogPost {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  authorName: string
  readTime: string
  imageUrl: string
  status: CmsStatus
  createdAt: string
  updatedAt: string
}

export interface CmsTeamMember {
  id: string
  name: string
  role: string
  bio: string
  imageUrl: string
  sortOrder: number
  status: CmsStatus
}

export interface CmsLogo {
  id: string
  name: string
  logoUrl: string
  sortOrder: number
  status: CmsStatus
}

export interface CmsDashboardData {
  hero: HeroSetting
  stats: StatsSetting
  about: AboutSetting
  contact: ContactSetting
  branding: SiteBranding
  servicesPage: ServicesPageSetting
  services: CmsService[]
  portfolio: CmsPortfolioItem[]
  blog: CmsBlogPost[]
  team: CmsTeamMember[]
  logos: CmsLogo[]
}
