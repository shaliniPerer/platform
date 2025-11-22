import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get("authorization")
    if (!authHeader) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "mysecret")

    const client = await clientPromise
    const db = client.db("investment") // your DB name

    const investor = await db
      .collection("investors")
      .findOne({ _id: new ObjectId(decoded.id) })

    if (!investor) {
      return NextResponse.json({ message: "Investor not found" }, { status: 404 })
    }

    // Remove password before sending response
    const { password, ...investorData } = investor

    return NextResponse.json(investorData)
  } catch (err) {
    console.error("Fetch investor error:", err)
    return NextResponse.json({ message: "Server error" }, { status: 500 })
  }
}
