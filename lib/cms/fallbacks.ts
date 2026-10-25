import type {
  AboutSetting,
  CmsBlogPost,
  CmsLogo,
  CmsPortfolioItem,
  CmsService,
  CmsTeamMember,
  ContactSetting,
  HeroSetting,
  ServicesPageSetting,
  SiteBranding,
  StatsSetting,
} from "@/lib/cms/types"

export const FALLBACK_HERO: HeroSetting = {
  badge: "Innovative Software Solutions",
  headline: "Building the Future with",
  headlineHighlight: "Cutting-Edge Technology",
  subheadline:
    "We deliver modern, secure, and scalable digital solutions. From web development to AI integration, we transform your vision into reality.",
  primaryCtaLabel: "Get Started",
  primaryCtaHref: "/contact",
  secondaryCtaLabel: "View Our Work",
  secondaryCtaHref: "/portfolio",
}

export const FALLBACK_STATS: StatsSetting = {
  items: [
    { number: "100+", label: "Projects Delivered" },
    { number: "50+", label: "Happy Clients" },
    { number: "15+", label: "Team Members" },
    { number: "5+", label: "Years Experience" },
  ],
}

export const FALLBACK_ABOUT: AboutSetting = {
  heading: "APPRIC",
  intro:
    "Founded with a vision to transform digital experiences, we are a leading software house in Gilgit-Baltistan (GB), delivering modern, secure, and scalable digital solutions while continuously innovating and expanding our services globally.",
  mission:
    "To empower businesses with reliable and modern software solutions that drive growth, efficiency, and innovation. We believe in creating technology that makes a meaningful impact.",
  vision:
    "To become a globally recognized technology partner, known for innovation, quality, and exceptional client relationships. We aim to shape the future of digital transformation.",
  values: [
    {
      icon: "trending-up",
      title: "Innovation",
      description: "We embrace cutting-edge technologies and creative solutions to stay ahead of the curve.",
    },
    {
      icon: "award",
      title: "Quality",
      description: "We deliver excellence in every project with rigorous testing and attention to detail.",
    },
    {
      icon: "shield",
      title: "Transparency",
      description: "Open communication and honest relationships are the foundation of our work.",
    },
    {
      icon: "users",
      title: "Client Satisfaction",
      description: "Your success is our success. We're committed to exceeding expectations.",
    },
  ],
  timeline: [
    { year: "2021", event: "Company Founded", description: "Started with a vision to transform digital experiences" },
    { year: "2022", event: "AI Integration", description: "Launched AI-powered solutions division" },
    { year: "2023", event: "90+ Projects", description: "Milestone of 90 successful project deliveries" },
    { year: "2024", event: "Team Expansion", description: "Grew to 15+ talented professionals" },
    { year: "2025", event: "Global Reach", description: "Expanded services to clients across multiple continents" },
  ],
}

export const FALLBACK_CONTACT: ContactSetting = {
  email: "appric172@gmail.com",
  phone: "05811558599",
  address: "In front of CMH Main Gate, City Gilgit, Pakistan",
  hours: [
    { days: "Monday - Friday", time: "9:00 AM - 6:00 PM" },
    { days: "Saturday", time: "10:00 AM - 4:00 PM" },
    { days: "Sunday", time: "Closed" },
  ],
  mapEmbedUrl: "https://www.google.com/maps?q=CMH+Gilgit+Main+Gate&output=embed",
  mapUrl: "https://maps.app.goo.gl/BKo5ZswJ8rFC8hzD9",
}

export const FALLBACK_BRANDING: SiteBranding = {
  companyName: "APPRIC",
  tagline: "Building innovative software solutions that empower businesses worldwide.",
  footerText: "All rights reserved.",
  githubUrl: "https://github.com/Tanseerhussain",
  linkedinUrl: "https://www.linkedin.com/company/107917080/admin/dashboard/",
  twitterUrl: "",
}

export const FALLBACK_SERVICES_PAGE: ServicesPageSetting = {
  heading: "Services",
  subheading:
    "Comprehensive software solutions tailored to your business needs. From concept to deployment, we deliver excellence at every stage.",
  ctaHeading: "Ready to Start Your Project?",
  ctaText: "Let's discuss how we can help bring your vision to life with our comprehensive services.",
  ctaLabel: "Get Started Today",
  ctaHref: "/contact",
}

