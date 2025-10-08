import { broadcast } from "@/lib/sse";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const items = await prisma.orderItem.findMany({
      include: {
        order: true,
        menu: true,
      },
      orderBy: { id: "desc" },
    });
    return NextResponse.json(items);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "주문 항목 조회 실패" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { orderId, menuId, quantity, price } = body;

    if (!orderId || !menuId || !quantity || !price) {
      return NextResponse.json(
        { error: "필수 정보가 없습니다." },
        { status: 400 }
      );
    }

    const newItem = await prisma.orderItem.create({
      data: {
        orderId,
        menuId,
        quantity,
        price,
      },
      include: {
        menu: true,
      },
    });

    broadcast("order-item-created");
    return NextResponse.json(newItem, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "주문 항목 추가 실패" }, { status: 500 });
  }
}
