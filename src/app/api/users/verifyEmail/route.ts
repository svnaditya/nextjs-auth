import { connect } from "@/dbConfig/config";
import { NextRequest, NextResponse } from "next/server";
import user from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();
    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 400 });
    }
    const foundUser = await user.findOne({
      verifyToken: token,
      verifyTokenExpiry: { $gt: Date.now() },
    });

    if (!foundUser) {
      return NextResponse.json({ message: "Invalid token" }, { status: 400 });
    }

    foundUser.isVerified = true;
    foundUser.verifyToken = null;
    foundUser.verifyTokenExpiry = null;
    await foundUser.save();

    return NextResponse.json(
      { message: "Email verified successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
