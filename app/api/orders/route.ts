import { broadcast } from "@/lib/sse";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const orders = await prisma.orders.findMany({
      orderBy: { id: "desc" },
      include: {
        items: {
          include: {
            menu: true,
          },
        },
      },
    });
    return NextResponse.json(orders);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "주문 목록 조회 실패" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items } = body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "주문 내역이 없습니다" },
        { status: 400 }
      );
    }

    const totalAmount = items.reduce(
      (acc, item) => acc + item.price * item.quantity,
      0
    );

    const newOrder = await prisma.orders.create({
      data: {
        status: OrderStatus.IN_PROGRESS,
        items: {
          create: items.map((i) => ({
            menuId: i.menuId,
            quantity: i.quantity,
            price: i.price,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    broadcast("order-created");
    return NextResponse.json({ ...newOrder, totalAmount }, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "주문 생성 실패" }, { status: 500 });
  }
}
