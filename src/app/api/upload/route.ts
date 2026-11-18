import { NextResponse, type NextRequest } from "next/server";
import { auth } from "@/auth";
import { uploadFile } from "@/shared/lib/apis/upload.api";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.token) {
    return NextResponse.json(
      { status: false, code: 401, message: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const incomingFormData = await request.formData();
    const file = (incomingFormData.get("image") || incomingFormData.get("file")) as File | null;

    if (!file) {
      return NextResponse.json(
        { status: false, code: 400, message: "No image file provided" },
        { status: 400 },
      );
    }

    const backendFormData = new FormData();
    backendFormData.append("image", file, file.name);

    const result = await uploadFile(backendFormData, session.token);
    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to upload file";
    return NextResponse.json(
      { status: false, code: 500, message },
      { status: 500 },
    );
  }
}
