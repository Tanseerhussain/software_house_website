import { NextResponse } from "next/server"

// TODO: Setup MongoDB connection
import { connectToDatabase } from '@/lib/mongodb'

export async function GET() {
  try {
    // TODO: Fetch from MongoDB
    const { db } = await connectToDatabase()
    const services = await db.collection('services').find({}).toArray()

    // Temporary mock data
    // const services = []
    const servicess = []


    return NextResponse.json({ services }, { status: 200 })
  } catch (error) {
    console.error("[Roy] Error fetching services:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
