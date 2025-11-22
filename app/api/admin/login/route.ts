import { NextResponse } from "next/server";

const ADMIN_EMAIL = "admin@system.com";       
const ADMIN_PASSWORD = "Admin123";           // Change to your preferred password

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { msg: "Invalid email or password" },
        { status: 401 }
      );
    }

    // generate simple token
    const token = Buffer.from(`${email}:admin`).toString("base64");

    return NextResponse.json({ token });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ msg: "Server error" }, { status: 500 });
  }
}
