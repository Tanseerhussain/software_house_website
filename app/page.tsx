import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { HeroSection } from "@/components/hero-section"
import { ServicesPreview } from "@/components/services-preview"
import { ClientLogos } from "@/components/client-logos"

export default function Home() {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <main>
        <HeroSection />
        <ServicesPreview />
        <ClientLogos />
      </main>
      <Footer />
    </div>
  )
}
