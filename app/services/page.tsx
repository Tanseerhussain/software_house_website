import { SiteChrome } from "@/components/site-chrome"
import { ServicesContent } from "@/components/services-content"
import { getPublishedServices, getServicesPageSetting } from "@/lib/cms/queries"

export default async function ServicesPage() {
  const [services, page] = await Promise.all([getPublishedServices(), getServicesPageSetting()])

  return (
    <SiteChrome>
      <ServicesContent services={services} page={page} />
    </SiteChrome>
  )
}