export const FALLBACK_SERVICES: CmsService[] = [
  {
    id: "fallback-web",
    title: "Web Development",
    description:
      "Build modern, responsive websites and web applications using Next.js, React, and the latest web technologies. We create fast, SEO-optimized solutions that scale with your business.",
    features: ["Next.js & React", "Responsive Design", "SEO Optimization", "Performance Tuning"],
    icon: "code",
    colorGradient: "from-blue-500 to-cyan-500",
    sortOrder: 1,
    isFeatured: true,
    status: "published",
  },
  {
    id: "fallback-mobile",
    title: "Mobile App Development",
    description:
      "Native and cross-platform mobile applications for iOS and Android. We deliver seamless user experiences with intuitive interfaces and robust functionality.",
    features: ["iOS & Android", "Cross-Platform", "Native Performance", "Push Notifications"],
    icon: "smartphone",
    colorGradient: "from-cyan-500 to-teal-500",
    sortOrder: 2,
    isFeatured: true,
    status: "published",
  },
  {
    id: "fallback-design",
    title: "UI/UX Design",
    description:
      "Beautiful, intuitive designs that engage users and drive conversions. We focus on user-centered design principles to create memorable digital experiences.",
    features: ["User Research", "Wireframing", "Prototyping", "Design Systems"],
    icon: "palette",
    colorGradient: "from-teal-500 to-green-500",
    sortOrder: 3,
    isFeatured: true,
    status: "published",
  },
  {
    id: "fallback-ai",
    title: "AI & Automation",
    description:
      "Intelligent solutions powered by machine learning and artificial intelligence. We help automate processes and extract insights from your data.",
    features: ["Machine Learning", "NLP Integration", "Process Automation", "Data Analysis"],
    icon: "brain",
    colorGradient: "from-green-500 to-blue-500",
    sortOrder: 4,
    isFeatured: true,
    status: "published",
  },
  {
    id: "fallback-backend",
    title: "Backend Development",
    description:
      "Robust, scalable backend systems with Node.js and MongoDB. We build secure APIs and database architectures that power your applications.",
    features: ["Node.js & Express", "MongoDB", "RESTful APIs", "Database Design"],
    icon: "database",
    colorGradient: "from-purple-500 to-pink-500",
    sortOrder: 5,
    isFeatured: false,
    status: "published",
  },
  {
    id: "fallback-cloud",
    title: "Cloud Solutions",
    description:
      "Deploy and scale your applications with modern cloud infrastructure. We optimize for performance, reliability, and cost-efficiency.",
    features: ["AWS & Vercel", "DevOps", "CI/CD Pipelines", "Monitoring"],
    icon: "cloud",
    colorGradient: "from-pink-500 to-red-500",
    sortOrder: 6,
    isFeatured: false,
    status: "published",
  },
  {
    id: "fallback-security",
    title: "Security & Testing",
    description:
      "Comprehensive security audits and quality assurance testing. We ensure your applications are secure, reliable, and bug-free.",
    features: ["Security Audits", "Penetration Testing", "QA Testing", "Code Review"],
    icon: "shield",
    colorGradient: "from-red-500 to-orange-500",
    sortOrder: 7,
    isFeatured: false,
    status: "published",
  },
  {
    id: "fallback-performance",
    title: "Performance Optimization",
    description:
      "Maximize your application's speed and efficiency. We analyze and optimize every aspect of your digital products for peak performance.",
    features: ["Speed Optimization", "Code Splitting", "Caching Strategy", "Load Balancing"],
    icon: "zap",
    colorGradient: "from-orange-500 to-yellow-500",
    sortOrder: 8,
    isFeatured: false,
    status: "published",
  },
  {
    id: "fallback-marketing",
    title: "Digital Marketing Performance",
    description:
      "Boost your brand visibility and campaign results with data-driven digital marketing strategies. We optimize every channel to maximize reach, engagement, and ROI.",
    features: [
      "Campaign Optimization",
      "Conversion Rate Optimization (CRO)",
      "Audience Targeting & Retargeting",
      "Marketing Analytics & Reporting",
    ],
    icon: "trending-up",
    colorGradient: "from-green-500 to-red-500",
    sortOrder: 9,
    isFeatured: false,
    status: "published",
  },
]

