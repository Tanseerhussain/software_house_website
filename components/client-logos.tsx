"use client"

import { motion } from "framer-motion"

export function ClientLogos() {
  const logos = ["Acme Corp", "TechStart", "InnovateLabs", "DataFlow", "CloudSync", "DevHub", "CodeCraft", "NextGen"]

  return (
    <section className="py-16 bg-gradient-to-b from-black to-blue-950/20">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-gray-400 text-sm uppercase tracking-wider mb-8">Trusted by industry leaders</p>
        </motion.div>

        <div className="relative overflow-hidden">
          <motion.div
            animate={{ x: [0, -1920] }}
            transition={{
              duration: 30,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            className="flex gap-16 items-center"
          >
            {[...logos, ...logos, ...logos].map((logo, index) => (
              <div
                key={index}
                className="flex-shrink-0 text-2xl font-bold text-white/20 hover:text-white/40 transition-colors whitespace-nowrap"
              >
                {logo}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
