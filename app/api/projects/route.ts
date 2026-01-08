import { NextResponse } from "next/server"

// TODO: Setup MongoDB connection
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    // TODO: Fetch from MongoDB
    const { db } = await connectToDatabase()
    const projects = await db.collection('projects')
      .find({})
      .sort({ createdAt: -1 })
      .toArray()

    // Temporary mock data
    // const projects = []
    const projectss = [];

    return NextResponse.json({ projects }, { status: 200 })
  } catch (error) {
    console.error("[Roy] Error fetching projects:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
