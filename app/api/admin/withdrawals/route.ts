import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("investment") // replace with your DB name

    // Get all withdrawals
    const withdrawals = await db.collection("withdrawals").find({}).sort({ createdAt: -1 }).toArray()

    // Get all investors to populate name & email
    const investors = await db.collection("investors").find({}).toArray()

    const data = withdrawals.map((w) => {
      const inv = investors.find((i) => i._id.toString() === w.investorId?.toString())
      return {
        _id: w._id.toString(),
        investorId: w.investorId?.toString(),
        investorName: inv?.fullName || "Unknown",
        email: inv?.email || "Unknown",
        amount: w.amount,
        status: w.status,
        createdAt: w.createdAt ? w.createdAt.toISOString() : null,
      }
    })

    return NextResponse.json(data)
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Failed to fetch withdrawals" }, { status: 500 })
  }
}
