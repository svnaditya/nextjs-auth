import { getDataFromToken } from "@/helpers/getDataFromToken";
import { NextRequest, NextResponse } from "next/server";
import user from "@/models/userModel";
import { connect } from "@/dbConfig/config";

connect();

export async function GET(request: NextRequest) {
  try {
    const userId = await getDataFromToken(request);
    const foundUser = await user.findById(userId).select("-password");
    if (!foundUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(foundUser);
  } catch (error: any) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}
