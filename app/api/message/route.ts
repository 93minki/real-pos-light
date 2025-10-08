import { broadcast } from "@/lib/sse";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const body = await request.json();
  broadcast(body.text);
  return NextResponse.json({ ok: true });
}
