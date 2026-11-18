import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getUserProfile,
  updateUserProfile,
} from "@/features/account/lib/apis/account.api";

export async function GET() {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const payload = await getUserProfile(session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch profile";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest) {
  return handleUpdate(request);
}

export async function PUT(request: NextRequest) {
  return handleUpdate(request);
}

async function handleUpdate(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body = await request.json();
    const payload = await updateUserProfile(body, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update profile";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}
