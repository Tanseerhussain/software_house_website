"use client"

import { useState, useTransition } from "react"
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  deleteWebsiteBlog,
  deleteWebsiteLogo,
  deleteWebsitePortfolio,
  deleteWebsiteService,
  deleteWebsiteTeam,
  updateSiteSetting,
  upsertWebsiteBlog,
  upsertWebsiteLogo,
  upsertWebsitePortfolio,
  upsertWebsiteService,
  upsertWebsiteTeam,
  uploadCmsImage,
} from "@/actions/cms"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CMS_ICON_OPTIONS, CMS_STATUSES, type CmsDashboardData, type CmsIconName, type CmsStatus, type CmsUploadFolder } from "@/lib/cms/types"

const GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-cyan-500 to-teal-500",
  "from-teal-500 to-green-500",
  "from-green-500 to-blue-500",
  "from-purple-500 to-pink-500",
  "from-pink-500 to-red-500",
  "from-red-500 to-orange-500",
  "from-orange-500 to-yellow-500",
  "from-green-500 to-red-500",
]

function Field({
  label,
  name,
  defaultValue,
  type = "text",
  required,
}: {
  label: string
  name: string
  defaultValue?: string | number
  type?: string
  required?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <Input id={name} name={name} type={type} defaultValue={defaultValue ?? ""} required={required} />
    </div>
  )
}

function Area({
  label,
  name,
  defaultValue,
  rows = 4,
}: {
  label: string
  name: string
  defaultValue?: string
  rows?: number
}) {
  return (
    <div className="space-y-2 sm:col-span-2">
      <Label htmlFor={name}>{label}</Label>
      <Textarea id={name} name={name} defaultValue={defaultValue ?? ""} rows={rows} />
    </div>
  )
}

function CmsImageField({
  label,
  name,
  folder,
  defaultValue,
}: {
  label: string
  name: string
  folder: CmsUploadFolder
  defaultValue?: string
}) {
  const [url, setUrl] = useState(defaultValue ?? "")
  const [uploading, setUploading] = useState(false)

  const handleFile = async (file: File | undefined) => {
    if (!file) return
    const data = new FormData()
    data.set("file", file)
    data.set("folder", folder)
    setUploading(true)
    try {
      const result = await uploadCmsImage(data)
      if (result.error) {
        toast.error(result.error)
        return
      }
      if (result.url) {
        setUrl(result.url)
        toast.success("Image uploaded to Cloudinary")
      }
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="space-y-2 sm:col-span-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://res.cloudinary.com/..."
      />
      <Input
        type="file"
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        disabled={uploading}
        onChange={(e) => {
          void handleFile(e.target.files?.[0])
          e.target.value = ""
        }}
      />
      <p className="text-xs text-muted-foreground">
        Upload stores the file in Cloudinary folder <code>appric/{folder}</code> and fills the URL. You can also paste a URL.
      </p>
      {uploading && (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin" />
          Uploading…
        </p>
      )}
      {url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt="" className="mt-1 h-24 w-24 rounded-md border object-cover" />
      )}
    </div>
  )
}

