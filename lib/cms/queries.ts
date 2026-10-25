import type { Document } from "mongodb"
import {
  getWebsiteBlogCollection,
  getWebsiteLogosCollection,
  getWebsitePortfolioCollection,
  getWebsiteServicesCollection,
  getWebsiteSettingsCollection,
  getWebsiteTeamCollection,
} from "@/lib/db/collections"
import {
  FALLBACK_ABOUT,
  FALLBACK_BLOG,
  FALLBACK_BRANDING,
  FALLBACK_CONTACT,
  FALLBACK_HERO,
  FALLBACK_LOGOS,
  FALLBACK_PORTFOLIO,
  FALLBACK_SERVICES,
  FALLBACK_SERVICES_PAGE,
  FALLBACK_STATS,
  FALLBACK_TEAM,
} from "@/lib/cms/fallbacks"
import type {
  AboutSetting,
  CmsBlogPost,
  CmsIconName,
  CmsLogo,
  CmsPortfolioItem,
  CmsService,
  CmsStatus,
  CmsTeamMember,
  ContactSetting,
  HeroSetting,
  ServicesPageSetting,
  SiteBranding,
  StatsSetting,
} from "@/lib/cms/types"
import { CMS_ICON_OPTIONS, CMS_STATUSES } from "@/lib/cms/types"
import { slugify } from "@/lib/cms/utils"

export { slugify }

function asStatus(value: unknown): CmsStatus {
  return CMS_STATUSES.includes(value as CmsStatus) ? (value as CmsStatus) : "draft"
}

function asIcon(value: unknown): CmsIconName {
  return CMS_ICON_OPTIONS.includes(value as CmsIconName) ? (value as CmsIconName) : "code"
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map((item) => String(item).trim()).filter(Boolean)
  if (typeof value === "string") {
    return value
      .split("\n")
      .map((item) => item.trim())
      .filter(Boolean)
  }
  return []
}

function iso(value: Date | string | null | undefined): string {
  if (!value) return new Date().toISOString()
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return new Date().toISOString()
  return d.toISOString()
}

function merge<T extends object>(fallback: T, value: unknown): T {
  if (!value || typeof value !== "object") return fallback
  return { ...fallback, ...(value as Partial<T>) }
}

async function getSettingValue<T extends object>(key: string, fallback: T): Promise<T> {
  try {
    const settings = await getWebsiteSettingsCollection()
    const doc = await settings.findOne({ key })
    return merge(fallback, doc?.value)
  } catch (error) {
    console.error(`[cms] Failed to load setting ${key}`, error)
    return fallback
  }
}

export function serializeService(doc: Document): CmsService {
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    description: String(doc.description ?? ""),
    features: asStringArray(doc.features),
    icon: asIcon(doc.icon),
    colorGradient: String(doc.color_gradient ?? "from-blue-500 to-cyan-500"),
    sortOrder: Number(doc.sort_order ?? 0),
    isFeatured: Boolean(doc.is_featured),
    status: asStatus(doc.status),
  }
}

export function serializePortfolio(doc: Document): CmsPortfolioItem {
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    category: String(doc.category ?? ""),
    description: String(doc.description ?? ""),
    imageUrl: String(doc.image_url ?? ""),
    technologies: asStringArray(doc.technologies),
    projectUrl: String(doc.project_url ?? ""),
    githubUrl: String(doc.github_url ?? ""),
    sortOrder: Number(doc.sort_order ?? 0),
    status: asStatus(doc.status),
  }
}

export function serializeBlog(doc: Document): CmsBlogPost {
  return {
    id: doc._id.toString(),
    title: String(doc.title ?? ""),
    slug: String(doc.slug ?? ""),
    excerpt: String(doc.excerpt ?? ""),
    content: String(doc.content ?? ""),
    category: String(doc.category ?? ""),
    authorName: String(doc.author_name ?? ""),
    readTime: String(doc.read_time ?? ""),
    imageUrl: String(doc.image_url ?? ""),
    status: asStatus(doc.status),
    createdAt: iso(doc.createdAt),
    updatedAt: iso(doc.updatedAt),
  }
}

export function serializeTeam(doc: Document): CmsTeamMember {
  return {
    id: doc._id.toString(),
    name: String(doc.name ?? ""),
    role: String(doc.role ?? ""),
    bio: String(doc.bio ?? ""),
    imageUrl: String(doc.image_url ?? ""),
    sortOrder: Number(doc.sort_order ?? 0),
    status: asStatus(doc.status),
  }
}

export function serializeLogo(doc: Document): CmsLogo {
  return {
    id: doc._id.toString(),
    name: String(doc.name ?? ""),
    logoUrl: String(doc.logo_url ?? ""),
    sortOrder: Number(doc.sort_order ?? 0),
    status: asStatus(doc.status),
  }
}

export async function getHeroSetting(): Promise<HeroSetting> {
  return getSettingValue("hero", FALLBACK_HERO)
}

export async function getStatsSetting(): Promise<StatsSetting> {
  const merged = await getSettingValue("stats", FALLBACK_STATS)
  return { items: Array.isArray(merged.items) && merged.items.length ? merged.items : FALLBACK_STATS.items }
}

export async function getAboutSetting(): Promise<AboutSetting> {
  const merged = await getSettingValue("about", FALLBACK_ABOUT)
  return {
    ...FALLBACK_ABOUT,
    ...merged,
    values: Array.isArray(merged.values) && merged.values.length ? merged.values : FALLBACK_ABOUT.values,
    timeline: Array.isArray(merged.timeline) && merged.timeline.length ? merged.timeline : FALLBACK_ABOUT.timeline,
  }
}

