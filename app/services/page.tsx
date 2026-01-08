"use client"

import { motion } from "framer-motion"
import { Code, Smartphone, Palette, Brain, Database, Cloud, Shield, Zap } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { TrendingUp } from "lucide-react"

const services = [
  {
    icon: Code,
    title: "Web Development",
    description:
      "Build modern, responsive websites and web applications using Next.js, React, and the latest web technologies. We create fast, SEO-optimized solutions that scale with your business.",
    features: ["Next.js & React", "Responsive Design", "SEO Optimization", "Performance Tuning"],
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android. We deliver seamless user experiences with intuitive interfaces and robust functionality.",
    features: ["iOS & Android", "Cross-Platform", "Native Performance", "Push Notifications"],
    color: "from-cyan-500 to-teal-500",
  },
  {
    icon: Palette,
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive designs that engage users and drive conversions. We focus on user-centered design principles to create memorable digital experiences.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    color: "from-teal-500 to-green-500",
  },
  {
    icon: Brain,
    title: "AI & Automation",
    description:
      "Intelligent solutions powered by machine learning and artificial intelligence. We help automate processes and extract insights from your data.",
    features: ["Machine Learning", "NLP Integration", "Process Automation", "Data Analysis"],
    color: "from-green-500 to-blue-500",
  },
  {
    icon: Database,
    title: "Backend Development",
    description:
      "Robust, scalable backend systems with Node.js and MongoDB. We build secure APIs and database architectures that power your applications.",
    features: ["Node.js & Express", "MongoDB", "RESTful APIs", "Database Design"],
    color: "from-purple-500 to-pink-500",
  },
  {
    icon: Cloud,
    title: "Cloud Solutions",
    description:
      "Deploy and scale your applications with modern cloud infrastructure. We optimize for performance, reliability, and cost-efficiency.",
    features: ["AWS & Vercel", "DevOps", "CI/CD Pipelines", "Monitoring"],
    color: "from-pink-500 to-red-500",
  },
  {
    icon: Shield,
    title: "Security & Testing",
    description:
      "Comprehensive security audits and quality assurance testing. We ensure your applications are secure, reliable, and bug-free.",
    features: ["Security Audits", "Penetration Testing", "QA Testing", "Code Review"],
    color: "from-red-500 to-orange-500",
  },
  {
    icon: Zap,
    title: "Performance Optimization",
    description:
      "Maximize your application's speed and efficiency. We analyze and optimize every aspect of your digital products for peak performance.",
    features: ["Speed Optimization", "Code Splitting", "Caching Strategy", "Load Balancing"],
    color: "from-orange-500 to-yellow-500",
  },
{
  icon: TrendingUp,
  title: "Digital Marketing Performance",
  description:
    "Boost your brand visibility and campaign results with data-driven digital marketing strategies. We optimize every channel to maximize reach, engagement, and ROI.",
  features: [
    "Campaign Optimization",
    "Conversion Rate Optimization (CRO)",
    "Audience Targeting & Retargeting",
    "Marketing Analytics & Reporting"
  ],
  color: "from-green-500 to-red-500",
},

]

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black">
      <Header />

      <main className="pt-24">
        {/* Hero Section */}
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
              <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 text-balance">
                Our{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  Services
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed text-balance">
                Comprehensive software solutions tailored to your business needs. From concept to deployment, we deliver
                excellence at every stage.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Services Grid */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service, index) => (
                <motion.div
                  key={service.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="h-full bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-white/20 transition-all">
                    <div className={`inline-flex p-4 rounded-xl bg-gradient-to-r ${service.color} mb-6`}>
                      <service.icon className="text-white" size={32} />
                    </div>
                    <h3 className="text-2xl font-semibold text-white mb-4">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature) => (
                        <li key={feature} className="flex items-center gap-2 text-gray-300 text-sm">
                          <div className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${service.color}`} />
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

        {/* CTA Section */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-cyan-950/50" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-3xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-6">Ready to Start Your Project?</h2>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Let's discuss how we can help bring your vision to life with our comprehensive services.
              </p>
              <a
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
              >
                Get Started Today
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
