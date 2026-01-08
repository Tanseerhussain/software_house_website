import { NextResponse } from "next/server"

// TODO: Setup MongoDB connection
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    // TODO: Fetch from MongoDB
    const { db } = await connectToDatabase()
    const posts = await db.collection('blog_posts')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Temporary mock data
    // const posts = [];
    const store = [];

    return NextResponse.json({ posts }, { status: 200 })
  } catch (e) {
    console.error("[fetching ] Error fetching blog posts:", e)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
