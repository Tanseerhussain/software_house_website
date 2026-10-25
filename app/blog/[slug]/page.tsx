import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { SiteChrome } from "@/components/site-chrome"
import { getPublishedBlogPost } from "@/lib/cms/queries"

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPublishedBlogPost(slug)
  if (!post) notFound()

  return (
    <SiteChrome>
      <main className="pt-24">
        <article className="container mx-auto max-w-3xl px-4 py-16">
          <Link href="/blog" className="mb-8 inline-block text-sm text-cyan-400 hover:text-cyan-300">
            ← Back to blog
          </Link>
          <p className="mb-3 text-sm uppercase tracking-wider text-cyan-400">{post.category}</p>
          <h1 className="mb-4 text-3xl font-bold text-white sm:text-5xl">{post.title}</h1>
          <p className="mb-8 text-sm text-gray-400">
            By {post.authorName}
            {post.readTime ? ` · ${post.readTime}` : ""}
            {` · ${new Date(post.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`}
          </p>
          {post.imageUrl && (
            <div className="relative mb-10 h-64 overflow-hidden rounded-2xl sm:h-80">
              <Image src={post.imageUrl} alt={post.title} fill className="object-cover" />
            </div>
          )}
          <div className="whitespace-pre-wrap text-base leading-relaxed text-gray-300">{post.content || post.excerpt}</div>
        </article>
      </main>
    </SiteChrome>
  )
}
