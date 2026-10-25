import { v2 as cloudinary } from "cloudinary"
import { CMS_UPLOAD_FOLDERS, type CmsUploadFolder } from "@/lib/cms/types"

export function ensureCloudinaryConfig() {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
  })
}

export function getCmsCloudinaryFolder(kind: CmsUploadFolder) {
  const root = process.env.CLOUDINARY_FOLDER?.trim() || "appric"
  return `${root}/${kind}`
}

export function isCmsUploadFolder(value: string): value is CmsUploadFolder {
  return (CMS_UPLOAD_FOLDERS as readonly string[]).includes(value)
}

export { cloudinary }
