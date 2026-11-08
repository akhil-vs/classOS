import { getManifestPayload } from "@classos/curriculum";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const payload = getManifestPayload(id);
  if (!payload) {
    return NextResponse.json({ error: "Manifest not found" }, { status: 404 });
  }
  return NextResponse.json(payload);
}
