import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  createSubmission,
  getSubmissions,
} from "@/features/submissions/lib/apis/submissions.api";
import type { ICreateSubmissionInput } from "@/shared/lib/types/submission";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const body: ICreateSubmissionInput = await request.json();
    const payload = await createSubmission(body, session.token);
    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to submit exam";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const searchParams = request.nextUrl.searchParams;
  const examId = searchParams.get("examId") || undefined;
  const page = searchParams.has("page")
    ? parseInt(searchParams.get("page")!, 10)
    : undefined;
  const limit = searchParams.has("limit")
    ? parseInt(searchParams.get("limit")!, 10)
    : undefined;
  const search = searchParams.get("search") || undefined;

  try {
    const payload = await getSubmissions(
      { examId, page, limit, search },
      session.token,
    );
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch submissions";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
