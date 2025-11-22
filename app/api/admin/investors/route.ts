import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("investment")

    const investors = await db.collection("investors").find().toArray()

    return NextResponse.json(investors)
  } catch (error) {
    console.error("Investors fetch error:", error)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
