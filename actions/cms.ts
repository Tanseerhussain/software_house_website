"use server"

import { revalidatePath } from "next/cache"
import { requireRole } from "@/lib/auth/session"
import {
  getWebsiteBlogCollection,
  getWebsiteLogosCollection,
  getWebsitePortfolioCollection,
  getWebsiteServicesCollection,
  getWebsiteSettingsCollection,
  getWebsiteTeamCollection,
  toObjectId,
} from "@/lib/db/collections"
import {
  getAboutSetting,
  getContactSetting,
  getHeroSetting,
  getServicesPageSetting,
  getSiteBranding,
  getStatsSetting,
  listAllBlog,
  listAllLogos,
  listAllPortfolio,
  listAllServices,
  listAllTeam,
} from "@/lib/cms/queries"
import { slugify } from "@/lib/cms/utils"
import {
  cloudinary,
  ensureCloudinaryConfig,
  getCmsCloudinaryFolder,
  isCmsUploadFolder,
} from "@/lib/cms/cloudinary"
import {
  CMS_ICON_OPTIONS,
  CMS_PUBLIC_PATHS,
  CMS_SETTING_KEYS,
  CMS_STATUSES,
  type AboutSetting,
  type CmsDashboardData,
  type CmsIconName,
  type CmsSettingKey,
  type CmsStatus,
  type ContactSetting,
  type HeroSetting,
  type ServicesPageSetting,
  type SiteBranding,
  type StatsSetting,
} from "@/lib/cms/types"

function revalidateCms() {
  for (const path of CMS_PUBLIC_PATHS) {
    revalidatePath(path)
  }
  revalidatePath("/blog", "layout")
  revalidatePath("/dashboard/cms")
}

function parseStatus(value: FormDataEntryValue | null): CmsStatus {
  const status = value?.toString() ?? "published"
  return CMS_STATUSES.includes(status as CmsStatus) ? (status as CmsStatus) : "draft"
}

function parseIcon(value: FormDataEntryValue | null): CmsIconName {
  const icon = value?.toString() ?? "code"
  return CMS_ICON_OPTIONS.includes(icon as CmsIconName) ? (icon as CmsIconName) : "code"
}

