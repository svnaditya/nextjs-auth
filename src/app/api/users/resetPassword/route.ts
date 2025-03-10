import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbConfig/config";
import user from "@/models/userModel";

connect();

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  return NextResponse.json({ message: "Email received" });
}