export const FALLBACK_PORTFOLIO: CmsPortfolioItem[] = [
  {
    id: "fallback-p1",
    title: "E-Commerce Platform",
    category: "Web Development",
    description: "Modern online shopping platform with real-time inventory and secure payment processing.",
    imageUrl: "/modern-ecommerce-platform.jpg",
    technologies: ["Next.js", "MongoDB", "Stripe", "Tailwind CSS"],
    projectUrl: "#",
    githubUrl: "#",
    sortOrder: 1,
    status: "published",
  },
  {
    id: "fallback-p2",
    title: "Fitness Tracking App",
    category: "Mobile Apps",
    description: "Cross-platform mobile app for tracking workouts, nutrition, and health metrics.",
    imageUrl: "/fitness-mobile-app-interface.png",
    technologies: ["React Native", "Node.js", "MongoDB", "Firebase"],
    projectUrl: "#",
    githubUrl: "#",
    sortOrder: 2,
    status: "published",
  },
  {
    id: "fallback-p3",
    title: "SaaS Dashboard",
    category: "UI/UX Design",
    description: "Clean, intuitive dashboard design for a B2B analytics platform.",
    imageUrl: "/saas-analytics-dashboard.png",
    technologies: ["Figma", "React", "D3.js", "Material UI"],
    projectUrl: "#",
    githubUrl: "#",
    sortOrder: 3,
    status: "published",
  },
  {
    id: "fallback-p4",
    title: "AI Chatbot Platform",
    category: "AI Solutions",
    description: "Intelligent chatbot system with natural language processing and sentiment analysis.",
    imageUrl: "/ai-chatbot-interface.png",
    technologies: ["Python", "TensorFlow", "React", "WebSocket"],
    projectUrl: "#",
    githubUrl: "#",
    sortOrder: 4,
    status: "published",
  },
  {
    id: "fallback-p5",
    title: "Real Estate Portal",
    category: "Web Development",
    description: "Property listing platform with advanced search filters and virtual tours.",
    imageUrl: "/real-estate-website-hero.png",
    technologies: ["Next.js", "PostgreSQL", "Google Maps API", "AWS"],
    projectUrl: "#",
    githubUrl: "#",
    sortOrder: 5,
    status: "published",
  },
  {
    id: "fallback-p6",
    title: "Food Delivery App",
    category: "Mobile Apps",
    description: "Seamless food ordering experience with real-time tracking and multiple payment options.",
    imageUrl: "/food-delivery-app-screen.png",
    technologies: ["Flutter", "Node.js", "MongoDB", "Socket.io"],
    projectUrl: "#",
    githubUrl: "#",
    sortOrder: 6,
    status: "published",
  },
]

export const FALLBACK_BLOG: CmsBlogPost[] = [
  {
    id: "fallback-b1",
    title: "The Future of Web Development: Next.js 15 and Beyond",
    slug: "the-future-of-web-development-nextjs-15-and-beyond",
    excerpt:
      "Exploring the latest features in Next.js 15 and what they mean for modern web applications. From server actions to improved caching strategies.",
    content:
      "Exploring the latest features in Next.js 15 and what they mean for modern web applications. From server actions to improved caching strategies.",
    category: "Web Development",
    authorName: "Alex Chen",
    readTime: "8 min read",
    imageUrl: "/nextjs-code-editor.jpg",
    status: "published",
    createdAt: "2024-03-15T00:00:00.000Z",
    updatedAt: "2024-03-15T00:00:00.000Z",
  },
  {
    id: "fallback-b2",
    title: "Building Cross-Platform Apps with React Native",
    slug: "building-cross-platform-apps-with-react-native",
    excerpt:
      "A comprehensive guide to creating seamless mobile experiences using React Native. Learn best practices and optimization techniques.",
    content:
      "A comprehensive guide to creating seamless mobile experiences using React Native. Learn best practices and optimization techniques.",
    category: "Mobile",
    authorName: "Sarah Johnson",
    readTime: "10 min read",
    imageUrl: "/mobile-app-development.jpg",
    status: "published",
    createdAt: "2024-03-12T00:00:00.000Z",
    updatedAt: "2024-03-12T00:00:00.000Z",
  },
  {
    id: "fallback-b3",
    title: "AI Integration in Modern Applications",
    slug: "ai-integration-in-modern-applications",
    excerpt:
      "How to leverage artificial intelligence and machine learning to create smarter, more intuitive applications for your users.",
    content:
      "How to leverage artificial intelligence and machine learning to create smarter, more intuitive applications for your users.",
    category: "AI & ML",
    authorName: "Michael Brown",
    readTime: "12 min read",
    imageUrl: "/ai-neural-network.jpg",
    status: "published",
    createdAt: "2024-03-10T00:00:00.000Z",
    updatedAt: "2024-03-10T00:00:00.000Z",
  },
  {
    id: "fallback-b4",
    title: "Design Systems: Creating Consistent UI at Scale",
    slug: "design-systems-creating-consistent-ui-at-scale",
    excerpt:
      "Building and maintaining design systems that scale with your organization. Component libraries, tokens, and documentation strategies.",
    content:
      "Building and maintaining design systems that scale with your organization. Component libraries, tokens, and documentation strategies.",
    category: "Design",
    authorName: "Emily Davis",
    readTime: "7 min read",
    imageUrl: "/design-system-components.jpg",
    status: "published",
    createdAt: "2024-03-08T00:00:00.000Z",
    updatedAt: "2024-03-08T00:00:00.000Z",
  },
  {
    id: "fallback-b5",
    title: "The Rise of Edge Computing and Serverless",
    slug: "the-rise-of-edge-computing-and-serverless",
    excerpt:
      "Understanding edge computing and serverless architecture. How they're transforming application performance and scalability.",
    content:
      "Understanding edge computing and serverless architecture. How they're transforming application performance and scalability.",
    category: "Industry Trends",
    authorName: "Alex Chen",
    readTime: "9 min read",
    imageUrl: "/cloud-computing-network.jpg",
    status: "published",
    createdAt: "2024-03-05T00:00:00.000Z",
    updatedAt: "2024-03-05T00:00:00.000Z",
  },
  {
    id: "fallback-b6",
    title: "Micro-Frontends: Scaling Frontend Development",
    slug: "micro-frontends-scaling-frontend-development",
    excerpt:
      "Breaking down monolithic frontends into manageable, independently deployable pieces. Architecture patterns and implementation strategies.",
    content:
      "Breaking down monolithic frontends into manageable, independently deployable pieces. Architecture patterns and implementation strategies.",
    category: "Web Development",
    authorName: "Sarah Johnson",
    readTime: "11 min read",
    imageUrl: "/microservices-architecture.jpg",
    status: "published",
    createdAt: "2024-03-01T00:00:00.000Z",
    updatedAt: "2024-03-01T00:00:00.000Z",
  },
]

