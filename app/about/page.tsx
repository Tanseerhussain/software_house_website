"use client"

import { motion } from "framer-motion"
import { Target, Eye, Award, Users, TrendingUp, Shield } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"

const values = [
  {
    icon: TrendingUp,
    title: "Innovation",
    description: "We embrace cutting-edge technologies and creative solutions to stay ahead of the curve.",
  },
  {
    icon: Award,
    title: "Quality",
    description: "We deliver excellence in every project with rigorous testing and attention to detail.",
  },
  {
    icon: Shield,
    title: "Transparency",
    description: "Open communication and honest relationships are the foundation of our work.",
  },
  {
    icon: Users,
    title: "Client Satisfaction",
    description: "Your success is our success. We're committed to exceeding expectations.",
  },
]

const team = [
  // {
  //   name: "Tanseer Hussain",
  //   role: "CEO & Founder",
  //   // image: "/CEO.svg?height=400&width=400",
  //   image: "/ceo.png?height=400&width=400",
  //   bio: "6+ years leading tech innovation and Creative mobile app developer specializing in high-performance Android and iOS applications with a focus on usability, scalability, and modern technologies.",
  // },
  // {
  //   name: "Ali Haider",
  //   role: "CTO Full-Stack Blockchain Engineer",
  //   image: "/ctoo.jpeg?height=400&width=400",
  //   bio: "Expert in scalable system architecture with deep experience in full-stack and blockchain development, delivering secure and high-performance solutions.",
  // },
  // {
  //   name: "Hashir Daudpota",
  //   role: "Lead Backend Developer",
  //   image: "/placeholder.svg?height=400&width=400",
  //   bio: "Award-winning design specialist with strong backend expertise, crafting intuitive user experiences and robust system interfaces.",
  // },
  // {
  //   name: "Muhammad Awais",
  //   role: "Project Manager & Mobile App Developer",
  //   image: "/placeholder.svg?height=400&width=400",
  //   bio: "Results-driven project manager and app developer, ensuring timely delivery of high-quality mobile solutions with precision and reliability.",
  // },

{
  name: "Tanseer Hussain",
  role: "Chief Executive Officer (CEO) & Founder",
  image: "/ceo.png?height=400&width=400",
  bio: "Visionary leader with 6+ years of experience driving tech innovation, business growth, and building high-performance mobile and digital solutions.",
},
{
  name: "Ali Haider",
  role: "Chief Technology Officer (CTO) | Full-Stack Blockchain Engineer",
  image: "/cto.jpeg?height=400&width=400",
  bio: "Expert in scalable system architecture with deep full-stack and blockchain expertise, delivering secure, efficient, and future-ready solutions.",
},
{
  name: "Hashir Daudpota",
  role: "Lead Backend Developer",
  image: "/hashir.jpg?height=400&width=400",
  bio: "Backend specialist focused on building robust, scalable,and power seamless user experiences and reliable platforms, with a strong emphasis on performance optimization and clean architecture.",
},
{
  name: "Muhammad Awais",
  role: "Project Manager & Mobile App Developer",
  image: "/awais.jpg?height=400&width=400",
  bio: "Results-driven project manager and mobile app developer, user-focused applications with precision, efficiency, and clear communication across teams.",
}

]

const timeline = [
  { year: "2021", event: "Company Founded", description: "Started with a vision to transform digital experiences" },
  { year: "2022", event: "AI Integration", description: "Launched AI-powered solutions division" },
  { year: "2023", event: "90+ Projects", description: "Milestone of 90 successful project deliveries" },
  { year: "2024", event: "Team Expansion", description: "Grew to 15+ talented professionals" },
  { year: "2025", event: "Global Reach", description: "Expanded services to clients across multiple continents" },
]

export default function AboutPage() {
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
                About{" "}
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                  APPRIC
                </span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed text-balance">
                {/* We are a technology-driven software house delivering modern, secure, and scalable digital solutions. */}
                Founded with a vision to transform digital experiences, we are a leading software house in Gilgit-Baltistan (GB), delivering modern, secure, and scalable digital solutions while continuously innovating and expanding our services globally.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 mb-6">
                  <Target className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Our Mission</h2>
                <p className="text-gray-300 leading-relaxed">
                  To empower businesses with reliable and modern software solutions that drive growth, efficiency, and
                  innovation. We believe in creating technology that makes a meaningful impact.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-gradient-to-br from-cyan-500/10 to-teal-500/10 backdrop-blur-sm border border-white/10 rounded-2xl p-8"
              >
                <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 mb-6">
                  <Eye className="text-white" size={32} />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Our Vision</h2>
                <p className="text-gray-300 leading-relaxed">
                  To become a globally recognized technology partner, known for innovation, quality, and exceptional
                  client relationships. We aim to shape the future of digital transformation.
                </p>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-20 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Core Values</h2>
              <p className="text-gray-400 text-lg">The principles that guide everything we do</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="inline-flex p-4 rounded-xl bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border border-white/10 mb-4">
                    <value.icon className="text-cyan-400" size={32} />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-3">{value.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Our Journey</h2>
              <p className="text-gray-400 text-lg">Milestones that shaped our story</p>
            </motion.div>

            <div className="max-w-4xl mx-auto">
              {timeline.map((item, index) => (
                <motion.div
                  key={item.year}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative pl-8 pb-12 border-l-2 border-cyan-500/30 last:pb-0"
                >
                  <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500" />
                  <div className="text-cyan-400 font-bold text-lg mb-2">{item.year}</div>
                  <h3 className="text-2xl font-semibold text-white mb-2">{item.event}</h3>
                  <p className="text-gray-400 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 bg-gradient-to-b from-transparent via-blue-950/20 to-transparent">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Meet Our Team</h2>
              <p className="text-gray-400 text-lg">The talented people behind APPRIC</p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {team.map((member, index) => (
                <motion.div
                  key={member.name}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <div className="bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                    <div className="relative h-80 overflow-hidden">
                      <Image
                        src={member.image || "/placeholder.svg"}
                        alt={member.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                    </div>
                    <div className="p-6 text-center">
                      <h3 className="text-xl font-semibold text-white mb-1">{member.name}</h3>
                      <div className="text-cyan-400 text-sm font-medium mb-2">{member.role}</div>
                      <p className="text-gray-400 text-sm">{member.bio}</p>
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
