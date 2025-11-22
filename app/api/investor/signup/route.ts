import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const fullName = formData.get("fullName") as string;
    const nic = formData.get("nic") as string;
    const address = formData.get("address") as string;
    const district = formData.get("district") as string;
    const province = formData.get("province") as string;
    const postalCode = formData.get("postalCode") as string;
    const phone = formData.get("phone") as string;
    const email = formData.get("email") as string;
    const plan = formData.get("plan") as string;
    const amount = formData.get("amount") as string;
    const bankName = formData.get("bankName") as string;
    const accountNo = formData.get("accountNo") as string;
    const branchName = formData.get("branchName") as string;
    const password = formData.get("password") as string;

    const nicFile = formData.get("nicFile") as File;
    const bankBookFile = formData.get("bankBookFile") as File;

    if (
      !fullName ||
      !nic ||
      !address ||
      !district ||
      !province ||
      !postalCode ||
      !phone ||
      !email ||
      !plan ||
      !amount ||
      !bankName ||
      !accountNo ||
      !branchName ||
      !password ||
      !nicFile ||
      !bankBookFile
    ) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save uploaded files to public/uploads
    const uploadDir = path.join(process.cwd(), "public/uploads");
    const nicBuffer = Buffer.from(await nicFile.arrayBuffer());
    const bankBookBuffer = Buffer.from(await bankBookFile.arrayBuffer());

    const nicFileName = `nic_${Date.now()}_${nicFile.name}`;
    const bankBookFileName = `bankBook_${Date.now()}_${bankBookFile.name}`;

    await writeFile(path.join(uploadDir, nicFileName), nicBuffer);
    await writeFile(path.join(uploadDir, bankBookFileName), bankBookBuffer);

    // Save in MongoDB
    const client = await clientPromise;
    const db = client.db("investment");

    await db.collection("investors").insertOne({
      fullName,
      nic,
      address,
      district,
      province,
      postalCode,
      phone,
      email,
      plan,
      amount,
      bankName,
      accountNo,
      branchName,
      password: hashedPassword,
      nicFile: `/uploads/${nicFileName}`,
      bankBookFile: `/uploads/${bankBookFileName}`,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Investor registered successfully" });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
