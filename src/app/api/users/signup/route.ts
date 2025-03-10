import { connect } from "@/dbConfig/config";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { sendMail } from "@/helpers/nodeMailer";

connect();

export async function POST(request: NextRequest) {
  try {
    const { email, password, userName } = await request.json();

    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
    });

    const savedUser = await newUser.save();

    await sendMail({ email, emailType: "VERIFY", userId: savedUser._id });

    return NextResponse.json(
      { message: "User created successfully", success: true },
      { status: 200 },
    );
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
