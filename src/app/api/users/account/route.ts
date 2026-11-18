import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { deleteAccount } from "@/features/account/lib/apis/account.api";

export async function DELETE() {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const result = await deleteAccount(session.token);
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete account";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}
