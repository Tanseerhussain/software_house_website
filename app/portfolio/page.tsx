"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ExternalLink, Github } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

const categories = ["All", "Web Development", "Mobile Apps", "UI/UX Design", "AI Solutions"]

const projects = [
  {
    id: 1,
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "Modern online shopping platform with real-time inventory and secure payment processing.",
    image: "/modern-ecommerce-platform.jpg",
    technologies: ["Next.js", "MongoDB", "Stripe", "Tailwind CSS"],
    link: "#",
    github: "#",
  },
  {
    id: 2,
    title: "Fitness Tracking App",
    category: "Mobile Apps",
    description: "Cross-platform mobile app for tracking workouts, nutrition, and health metrics.",
    image: "/fitness-mobile-app-interface.png",
    technologies: ["React Native", "Node.js", "MongoDB", "Firebase"],
    link: "#",
    github: "#",
  },
  {
    id: 3,
    title: "SaaS Dashboard",
    category: "UI/UX Design",
    description: "Clean, intuitive dashboard design for a B2B analytics platform.",
    image: "/saas-analytics-dashboard.png",
    technologies: ["Figma", "React", "D3.js", "Material UI"],
    link: "#",
    github: "#",
  },
  {
    id: 4,
    title: "AI Chatbot Platform",
    category: "AI Solutions",
    description: "Intelligent chatbot system with natural language processing and sentiment analysis.",
    image: "/ai-chatbot-interface.png",
    technologies: ["Python", "TensorFlow", "React", "WebSocket"],
    link: "#",
    github: "#",
  },
  {
    id: 5,
    title: "Real Estate Portal",
    category: "Web Development",
    description: "Property listing platform with advanced search filters and virtual tours.",
    image: "/real-estate-website-hero.png",
    technologies: ["Next.js", "PostgreSQL", "Google Maps API", "AWS"],
    link: "#",
    github: "#",
  },
  {
    id: 6,
    title: "Food Delivery App",
    category: "Mobile Apps",
    description: "Seamless food ordering experience with real-time tracking and multiple payment options.",
    image: "/food-delivery-app-screen.png",
    technologies: ["Flutter", "Node.js", "MongoDB", "Socket.io"],
    link: "#",
    github: "#",
  },
]

export default function PortfolioPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")

  const filteredProjects =
    selectedCategory === "All" ? projects : projects.filter((project) => project.category === selectedCategory)

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
                  Portfolio
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed text-balance">
                Explore our latest projects and see how we've helped businesses transform their digital presence.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-12 sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
          <div className="container mx-auto px-4">
            <div className="flex flex-wrap justify-center gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2 rounded-lg font-medium transition-all ${
                    selectedCategory === category
                      ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-cyan-500/50"
                      : "bg-white/5 text-gray-300 hover:bg-white/10"
                  }`}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>
        </section>

        {/* Projects Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProjects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  layout
                  className="group"
                >
                  <div className="bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    <div className="relative h-64 overflow-hidden">
                      <Image
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                    </div>

                    <div className="p-6">
                      <div className="text-xs text-cyan-400 font-semibold mb-2 uppercase tracking-wider">
                        {project.category}
                      </div>
                      <h3 className="text-2xl font-semibold text-white mb-3">{project.title}</h3>
                      <p className="text-gray-400 leading-relaxed mb-4">{project.description}</p>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {project.technologies.map((tech) => (
                          <span
                            key={tech}
                            className="px-3 py-1 text-xs bg-white/5 text-gray-300 rounded-full border border-white/10"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-4">
                        <a
                          href={project.link}
                          className="flex items-center gap-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm font-medium"
                        >
                          <ExternalLink size={16} />
                          View Project
                        </a>
                        <a
                          href={project.github}
                          className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium"
                        >
                          <Github size={16} />
                          Source Code
                        </a>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
