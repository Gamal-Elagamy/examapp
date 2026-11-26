import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";

interface RouteParams {
  params: Promise<{ examId: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const role = session.user?.role;
  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    return NextResponse.json(
      { status: false, code: 403, message: "Forbidden" },
      { status: 403 },
    );
  }

  const { examId } = await params;

  try {
    const body = await request.json();
    const url = `${env.NEXT_PUBLIC_API_URL}/questions/exam/${examId}/bulk`;

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
      body: JSON.stringify(body),
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok || !payload || !payload.status) {
      throw new Error(
        extractErrorMessage(payload, "Failed to bulk create questions"),
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to bulk create questions";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
