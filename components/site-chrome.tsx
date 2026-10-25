import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { WhatsAppFloat } from "@/components/whatsapp-float"
import { getContactSetting, getPublishedServices, getSiteBranding } from "@/lib/cms/queries"

export async function SiteChrome({ children }: { children: React.ReactNode }) {
  const [branding, contact, services] = await Promise.all([
    getSiteBranding(),
    getContactSetting(),
    getPublishedServices(),
  ])

  return (
    <div className="min-h-screen bg-black">
      <Header companyName={branding.companyName} />
      {children}
      <Footer branding={branding} contact={contact} services={services} />
      <WhatsAppFloat phone={contact.phone} />
    </div>
  )
}
