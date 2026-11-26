import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getExamQuestions,
  createQuestion,
} from "@/features/questions/lib/apis/questions.api";

interface RouteParams {
  params: Promise<{ examId: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { examId } = await params;
  const searchParams = request.nextUrl.searchParams;

  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;
  const immutable = searchParams.has("immutable")
    ? searchParams.get("immutable") === "true"
    : undefined;
  const search = searchParams.get("search") || undefined;

  try {
    const payload = await getExamQuestions(
      examId,
      { sortBy, sortOrder, immutable, search },
      session.token,
    );
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch exam questions";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
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
    const payload = await createQuestion(examId, body, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create question";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
