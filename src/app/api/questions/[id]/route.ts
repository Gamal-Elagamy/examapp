import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getQuestionById,
  updateQuestion,
  deleteQuestion,
} from "@/features/questions/lib/apis/questions.api";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await params;

  try {
    const payload = await getQuestionById(id, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch question";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
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

  const { id } = await params;

  try {
    const body = await request.json();
    const payload = await updateQuestion(id, body, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to update question";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: RouteParams) {
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

  const { id } = await params;

  try {
    const payload = await deleteQuestion(id, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete question";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
