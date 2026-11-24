import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const queryString = searchParams.toString();
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/users${queryString ? `?${queryString}` : ""}`;

  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      cache: "no-store",
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok || !payload || !payload.status) {
      throw new Error(
        extractErrorMessage(payload, "Failed to fetch admin users"),
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch admin users";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
