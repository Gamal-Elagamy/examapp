import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { changePassword } from "@/features/account/lib/apis/account.api";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const result = await changePassword(body, session.token);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to change password";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}