export const FALLBACK_TEAM: CmsTeamMember[] = [
  {
    id: "fallback-t1",
    name: "Tanseer Hussain",
    role: "Chief Executive Officer (CEO) & Founder",
    bio: "Visionary leader with 6+ years of experience driving tech innovation, business growth, and building high-performance mobile and digital solutions.",
    imageUrl: "/ceo.png",
    sortOrder: 1,
    status: "published",
  },
  {
    id: "fallback-t2",
    name: "Ali Haider",
    role: "Chief Technology Officer (CTO) | Full-Stack Blockchain Engineer",
    bio: "Expert in scalable system architecture with deep full-stack and blockchain expertise, delivering secure, efficient, and future-ready solutions.",
    imageUrl: "/cto.jpeg",
    sortOrder: 2,
    status: "published",
  },
  {
    id: "fallback-t3",
    name: "Hashir Daudpota",
    role: "Lead Backend Developer",
    bio: "Backend specialist focused on building robust, scalable, and power seamless user experiences and reliable platforms, with a strong emphasis on performance optimization and clean architecture.",
    imageUrl: "/hashir.jpg",
    sortOrder: 3,
    status: "published",
  },
  {
    id: "fallback-t4",
    name: "Muhammad Awais",
    role: "Project Manager & Mobile App Developer",
    bio: "Results-driven project manager and mobile app developer, user-focused applications with precision, efficiency, and clear communication across teams.",
    imageUrl: "/awais.jpg",
    sortOrder: 4,
    status: "published",
  },
]

export const FALLBACK_LOGOS: CmsLogo[] = [
  { id: "fallback-l1", name: "Acme Corp", logoUrl: "", sortOrder: 1, status: "published" },
  { id: "fallback-l2", name: "TechStart", logoUrl: "", sortOrder: 2, status: "published" },
  { id: "fallback-l3", name: "InnovateLabs", logoUrl: "", sortOrder: 3, status: "published" },
  { id: "fallback-l4", name: "DataFlow", logoUrl: "", sortOrder: 4, status: "published" },
  { id: "fallback-l5", name: "CloudSync", logoUrl: "", sortOrder: 5, status: "published" },
  { id: "fallback-l6", name: "DevHub", logoUrl: "", sortOrder: 6, status: "published" },
  { id: "fallback-l7", name: "CodeCraft", logoUrl: "", sortOrder: 7, status: "published" },
  { id: "fallback-l8", name: "NextGen", logoUrl: "", sortOrder: 8, status: "published" },
]
