import { previewInvite } from "@classos/auth";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const preview = await previewInvite(token);
  if (!preview.ok) {
    return NextResponse.json({ error: preview.error }, { status: 404 });
  }
  return NextResponse.json(preview);
}