export async function getContactSetting(): Promise<ContactSetting> {
  const merged = await getSettingValue("contact", FALLBACK_CONTACT)
  return {
    ...FALLBACK_CONTACT,
    ...merged,
    hours: Array.isArray(merged.hours) && merged.hours.length ? merged.hours : FALLBACK_CONTACT.hours,
  }
}

export async function getSiteBranding(): Promise<SiteBranding> {
  return getSettingValue("site_branding", FALLBACK_BRANDING)
}

export async function getServicesPageSetting(): Promise<ServicesPageSetting> {
  return getSettingValue("services_page", FALLBACK_SERVICES_PAGE)
}

async function publishedOrFallback<T>(
  load: () => Promise<T[]>,
  fallback: T[]
): Promise<T[]> {
  try {
    const rows = await load()
    return rows
  } catch (error) {
    console.error("[cms] Failed to load collection", error)
    return fallback
  }
}

export async function getPublishedServices(): Promise<CmsService[]> {
  return publishedOrFallback(async () => {
    const col = await getWebsiteServicesCollection()
    const total = await col.countDocuments()
    if (total === 0) return FALLBACK_SERVICES
    const rows = await col.find({ status: "published" }).sort({ sort_order: 1, title: 1 }).toArray()
    return rows.map(serializeService)
  }, FALLBACK_SERVICES)
}

export async function getFeaturedServices(): Promise<CmsService[]> {
  const services = await getPublishedServices()
  const featured = services.filter((item) => item.isFeatured)
  return featured.length ? featured : services.slice(0, 4)
}

export async function getPublishedPortfolio(): Promise<CmsPortfolioItem[]> {
  return publishedOrFallback(async () => {
    const col = await getWebsitePortfolioCollection()
    const total = await col.countDocuments()
    if (total === 0) return FALLBACK_PORTFOLIO
    const rows = await col.find({ status: "published" }).sort({ sort_order: 1, title: 1 }).toArray()
    return rows.map(serializePortfolio)
  }, FALLBACK_PORTFOLIO)
}

export async function getPublishedBlogPosts(): Promise<CmsBlogPost[]> {
  return publishedOrFallback(async () => {
    const col = await getWebsiteBlogCollection()
    const total = await col.countDocuments()
    if (total === 0) return FALLBACK_BLOG
    const rows = await col.find({ status: "published" }).sort({ createdAt: -1 }).toArray()
    return rows.map(serializeBlog)
  }, FALLBACK_BLOG)
}

export async function getPublishedBlogPost(slug: string): Promise<CmsBlogPost | null> {
  const normalized = slug.trim().toLowerCase()
  try {
    const col = await getWebsiteBlogCollection()
    const total = await col.countDocuments()
    if (total === 0) {
      return FALLBACK_BLOG.find((post) => post.slug === normalized) ?? null
    }
    const doc = await col.findOne({ slug: normalized, status: "published" })
    return doc ? serializeBlog(doc) : null
  } catch (error) {
    console.error("[cms] Failed to load blog post", error)
    return FALLBACK_BLOG.find((post) => post.slug === normalized) ?? null
  }
}

export async function getPublishedTeam(): Promise<CmsTeamMember[]> {
  return publishedOrFallback(async () => {
    const col = await getWebsiteTeamCollection()
    const total = await col.countDocuments()
    if (total === 0) return FALLBACK_TEAM
    const rows = await col.find({ status: "published" }).sort({ sort_order: 1, name: 1 }).toArray()
    return rows.map(serializeTeam)
  }, FALLBACK_TEAM)
}

export async function getPublishedLogos(): Promise<CmsLogo[]> {
  return publishedOrFallback(async () => {
    const col = await getWebsiteLogosCollection()
    const total = await col.countDocuments()
    if (total === 0) return FALLBACK_LOGOS
    const rows = await col.find({ status: "published" }).sort({ sort_order: 1, name: 1 }).toArray()
    return rows.map(serializeLogo)
  }, FALLBACK_LOGOS)
}

export async function listAllServices(): Promise<CmsService[]> {
  const col = await getWebsiteServicesCollection()
  const rows = await col.find({}).sort({ sort_order: 1, title: 1 }).toArray()
  return rows.map(serializeService)
}

export async function listAllPortfolio(): Promise<CmsPortfolioItem[]> {
  const col = await getWebsitePortfolioCollection()
  const rows = await col.find({}).sort({ sort_order: 1, title: 1 }).toArray()
  return rows.map(serializePortfolio)
}

export async function listAllBlog(): Promise<CmsBlogPost[]> {
  const col = await getWebsiteBlogCollection()
  const rows = await col.find({}).sort({ createdAt: -1 }).toArray()
  return rows.map(serializeBlog)
}

export async function listAllTeam(): Promise<CmsTeamMember[]> {
  const col = await getWebsiteTeamCollection()
  const rows = await col.find({}).sort({ sort_order: 1, name: 1 }).toArray()
  return rows.map(serializeTeam)
}

export async function listAllLogos(): Promise<CmsLogo[]> {
  const col = await getWebsiteLogosCollection()
  const rows = await col.find({}).sort({ sort_order: 1, name: 1 }).toArray()
  return rows.map(serializeLogo)
}
