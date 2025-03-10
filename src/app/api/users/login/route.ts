import { connect } from "@/dbConfig/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const foundUser = await User.findOne({ email });
    if (foundUser == null) {
      return NextResponse.json(
        { error: "User does not exist" },
        { status: 400 },
      );
    }

    if (foundUser.isVerified !== true) {
      return NextResponse.json(
        { error: "Please verify your email" },
        { status: 400 },
      );
    }

    const validPassword = await bcrypt.compare(password, foundUser.password);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid password" }, { status: 400 });
    }

    const tokenData = {
      id: foundUser._id,
      userName: foundUser.userName,
      email: foundUser.email,
    };

    const token = jwt.sign(tokenData, process.env.TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    const response = NextResponse.json(
      { message: "login successful", success: true },
      { status: 200 },
    );
    response.cookies.set("token", token, {
      httpOnly: true,
    });

    return response;
  } catch (error) {
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json(
      { error: "An unknown error occurred" },
      { status: 500 },
    );
  }
}
