import { broadcast } from "@/lib/sse";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  const orders = await prisma.order.findMany({ orderBy: { id: "desc" } });
  return NextResponse.json(orders);
}

export async function POST(req: Request) {
  const body = await req.json();
  const created = await prisma.order.create({
    data: { items: body.items, total: body.total },
  });

  broadcast("order-created"); // <- 이벤트 전파
  return NextResponse.json(created);
}
