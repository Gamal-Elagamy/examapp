import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { getDiplomas } from "@/features/diplomas/lib/apis/diplomas.api";

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

  try {
    const payload = await getDiplomas(
      { page, limit, search, sortBy, sortOrder },
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
