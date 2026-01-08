// API utility functions for backend integration

// Contact form submission
export async function submitContactForm(data: {
  name: string
  email: string
  company?: string
  message: string
}) {
  const response = await fetch("/api/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error("Failed to submit contact form")
  }

  return response.json()
}

// Fetch blog posts
export async function getBlogPosts() {
  const response = await fetch("/api/blog")
  if (!response.ok) {
    throw new Error("Failed to fetch blog posts")
  }
  return response.json()
}

// Fetch single blog post
export async function getBlogPost(id: string) {
  const response = await fetch(`/api/blog/${id}`)
  if (!response.ok) {
    throw new Error("Failed to fetch blog post")
  }
  return response.json()
}

// Fetch portfolio projects
export async function getPortfolioProjects() {
  const response = await fetch("/api/projects")
  if (!response.ok) {
    throw new Error("Failed to fetch projects")
  }
  return response.json()
}

// Fetch services
export async function getServices() {
  const response = await fetch("/api/services")
  if (!response.ok) {
    throw new Error("Failed to fetch services")
  }
  return response.json()
}
