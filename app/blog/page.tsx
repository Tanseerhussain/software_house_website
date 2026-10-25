import { SiteChrome } from "@/components/site-chrome"
import { BlogContent } from "@/components/blog-content"
import { getPublishedBlogPosts } from "@/lib/cms/queries"

export default async function BlogPage() {
  const posts = await getPublishedBlogPosts()

  return (
    <SiteChrome>
      <BlogContent posts={posts} />
    </SiteChrome>
  )
}
