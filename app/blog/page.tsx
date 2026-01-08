"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight, Search } from "lucide-react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Image from "next/image"
import Link from "next/link"

const categories = ["All", "Web Development", "Mobile", "AI & ML", "Design", "Industry Trends"]

const blogPosts = [
  {
    id: 1,
    title: "The Future of Web Development: Next.js 15 and Beyond",
    excerpt:
      "Exploring the latest features in Next.js 15 and what they mean for modern web applications. From server actions to improved caching strategies.",
    image: "/nextjs-code-editor.jpg",
    category: "Web Development",
    author: "Alex Chen",
    date: "2024-03-15",
    readTime: "8 min read",
  },
  {
    id: 2,
    title: "Building Cross-Platform Apps with React Native",
    excerpt:
      "A comprehensive guide to creating seamless mobile experiences using React Native. Learn best practices and optimization techniques.",
    image: "/mobile-app-development.jpg",
    category: "Mobile",
    author: "Sarah Johnson",
    date: "2024-03-12",
    readTime: "10 min read",
  },
  {
    id: 3,
    title: "AI Integration in Modern Applications",
    excerpt:
      "How to leverage artificial intelligence and machine learning to create smarter, more intuitive applications for your users.",
    image: "/ai-neural-network.jpg",
    category: "AI & ML",
    author: "Michael Brown",
    date: "2024-03-10",
    readTime: "12 min read",
  },
  {
    id: 4,
    title: "Design Systems: Creating Consistent UI at Scale",
    excerpt:
      "Building and maintaining design systems that scale with your organization. Component libraries, tokens, and documentation strategies.",
    image: "/design-system-components.jpg",
    category: "Design",
    author: "Emily Davis",
    date: "2024-03-08",
    readTime: "7 min read",
  },
  {
    id: 5,
    title: "The Rise of Edge Computing and Serverless",
    excerpt:
      "Understanding edge computing and serverless architecture. How they're transforming application performance and scalability.",
    image: "/cloud-computing-network.jpg",
    category: "Industry Trends",
    author: "Alex Chen",
    date: "2024-03-05",
    readTime: "9 min read",
  },
  {
    id: 6,
    title: "Micro-Frontends: Scaling Frontend Development",
    excerpt:
      "Breaking down monolithic frontends into manageable, independently deployable pieces. Architecture patterns and implementation strategies.",
    image: "/microservices-architecture.jpg",
    category: "Web Development",
    author: "Sarah Johnson",
    date: "2024-03-01",
    readTime: "11 min read",
  },
]

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredPosts = blogPosts.filter((post) => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory
    const matchesSearch =
      searchQuery === "" ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

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
                <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Blog</span>
              </h1>
              <p className="text-xl text-gray-300 leading-relaxed text-balance mb-8">
                Insights, tutorials, and industry trends from our team of experts.
              </p>

              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="Search articles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>
            </motion.div>
          </div>
        </section>

        {/* Filter Section */}
        <section className="py-8 sticky top-20 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10">
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

        {/* Blog Grid */}
        <section className="py-20">
          <div className="container mx-auto px-4">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-gray-400 text-lg">No articles found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPosts.map((post, index) => (
                  <motion.article
                    key={post.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    layout
                    className="group"
                  >
                    <Link href={`/blog/${post.id}`}>
                      <div className="bg-gradient-to-b from-white/5 to-white/0 backdrop-blur-sm border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all h-full flex flex-col">
                        <div className="relative h-56 overflow-hidden">
                          <Image
                            src={post.image || "/placeholder.svg"}
                            alt={post.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 text-xs font-semibold bg-cyan-500 text-white rounded-full">
                              {post.category}
                            </span>
                          </div>
                        </div>

                        <div className="p-6 flex-1 flex flex-col">
                          <div className="flex items-center gap-4 text-xs text-gray-400 mb-4">
                            <span className="flex items-center gap-1">
                              <Calendar size={14} />
                              {new Date(post.date).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                year: "numeric",
                              })}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock size={14} />
                              {post.readTime}
                            </span>
                          </div>

                          <h2 className="text-xl font-semibold text-white mb-3 group-hover:text-cyan-400 transition-colors text-balance">
                            {post.title}
                          </h2>
                          <p className="text-gray-400 text-sm leading-relaxed mb-4 flex-1">{post.excerpt}</p>

                          <div className="flex items-center justify-between pt-4 border-t border-white/10">
                            <span className="text-sm text-gray-400">By {post.author}</span>
                            <span className="flex items-center gap-2 text-cyan-400 text-sm font-medium group-hover:gap-3 transition-all">
                              Read more
                              <ArrowRight size={16} />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Newsletter CTA */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-950/50 to-cyan-950/50" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center max-w-2xl mx-auto"
            >
              <h2 className="text-4xl font-bold text-white mb-4">Stay Updated</h2>
              <p className="text-gray-300 mb-8 leading-relaxed">
                Subscribe to our newsletter for the latest insights, tutorials, and industry news.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-6 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-500 transition-colors"
                />
                <button className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all">
                  Subscribe
                </button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
