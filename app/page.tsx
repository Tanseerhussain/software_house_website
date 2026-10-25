import { SiteChrome } from "@/components/site-chrome"
import { HeroSection } from "@/components/hero-section"
import { ServicesPreview } from "@/components/services-preview"
import { ClientLogos } from "@/components/client-logos"
import {
  getFeaturedServices,
  getHeroSetting,
  getPublishedLogos,
  getServicesPageSetting,
  getStatsSetting,
} from "@/lib/cms/queries"

export default async function Home() {
  const [hero, stats, services, logos, servicesPage] = await Promise.all([
    getHeroSetting(),
    getStatsSetting(),
    getFeaturedServices(),
    getPublishedLogos(),
    getServicesPageSetting(),
  ])

  return (
    <SiteChrome>
      <main>
        <HeroSection hero={hero} stats={stats.items} />
        <ServicesPreview services={services} page={servicesPage} />
        <ClientLogos logos={logos} />
      </main>
    </SiteChrome>
  )
}
