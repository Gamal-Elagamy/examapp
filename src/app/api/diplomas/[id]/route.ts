import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import {
  getDiplomaById,
  updateDiploma,
  deleteDiploma,
} from "@/features/diplomas/lib/apis/diplomas.api";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";

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
    const payload = await getDiplomaById(id, session.token);
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch diploma";
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
  if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.SUPER_ADMIN) {
    return NextResponse.json(
      { status: false, code: 403, message: "Forbidden: Admin privileges required" },
      { status: 403 },
    );
  }

  const { id } = await params;

  try {
    const body = await request.json();
    const data = await updateDiploma(id, body, session.token);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update diploma";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const role = session.user?.role;
  if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.SUPER_ADMIN) {
    return NextResponse.json(
      { status: false, code: 403, message: "Forbidden: Admin privileges required" },
      { status: 403 },
    );
  }

  const { id } = await params;

  try {
    const data = await deleteDiploma(id, session.token);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete diploma";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}
