import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { env } from "@/shared/lib/constants/env.constant";
import { extractErrorMessage } from "@/shared/lib/utils";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";

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

  const role = session.user?.role;
  if (role !== USER_ROLES.ADMIN && role !== USER_ROLES.SUPER_ADMIN) {
    return NextResponse.json(
      { status: false, code: 403, message: "Forbidden" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/audit-logs/${id}`;

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
        extractErrorMessage(payload, "Failed to fetch audit log details"),
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Failed to fetch audit log details";
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
  if (role !== USER_ROLES.SUPER_ADMIN) {
    return NextResponse.json(
      { status: false, code: 403, message: "Forbidden: Super Admin only" },
      { status: 403 },
    );
  }

  const { id } = await params;
  const url = `${env.NEXT_PUBLIC_API_URL}/admin/audit-logs/${id}`;

  try {
    const res = await fetch(url, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.token}`,
      },
    });

    const payload = await res.json().catch(() => null);

    if (!res.ok || !payload || !payload.status) {
      throw new Error(
        extractErrorMessage(payload, "Failed to delete audit log"),
      );
    }

    return NextResponse.json(payload);
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to delete audit log";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
