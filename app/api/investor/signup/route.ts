import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
// Configure Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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

    // Upload files to Cloudinary
    const nicBuffer = Buffer.from(await nicFile.arrayBuffer());
    const bankBookBuffer = Buffer.from(await bankBookFile.arrayBuffer());

    // Helper to upload buffer to Cloudinary
    async function uploadToCloudinary(buffer, filename) {
      return new Promise((resolve, reject) => {
        cloudinary.v2.uploader.upload_stream(
          { resource_type: "auto", public_id: filename },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(buffer);
      });
    }

    const nicUpload = await uploadToCloudinary(nicBuffer, `nic_${Date.now()}_${nicFile.name}`);
    const bankBookUpload = await uploadToCloudinary(bankBookBuffer, `bankBook_${Date.now()}_${bankBookFile.name}`);

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
      nicFile: nicUpload.secure_url,
      bankBookFile: bankBookUpload.secure_url,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Investor registered successfully" });

  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
