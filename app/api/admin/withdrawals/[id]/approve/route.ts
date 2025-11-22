import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req, { params }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("investment");

    await db.collection("withdrawals").updateOne(
      { _id: new ObjectId(id) },
      { $set: { status: "approved" } }
    );

    const updated = await db.collection("withdrawals").findOne({ _id: new ObjectId(id) })

    return NextResponse.json({
      message: "Withdrawal approved",
      withdrawal: updated
        ? {
            _id: updated._id.toString(),
            investorId: updated.investorId?.toString(),
            amount: updated.amount,
            status: updated.status,
            createdAt: updated.createdAt ? updated.createdAt.toISOString() : null,
          }
        : null,
    })
  } catch (error) {
    console.error("APPROVE ERROR:", error);
    return NextResponse.json(
      { message: "Error approving withdrawal" },
      { status: 500 }
    );
  }
}
