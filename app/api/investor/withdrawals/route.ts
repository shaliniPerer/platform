// app/api/investor/withdrawals/route.ts
import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const investorId = url.searchParams.get("investorId")
    if (!investorId) {
      return NextResponse.json({ message: "investorId is required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("investment") // use your DB name

    const withdrawals = await db
      .collection("withdrawals")
      .find({ investorId: new ObjectId(investorId) })
      .sort({ createdAt: -1 })
      .toArray()

    // Optionally populate investor info
    const investor = await db
      .collection("investors")
      .findOne({ _id: new ObjectId(investorId) })

    const data = withdrawals.map((w) => ({
      _id: w._id.toString(),
      investorId: w.investorId?.toString(),
      investorName: investor?.fullName || "Unknown",
      email: investor?.email || "Unknown",
      amount: w.amount,
      status: w.status,
      createdAt: w.createdAt ? w.createdAt.toISOString() : null,
    }))

    return NextResponse.json(data)
  } catch (err) {
    console.error("GET /api/investor/withdrawals error:", err)
    return NextResponse.json({ message: "Failed to fetch withdrawals" }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { investorId, amount } = body

    if (!investorId || amount === undefined) {
      return NextResponse.json({ message: "investorId and amount are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("investment")

    const newDoc = {
      investorId: new ObjectId(investorId),
      amount: Number(amount),
      status: "pending",
      createdAt: new Date(),
    }

    const result = await db.collection("withdrawals").insertOne(newDoc)

    // Return the newly created withdrawal (with _id)
    const inserted = await db.collection("withdrawals").findOne({ _id: result.insertedId })

    return NextResponse.json(
      {
        message: "Withdrawal request created",
        withdrawal: inserted
          ? {
              _id: inserted._id.toString(),
              investorId: inserted.investorId?.toString(),
              amount: inserted.amount,
              status: inserted.status,
              createdAt: inserted.createdAt ? inserted.createdAt.toISOString() : null,
            }
          : null,
      },
      { status: 201 }
    )

  } catch (err) {
    console.error("POST /api/investor/withdrawals error:", err)
    return NextResponse.json({ message: "Failed to create withdrawal" }, { status: 500 })
  }
}

export async function DELETE(req: Request) {
  try {
    const body = await req.json()
    const { id } = body
    if (!id) return NextResponse.json({ message: "id required" }, { status: 400 })

    const client = await clientPromise
    const db = client.db("investment")

    // remove the withdrawal (or you can set status = 'cancelled' if you prefer)
    await db.collection("withdrawals").deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ message: "Withdrawal cancelled" })
  } catch (err) {
    console.error("DELETE /api/investor/withdrawals error:", err)
    return NextResponse.json({ message: "Failed to cancel withdrawal" }, { status: 500 })
  }
}
