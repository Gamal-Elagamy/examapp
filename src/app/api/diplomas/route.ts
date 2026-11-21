import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDiplomas, createDiploma } from "@/features/diplomas/lib/apis/diplomas.api";
import { USER_ROLES } from "@/shared/lib/constants/api.constant";

export async function GET(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  const { searchParams } = request.nextUrl;
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const limit = searchParams.get("limit") ? parseInt(searchParams.get("limit")!, 10) : 12;
  const search = searchParams.get("search") || undefined;
  const sortBy = searchParams.get("sortBy") || undefined;
  const sortOrder = (searchParams.get("sortOrder") as "asc" | "desc") || undefined;
  const immutableParam = searchParams.get("immutable");
  const immutable =
    immutableParam === "true" ? true : immutableParam === "false" ? false : undefined;

  try {
    const payload = await getDiplomas(
      { page, limit, search, sortBy, sortOrder, immutable },
      session.token,
    );
    return NextResponse.json(payload);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to fetch diplomas";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
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

  try {
    const body = await request.json();
    const data = await createDiploma(body, session.token);
    return NextResponse.json(data);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create diploma";
    return NextResponse.json(
      { status: false, code: 400, message },
      { status: 400 },
    );
  }
}