function NativeSelect({
  label,
  name,
  defaultValue,
  options,
}: {
  label: string
  name: string
  defaultValue?: string
  options: string[]
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={name}>{label}</Label>
      <select
        id={name}
        name={name}
        defaultValue={defaultValue}
        className="border-input bg-background h-9 w-full rounded-md border px-3 text-sm"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export function CmsClient({ data }: { data: CmsDashboardData }) {
  const [isPending, startTransition] = useTransition()
  const [hero, setHero] = useState(data.hero)
  const [stats, setStats] = useState(data.stats.items)
  const [about, setAbout] = useState(data.about)
  const [contact, setContact] = useState(data.contact)
  const [branding, setBranding] = useState(data.branding)
  const [servicesPage, setServicesPage] = useState(data.servicesPage)
  const [editingService, setEditingService] = useState<string | "new" | null>(null)
  const [editingPortfolio, setEditingPortfolio] = useState<string | "new" | null>(null)
  const [editingBlog, setEditingBlog] = useState<string | "new" | null>(null)
  const [editingTeam, setEditingTeam] = useState<string | "new" | null>(null)
  const [editingLogo, setEditingLogo] = useState<string | "new" | null>(null)

  const run = (fn: () => Promise<{ error?: string; success?: boolean }>, success: string) => {
    startTransition(async () => {
      const result = await fn()
      if (result.error) toast.error(result.error)
      else toast.success(success)
    })
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Website CMS</h1>
        <p className="text-muted-foreground">
          Published items appear on the public site. Drafts and archived items stay hidden.
        </p>
      </div>

      <Tabs defaultValue="hero" className="space-y-4">
        <TabsList className="flex h-auto w-full flex-wrap justify-start">
          <TabsTrigger value="hero">Hero</TabsTrigger>
          <TabsTrigger value="stats">Stats</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="services-page">Services page</TabsTrigger>
          <TabsTrigger value="services">Services</TabsTrigger>
          <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
          <TabsTrigger value="blog">Blog</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="logos">Logos</TabsTrigger>
        </TabsList>

        <TabsContent value="hero">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Homepage hero</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Badge</Label>
                <Input value={hero.badge} onChange={(e) => setHero({ ...hero, badge: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Headline</Label>
                <Input value={hero.headline} onChange={(e) => setHero({ ...hero, headline: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Headline highlight</Label>
                <Input
                  value={hero.headlineHighlight}
                  onChange={(e) => setHero({ ...hero, headlineHighlight: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Subheadline</Label>
                <Textarea
                  value={hero.subheadline}
                  onChange={(e) => setHero({ ...hero, subheadline: e.target.value })}
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label>Primary CTA label</Label>
                <Input
                  value={hero.primaryCtaLabel}
                  onChange={(e) => setHero({ ...hero, primaryCtaLabel: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Primary CTA href</Label>
                <Input
                  value={hero.primaryCtaHref}
                  onChange={(e) => setHero({ ...hero, primaryCtaHref: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary CTA label</Label>
                <Input
                  value={hero.secondaryCtaLabel}
                  onChange={(e) => setHero({ ...hero, secondaryCtaLabel: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Secondary CTA href</Label>
                <Input
                  value={hero.secondaryCtaHref}
                  onChange={(e) => setHero({ ...hero, secondaryCtaHref: e.target.value })}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() => run(() => updateSiteSetting("hero", hero), "Hero saved")}
                className="w-fit"
              >
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save hero
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Homepage stats</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setStats([...stats, { number: "", label: "" }])}
              >
                <Plus className="mr-2 h-4 w-4" />
                Add
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {stats.map((item, index) => (
                <div key={index} className="grid gap-3 sm:grid-cols-[1fr_2fr_auto]">
                  <Input
                    placeholder="100+"
                    value={item.number}
                    onChange={(e) =>
                      setStats(stats.map((row, i) => (i === index ? { ...row, number: e.target.value } : row)))
                    }
                  />
                  <Input
                    placeholder="Projects Delivered"
                    value={item.label}
                    onChange={(e) =>
                      setStats(stats.map((row, i) => (i === index ? { ...row, label: e.target.value } : row)))
                    }
                  />
                  <Button type="button" variant="ghost" onClick={() => setStats(stats.filter((_, i) => i !== index))}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button
                disabled={isPending}
                onClick={() => run(() => updateSiteSetting("stats", { items: stats }), "Stats saved")}
              >
                Save stats
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="about">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">About page</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Heading highlight</Label>
                <Input value={about.heading} onChange={(e) => setAbout({ ...about, heading: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Intro</Label>
                <Textarea value={about.intro} onChange={(e) => setAbout({ ...about, intro: e.target.value })} rows={4} />
              </div>
              <div className="space-y-2">
                <Label>Mission</Label>
                <Textarea
                  value={about.mission}
                  onChange={(e) => setAbout({ ...about, mission: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label>Vision</Label>
                <Textarea
                  value={about.vision}
                  onChange={(e) => setAbout({ ...about, vision: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Values</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAbout({
                      ...about,
                      values: [...about.values, { icon: "award", title: "", description: "" }],
                    })
                  }
                >
                  Add value
                </Button>
              </div>
              {about.values.map((value, index) => (
                <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2">
                  <Select
                    value={value.icon}
                    onValueChange={(icon) =>
                      setAbout({
                        ...about,
                        values: about.values.map((row, i) =>
                          i === index ? { ...row, icon: icon as CmsIconName } : row
                        ),
                      })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CMS_ICON_OPTIONS.map((icon) => (
                        <SelectItem key={icon} value={icon}>
                          {icon}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Title"
                    value={value.title}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        values: about.values.map((row, i) => (i === index ? { ...row, title: e.target.value } : row)),
                      })
                    }
                  />
                  <Textarea
                    className="sm:col-span-2"
                    placeholder="Description"
                    value={value.description}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        values: about.values.map((row, i) =>
                          i === index ? { ...row, description: e.target.value } : row
                        ),
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-fit"
                    onClick={() => setAbout({ ...about, values: about.values.filter((_, i) => i !== index) })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Timeline</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setAbout({
                      ...about,
                      timeline: [...about.timeline, { year: "", event: "", description: "" }],
                    })
                  }
                >
                  Add milestone
                </Button>
              </div>
              {about.timeline.map((item, index) => (
                <div key={index} className="grid gap-3 rounded-lg border p-3 sm:grid-cols-3">
                  <Input
                    placeholder="Year"
                    value={item.year}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        timeline: about.timeline.map((row, i) => (i === index ? { ...row, year: e.target.value } : row)),
                      })
                    }
                  />
                  <Input
                    className="sm:col-span-2"
                    placeholder="Event"
                    value={item.event}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        timeline: about.timeline.map((row, i) => (i === index ? { ...row, event: e.target.value } : row)),
                      })
                    }
                  />
                  <Textarea
                    className="sm:col-span-3"
                    placeholder="Description"
                    value={item.description}
                    onChange={(e) =>
                      setAbout({
                        ...about,
                        timeline: about.timeline.map((row, i) =>
                          i === index ? { ...row, description: e.target.value } : row
                        ),
                      })
                    }
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-fit"
                    onClick={() => setAbout({ ...about, timeline: about.timeline.filter((_, i) => i !== index) })}
                  >
                    Remove
                  </Button>
                </div>
              ))}
              <Button disabled={isPending} onClick={() => run(() => updateSiteSetting("about", about), "About saved")}>
                Save about
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="contact">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Contact details</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Email</Label>
                <Input value={contact.email} onChange={(e) => setContact({ ...contact, email: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Phone</Label>
                <Input value={contact.phone} onChange={(e) => setContact({ ...contact, phone: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Address</Label>
                <Input value={contact.address} onChange={(e) => setContact({ ...contact, address: e.target.value })} />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Map embed URL</Label>
                <Input
                  value={contact.mapEmbedUrl}
                  onChange={(e) => setContact({ ...contact, mapEmbedUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Map link URL</Label>
                <Input value={contact.mapUrl} onChange={(e) => setContact({ ...contact, mapUrl: e.target.value })} />
              </div>
              {contact.hours.map((row, index) => (
                <div key={index} className="contents">
                  <Input
                    placeholder="Monday - Friday"
                    value={row.days}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        hours: contact.hours.map((item, i) => (i === index ? { ...item, days: e.target.value } : item)),
                      })
                    }
                  />
                  <Input
                    placeholder="9:00 AM - 6:00 PM"
                    value={row.time}
                    onChange={(e) =>
                      setContact({
                        ...contact,
                        hours: contact.hours.map((item, i) => (i === index ? { ...item, time: e.target.value } : item)),
                      })
                    }
                  />
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => setContact({ ...contact, hours: [...contact.hours, { days: "", time: "" }] })}
              >
                Add hours row
              </Button>
              <Button
                disabled={isPending}
                onClick={() => run(() => updateSiteSetting("contact", contact), "Contact saved")}
              >
                Save contact
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Site branding</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Company name</Label>
                <Input
                  value={branding.companyName}
                  onChange={(e) => setBranding({ ...branding, companyName: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Footer text</Label>
                <Input
                  value={branding.footerText}
                  onChange={(e) => setBranding({ ...branding, footerText: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Tagline</Label>
                <Textarea
                  value={branding.tagline}
                  onChange={(e) => setBranding({ ...branding, tagline: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>GitHub URL</Label>
                <Input
                  value={branding.githubUrl}
                  onChange={(e) => setBranding({ ...branding, githubUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>LinkedIn URL</Label>
                <Input
                  value={branding.linkedinUrl}
                  onChange={(e) => setBranding({ ...branding, linkedinUrl: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Twitter URL</Label>
                <Input
                  value={branding.twitterUrl}
                  onChange={(e) => setBranding({ ...branding, twitterUrl: e.target.value })}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() => run(() => updateSiteSetting("site_branding", branding), "Branding saved")}
              >
                Save branding
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services-page">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Services page copy</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Heading</Label>
                <Input
                  value={servicesPage.heading}
                  onChange={(e) => setServicesPage({ ...servicesPage, heading: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA label</Label>
                <Input
                  value={servicesPage.ctaLabel}
                  onChange={(e) => setServicesPage({ ...servicesPage, ctaLabel: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>Subheading</Label>
                <Textarea
                  value={servicesPage.subheading}
                  onChange={(e) => setServicesPage({ ...servicesPage, subheading: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA heading</Label>
                <Input
                  value={servicesPage.ctaHeading}
                  onChange={(e) => setServicesPage({ ...servicesPage, ctaHeading: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CTA href</Label>
                <Input
                  value={servicesPage.ctaHref}
                  onChange={(e) => setServicesPage({ ...servicesPage, ctaHref: e.target.value })}
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label>CTA text</Label>
                <Textarea
                  value={servicesPage.ctaText}
                  onChange={(e) => setServicesPage({ ...servicesPage, ctaText: e.target.value })}
                />
              </div>
              <Button
                disabled={isPending}
                onClick={() => run(() => updateSiteSetting("services_page", servicesPage), "Services page saved")}
              >
                Save services page
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services">
          <CollectionCard
            title="Services"
            onAdd={() => setEditingService("new")}
            items={data.services.map((item) => ({
              id: item.id,
              title: item.title,
              meta: item.isFeatured ? "featured" : undefined,
              status: item.status,
              onEdit: () => setEditingService(item.id),
              onDelete: () => run(() => deleteWebsiteService(item.id), "Service deleted"),
            }))}
          />
          {editingService && (
            <ItemForm
              title={editingService === "new" ? "New service" : "Edit service"}
              onClose={() => setEditingService(null)}
              action={upsertWebsiteService}
              pending={isPending}
              start={startTransition}
            >
              {(() => {
                const item = data.services.find((row) => row.id === editingService)
                return (
                  <>
                    {item && <input type="hidden" name="id" value={item.id} />}
                    <Field label="Title" name="title" defaultValue={item?.title} required />
                    <Area label="Description" name="description" defaultValue={item?.description} />
                    <Area
                      label="Features (one per line)"
                      name="features"
                      defaultValue={item?.features.join("\n")}
                    />
                    <NativeSelect label="Icon" name="icon" defaultValue={item?.icon ?? "code"} options={[...CMS_ICON_OPTIONS]} />
                    <NativeSelect
                      label="Color gradient"
                      name="color_gradient"
                      defaultValue={item?.colorGradient ?? GRADIENTS[0]}
                      options={GRADIENTS}
                    />
                    <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
                    <NativeSelect label="Status" name="status" defaultValue={item?.status ?? "published"} options={[...CMS_STATUSES]} />
                    <label className="flex items-center gap-2 text-sm sm:col-span-2">
                      <input type="checkbox" name="is_featured" defaultChecked={item?.isFeatured} />
                      Featured on homepage
                    </label>
                  </>
                )
              })()}
            </ItemForm>
          )}
        </TabsContent>

        <TabsContent value="portfolio">
          <CollectionCard
            title="Portfolio"
            onAdd={() => setEditingPortfolio("new")}
            items={data.portfolio.map((item) => ({
              id: item.id,
              title: item.title,
              meta: item.category,
              status: item.status,
              onEdit: () => setEditingPortfolio(item.id),
              onDelete: () => run(() => deleteWebsitePortfolio(item.id), "Project deleted"),
            }))}
          />
          {editingPortfolio && (
            <ItemForm
              title={editingPortfolio === "new" ? "New project" : "Edit project"}
              onClose={() => setEditingPortfolio(null)}
              action={upsertWebsitePortfolio}
              pending={isPending}
              start={startTransition}
            >
              {(() => {
                const item = data.portfolio.find((row) => row.id === editingPortfolio)
                return (
                  <>
                    {item && <input type="hidden" name="id" value={item.id} />}
                    <Field label="Title" name="title" defaultValue={item?.title} required />
                    <Field label="Category" name="category" defaultValue={item?.category} />
                    <Area label="Description" name="description" defaultValue={item?.description} />
                    <CmsImageField
                      label="Image"
                      name="image_url"
                      folder="portfolio"
                      defaultValue={item?.imageUrl}
                    />
                    <Area
                      label="Technologies (one per line)"
                      name="technologies"
                      defaultValue={item?.technologies.join("\n")}
                    />
                    <Field label="Project URL" name="project_url" defaultValue={item?.projectUrl} />
                    <Field label="GitHub URL" name="github_url" defaultValue={item?.githubUrl} />
                    <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
                    <NativeSelect label="Status" name="status" defaultValue={item?.status ?? "published"} options={[...CMS_STATUSES]} />
                  </>
                )
              })()}
            </ItemForm>
          )}
        </TabsContent>

        <TabsContent value="blog">
          <CollectionCard
            title="Blog"
            onAdd={() => setEditingBlog("new")}
            items={data.blog.map((item) => ({
              id: item.id,
              title: item.title,
              meta: item.slug,
              status: item.status,
              onEdit: () => setEditingBlog(item.id),
              onDelete: () => run(() => deleteWebsiteBlog(item.id), "Post deleted"),
            }))}
          />
          {editingBlog && (
            <ItemForm
              title={editingBlog === "new" ? "New post" : "Edit post"}
              onClose={() => setEditingBlog(null)}
              action={upsertWebsiteBlog}
              pending={isPending}
              start={startTransition}
            >
              {(() => {
                const item = data.blog.find((row) => row.id === editingBlog)
                return (
                  <>
                    {item && <input type="hidden" name="id" value={item.id} />}
                    <Field label="Title" name="title" defaultValue={item?.title} required />
                    <Field label="Slug (optional)" name="slug" defaultValue={item?.slug} />
                    <Field label="Category" name="category" defaultValue={item?.category} />
                    <Field label="Author" name="author_name" defaultValue={item?.authorName} />
                    <Field label="Read time" name="read_time" defaultValue={item?.readTime} />
                    <CmsImageField
                      label="Image"
                      name="image_url"
                      folder="blog"
                      defaultValue={item?.imageUrl}
                    />
                    <NativeSelect label="Status" name="status" defaultValue={item?.status ?? "published"} options={[...CMS_STATUSES]} />
                    <Area label="Excerpt" name="excerpt" defaultValue={item?.excerpt} />
                    <Area label="Content" name="content" defaultValue={item?.content} rows={8} />
                  </>
                )
              })()}
            </ItemForm>
          )}
        </TabsContent>

        <TabsContent value="team">
          <CollectionCard
            title="Team"
            onAdd={() => setEditingTeam("new")}
            items={data.team.map((item) => ({
              id: item.id,
              title: item.name,
              meta: item.role,
              status: item.status,
              onEdit: () => setEditingTeam(item.id),
              onDelete: () => run(() => deleteWebsiteTeam(item.id), "Team member deleted"),
            }))}
          />
          {editingTeam && (
            <ItemForm
              title={editingTeam === "new" ? "New team member" : "Edit team member"}
              onClose={() => setEditingTeam(null)}
              action={upsertWebsiteTeam}
              pending={isPending}
              start={startTransition}
            >
              {(() => {
                const item = data.team.find((row) => row.id === editingTeam)
                return (
                  <>
                    {item && <input type="hidden" name="id" value={item.id} />}
                    <Field label="Name" name="name" defaultValue={item?.name} required />
                    <Field label="Role" name="role" defaultValue={item?.role} />
                    <CmsImageField
                      label="Image"
                      name="image_url"
                      folder="team"
                      defaultValue={item?.imageUrl}
                    />
                    <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
                    <NativeSelect label="Status" name="status" defaultValue={item?.status ?? "published"} options={[...CMS_STATUSES]} />
                    <Area label="Bio" name="bio" defaultValue={item?.bio} />
                  </>
                )
              })()}
            </ItemForm>
          )}
        </TabsContent>

        <TabsContent value="logos">
          <CollectionCard
            title="Client logos"
            onAdd={() => setEditingLogo("new")}
            items={data.logos.map((item) => ({
              id: item.id,
              title: item.name,
              status: item.status,
              onEdit: () => setEditingLogo(item.id),
              onDelete: () => run(() => deleteWebsiteLogo(item.id), "Logo deleted"),
            }))}
          />
          {editingLogo && (
            <ItemForm
              title={editingLogo === "new" ? "New logo" : "Edit logo"}
              onClose={() => setEditingLogo(null)}
              action={upsertWebsiteLogo}
              pending={isPending}
              start={startTransition}
            >
              {(() => {
                const item = data.logos.find((row) => row.id === editingLogo)
                return (
                  <>
                    {item && <input type="hidden" name="id" value={item.id} />}
                    <Field label="Name" name="name" defaultValue={item?.name} required />
                    <CmsImageField
                      label="Logo"
                      name="logo_url"
                      folder="logos"
                      defaultValue={item?.logoUrl}
                    />
                    <Field label="Sort order" name="sort_order" type="number" defaultValue={item?.sortOrder ?? 0} />
                    <NativeSelect label="Status" name="status" defaultValue={item?.status ?? "published"} options={[...CMS_STATUSES]} />
                  </>
                )
              })()}
            </ItemForm>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}

function CollectionCard({
  title,
  onAdd,
  items,
}: {
  title: string
  onAdd: () => void
  items: {
    id: string
    title: string
    meta?: string
    status: CmsStatus
    onEdit: () => void
    onDelete: () => void
  }[]
}) {
  return (
    <Card className="mb-4">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button size="sm" onClick={onAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Add
        </Button>
      </CardHeader>
      <CardContent className="space-y-2">
        {items.length === 0 && <p className="text-sm text-muted-foreground">No items yet. Fallbacks show on the public site until you add published records.</p>}
        {items.map((item) => (
          <div key={item.id} className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="font-medium">{item.title}</div>
              <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
                {item.meta && <span>{item.meta}</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={item.onEdit}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </Button>
              <Button size="sm" variant="ghost" onClick={item.onDelete}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

function ItemForm({
  title,
  onClose,
  action,
  pending,
  start,
  children,
}: {
  title: string
  onClose: () => void
  action: (formData: FormData) => Promise<{ error?: string; success?: boolean }>
  pending: boolean
  start: (fn: () => Promise<void>) => void
  children: React.ReactNode
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">{title}</CardTitle>
        <Button variant="ghost" size="sm" onClick={onClose}>
          Close
        </Button>
      </CardHeader>
      <CardContent>
        <form
          className="grid gap-4 sm:grid-cols-2"
          action={(formData) => {
            start(async () => {
              const result = await action(formData)
              if (result.error) toast.error(result.error)
              else {
                toast.success("Saved")
                onClose()
              }
            })
          }}
        >
          {children}
          <Button type="submit" disabled={pending} className="w-fit">
            {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
