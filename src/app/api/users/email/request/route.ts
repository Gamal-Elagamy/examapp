import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { requestChangeEmail } from "@/features/account/lib/apis/account.api";

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
    const result = await requestChangeEmail(body.newEmail, session.token);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to request email change";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}
