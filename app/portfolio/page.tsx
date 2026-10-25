import { SiteChrome } from "@/components/site-chrome"
import { PortfolioContent } from "@/components/portfolio-content"
import { getPublishedPortfolio } from "@/lib/cms/queries"

export default async function PortfolioPage() {
  const projects = await getPublishedPortfolio()

  return (
    <SiteChrome>
      <PortfolioContent projects={projects} />
    </SiteChrome>
  )
}
