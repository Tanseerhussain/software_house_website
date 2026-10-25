import { SiteChrome } from "@/components/site-chrome"
import { AboutContent } from "@/components/about-content"
import { getAboutSetting, getPublishedTeam, getSiteBranding } from "@/lib/cms/queries"

export default async function AboutPage() {
  const [about, team, branding] = await Promise.all([getAboutSetting(), getPublishedTeam(), getSiteBranding()])

  return (
    <SiteChrome>
      <AboutContent about={about} team={team} branding={branding} />
    </SiteChrome>
  )
}
