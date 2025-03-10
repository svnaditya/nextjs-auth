import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/config";
import { sendMail } from "@/helpers/nodeMailer";


connect();

export async function POST(request: NextRequest) {
  try {
    const { userId, email } = await request.json();
    sendMail({ email, emailType: "RESET", userId });
    return NextResponse.json({ message: "Email Sent, Please Check Your Inbox" });
  }
  catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}