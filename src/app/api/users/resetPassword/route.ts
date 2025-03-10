import { connect } from "@/dbConfig/config";
import { NextRequest, NextResponse } from "next/server";
import user from "@/models/userModel";
import bcrypt from "bcryptjs";

connect();

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token) {
      return NextResponse.json({ message: "Token not found" }, { status: 400 });
    }
    if (!password) {
      return NextResponse.json({ message: "Password not found" }, { status: 400 });
    }
    const foundUser = await user.findOne({
        forgotPasswordToken: token,
        forgotPasswordTokenExpiry: { $gt: Date.now() },
    });

    if (!foundUser) {
      return NextResponse.json({ message: "Invalid or expired token" }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    foundUser.isVerified = true;
    foundUser.forgotPasswordToken = null;
    foundUser.forgotPasswordTokenExpiry = null;
    foundUser.password = hashedPassword;

    await foundUser.save();

    return NextResponse.json(
      { message: "Password reset successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
