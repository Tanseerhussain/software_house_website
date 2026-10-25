"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Github, Linkedin, Twitter, Mail } from "lucide-react"
import type { CmsService, ContactSetting, SiteBranding } from "@/lib/cms/types"
import { slugify } from "@/lib/cms/utils"

export function Footer({
  branding,
  contact,
  services,
}: {
  branding: SiteBranding
  contact: ContactSetting
  services: CmsService[]
}) {
  const currentYear = new Date().getFullYear()
  const footerServices = services.slice(0, 4)
  const socialLinks = [
    { icon: Github, href: branding.githubUrl, label: "GitHub" },
    { icon: Linkedin, href: branding.linkedinUrl, label: "LinkedIn" },
    { icon: Twitter, href: branding.twitterUrl, label: "Twitter" },
    { icon: Mail, href: contact.email ? `mailto:${contact.email}` : "/contact", label: "Email" },
  ].filter((item) => item.href)

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-4">
              {branding.companyName}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">{branding.tagline}</p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Company</h4>
            <ul className="space-y-2">
              {[
                { name: "About", href: "/about" },
                { name: "Services", href: "/services" },
                { name: "Portfolio", href: "/portfolio" },
                { name: "Blog", href: "/blog" },
              ].map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Services</h4>
            <ul className="space-y-2">
              {footerServices.map((service) => (
                <li key={service.id}>
                  <Link
                    href={`/services#${slugify(service.title)}`}
                    className="text-gray-400 hover:text-white transition-colors text-sm"
                  >
                    {service.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 mb-4">
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors text-sm">
                  Contact Us
                </Link>
              </li>
              {contact.email && (
                <li>
                  <a href={`mailto:${contact.email}`} className="text-gray-400 hover:text-white transition-colors text-sm">
                    {contact.email}
                  </a>
                </li>
              )}
            </ul>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={20} />
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">
            © {currentYear} {branding.companyName}. {branding.footerText}
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-sm transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
