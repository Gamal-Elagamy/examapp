import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getSubmissionById } from "@/features/submissions/lib/apis/submissions.api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const payload = await getSubmissionById(id, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch submission analytics";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