function parseLines(value: FormDataEntryValue | null): string[] {
  return (value?.toString() ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
}

function parseSort(value: FormDataEntryValue | null): number {
  const n = Number(value?.toString() ?? 0)
  return Number.isFinite(n) ? n : 0
}

export async function getCmsDashboard(): Promise<CmsDashboardData> {
  await requireRole("admin")
  const [hero, stats, about, contact, branding, servicesPage, services, portfolio, blog, team, logos] =
    await Promise.all([
      getHeroSetting(),
      getStatsSetting(),
      getAboutSetting(),
      getContactSetting(),
      getSiteBranding(),
      getServicesPageSetting(),
      listAllServices(),
      listAllPortfolio(),
      listAllBlog(),
      listAllTeam(),
      listAllLogos(),
    ])
  return { hero, stats, about, contact, branding, servicesPage, services, portfolio, blog, team, logos }
}

export async function updateSiteSetting(
  key: CmsSettingKey,
  value: HeroSetting | StatsSetting | AboutSetting | ContactSetting | SiteBranding | ServicesPageSetting
) {
  await requireRole("admin")
  if (!CMS_SETTING_KEYS.includes(key)) return { error: "Invalid setting" }
  const settings = await getWebsiteSettingsCollection()
  await settings.updateOne(
    { key },
    { $set: { key, value, updatedAt: new Date() } },
    { upsert: true }
  )
  revalidateCms()
  return { success: true }
}

export async function upsertWebsiteService(formData: FormData) {
  await requireRole("admin")
  const title = formData.get("title")?.toString().trim() ?? ""
  if (!title) return { error: "Title is required" }

  const now = new Date()
  const payload = {
    title,
    description: formData.get("description")?.toString().trim() ?? "",
    features: parseLines(formData.get("features")),
    icon: parseIcon(formData.get("icon")),
    color_gradient: formData.get("color_gradient")?.toString().trim() || "from-blue-500 to-cyan-500",
    sort_order: parseSort(formData.get("sort_order")),
    is_featured: formData.get("is_featured") === "on" || formData.get("is_featured") === "true",
    status: parseStatus(formData.get("status")),
    updatedAt: now,
  }

  const col = await getWebsiteServicesCollection()
  const id = formData.get("id")?.toString()
  const _id = id ? toObjectId(id) : null
  if (_id) {
    await col.updateOne({ _id }, { $set: payload })
  } else {
    await col.insertOne({ ...payload, createdAt: now })
  }
  revalidateCms()
  return { success: true }
}

export async function deleteWebsiteService(id: string) {
  await requireRole("admin")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid item" }
  await (await getWebsiteServicesCollection()).deleteOne({ _id })
  revalidateCms()
  return { success: true }
}

export async function upsertWebsitePortfolio(formData: FormData) {
  await requireRole("admin")
  const title = formData.get("title")?.toString().trim() ?? ""
  if (!title) return { error: "Title is required" }

  const now = new Date()
  const payload = {
    title,
    category: formData.get("category")?.toString().trim() ?? "",
    description: formData.get("description")?.toString().trim() ?? "",
    image_url: formData.get("image_url")?.toString().trim() ?? "",
    technologies: parseLines(formData.get("technologies")),
    project_url: formData.get("project_url")?.toString().trim() ?? "",
    github_url: formData.get("github_url")?.toString().trim() ?? "",
    sort_order: parseSort(formData.get("sort_order")),
    status: parseStatus(formData.get("status")),
    updatedAt: now,
  }

  const col = await getWebsitePortfolioCollection()
  const id = formData.get("id")?.toString()
  const _id = id ? toObjectId(id) : null
  if (_id) {
    await col.updateOne({ _id }, { $set: payload })
  } else {
    await col.insertOne({ ...payload, createdAt: now })
  }
  revalidateCms()
  return { success: true }
}

export async function deleteWebsitePortfolio(id: string) {
  await requireRole("admin")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid item" }
  await (await getWebsitePortfolioCollection()).deleteOne({ _id })
  revalidateCms()
  return { success: true }
}

export async function upsertWebsiteBlog(formData: FormData) {
  await requireRole("admin")
  const title = formData.get("title")?.toString().trim() ?? ""
  if (!title) return { error: "Title is required" }

  const slugInput = formData.get("slug")?.toString().trim() ?? ""
  const slug = slugify(slugInput || title)
  if (!slug) return { error: "Slug is required" }

  const now = new Date()
  const col = await getWebsiteBlogCollection()
  const id = formData.get("id")?.toString()
  const _id = id ? toObjectId(id) : null

  const existing = await col.findOne({ slug, ...(_id ? { _id: { $ne: _id } } : {}) })
  if (existing) return { error: "A post with this slug already exists" }

  const payload = {
    title,
    slug,
    excerpt: formData.get("excerpt")?.toString().trim() ?? "",
    content: formData.get("content")?.toString().trim() ?? "",
    category: formData.get("category")?.toString().trim() ?? "",
    author_name: formData.get("author_name")?.toString().trim() ?? "",
    read_time: formData.get("read_time")?.toString().trim() ?? "",
    image_url: formData.get("image_url")?.toString().trim() ?? "",
    status: parseStatus(formData.get("status")),
    updatedAt: now,
  }

  if (_id) {
    await col.updateOne({ _id }, { $set: payload })
  } else {
    await col.insertOne({ ...payload, createdAt: now })
  }
  revalidateCms()
  return { success: true }
}

export async function deleteWebsiteBlog(id: string) {
  await requireRole("admin")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid item" }
  await (await getWebsiteBlogCollection()).deleteOne({ _id })
  revalidateCms()
  return { success: true }
}

export async function upsertWebsiteTeam(formData: FormData) {
  await requireRole("admin")
  const name = formData.get("name")?.toString().trim() ?? ""
  if (!name) return { error: "Name is required" }

  const now = new Date()
  const payload = {
    name,
    role: formData.get("role")?.toString().trim() ?? "",
    bio: formData.get("bio")?.toString().trim() ?? "",
    image_url: formData.get("image_url")?.toString().trim() ?? "",
    sort_order: parseSort(formData.get("sort_order")),
    status: parseStatus(formData.get("status")),
    updatedAt: now,
  }

  const col = await getWebsiteTeamCollection()
  const id = formData.get("id")?.toString()
  const _id = id ? toObjectId(id) : null
  if (_id) {
    await col.updateOne({ _id }, { $set: payload })
  } else {
    await col.insertOne({ ...payload, createdAt: now })
  }
  revalidateCms()
  return { success: true }
}

export async function deleteWebsiteTeam(id: string) {
  await requireRole("admin")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid item" }
  await (await getWebsiteTeamCollection()).deleteOne({ _id })
  revalidateCms()
  return { success: true }
}

export async function upsertWebsiteLogo(formData: FormData) {
  await requireRole("admin")
  const name = formData.get("name")?.toString().trim() ?? ""
  if (!name) return { error: "Name is required" }

  const now = new Date()
  const payload = {
    name,
    logo_url: formData.get("logo_url")?.toString().trim() ?? "",
    sort_order: parseSort(formData.get("sort_order")),
    status: parseStatus(formData.get("status")),
    updatedAt: now,
  }

  const col = await getWebsiteLogosCollection()
  const id = formData.get("id")?.toString()
  const _id = id ? toObjectId(id) : null
  if (_id) {
    await col.updateOne({ _id }, { $set: payload })
  } else {
    await col.insertOne({ ...payload, createdAt: now })
  }
  revalidateCms()
  return { success: true }
}

const CMS_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"])
const CMS_IMAGE_MAX_BYTES = 5 * 1024 * 1024

export async function uploadCmsImage(formData: FormData) {
  await requireRole("admin")
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    return { error: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET." }
  }

  const folderKey = formData.get("folder")?.toString() ?? ""
  if (!isCmsUploadFolder(folderKey)) return { error: "Invalid upload folder" }

  const file = formData.get("file")
  if (!file || typeof file !== "object" || !("arrayBuffer" in file) || !("size" in file)) {
    return { error: "Choose an image to upload" }
  }
  const upload = file as File
  if (upload.size === 0) return { error: "Choose an image to upload" }
  if (upload.type && !CMS_IMAGE_TYPES.has(upload.type)) {
    return { error: "Use a JPG, PNG, WebP, GIF, or SVG image" }
  }
  if (upload.size > CMS_IMAGE_MAX_BYTES) return { error: "Image must be 5MB or smaller" }

  const buffer = Buffer.from(await upload.arrayBuffer())
  ensureCloudinaryConfig()
  const folder = getCmsCloudinaryFolder(folderKey)

  try {
    const result = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder,
            resource_type: "image",
            overwrite: false,
          },
          (error, uploaded) => {
            if (error || !uploaded?.secure_url) {
              reject(error ?? new Error("Upload failed"))
              return
            }
            resolve({ secure_url: uploaded.secure_url })
          }
        )
        .end(buffer)
    })
    return { url: result.secure_url }
  } catch (error) {
    console.error("[cms] Cloudinary upload failed", error)
    return { error: "Could not upload image" }
  }
}

export async function deleteWebsiteLogo(id: string) {
  await requireRole("admin")
  const _id = toObjectId(id)
  if (!_id) return { error: "Invalid item" }
  await (await getWebsiteLogosCollection()).deleteOne({ _id })
  revalidateCms()
  return { success: true }
}
