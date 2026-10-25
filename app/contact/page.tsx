import { SiteChrome } from "@/components/site-chrome"
import { ContactContent } from "@/components/contact-content"
import { getContactSetting } from "@/lib/cms/queries"

export default async function ContactPage() {
  const contact = await getContactSetting()

  return (
    <SiteChrome>
      <ContactContent contact={contact} />
    </SiteChrome>
  )
}
