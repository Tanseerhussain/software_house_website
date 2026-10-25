"use client"

import { motion } from "framer-motion"
import { CmsIcon } from "@/lib/cms/icons"
import { slugify } from "@/lib/cms/utils"
import type { CmsService, ServicesPageSetting } from "@/lib/cms/types"

export function ServicesContent({
  services,
  page,
}: {
  services: CmsService[]
  page: ServicesPageSetting
}) {
  return (
    <main className="pt-24">
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-black to-cyan-950">
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {page.heading}
              </span>
            </h1>
            <p className="text-base sm:text-xl text-gray-300 leading-relaxed text-balance">{page.subheading}</p>
          </motion.div>
        </div>
      </section>

      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={service.id}
                id={slugify(service.title)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group scroll-mt-28"
              >
                <div className="h-full bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-5 sm:p-8 hover:border-white/20 transition-all">
                  <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.colorGradient} mb-6`}>
                    <CmsIcon name={service.icon} className="text-white" size={32} />
                  </div>
                  <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                  <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                        <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.colorGradient}`} />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-cyan-950/50" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">{page.ctaHeading}</h2>
            <p className="text-gray-300 text-lg mb-8 leading-relaxed">{page.ctaText}</p>
            <a
              href={page.ctaHref || "/contact"}
              className="inline-flex w-full items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all sm:w-auto"
            >
              {page.ctaLabel}
            </a>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
