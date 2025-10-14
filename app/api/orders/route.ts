import { broadcast } from "@/lib/sse";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");
    const month = searchParams.get("month");

    let whereClause = {};

    if (date) {
      // 특정 날짜의 주문 조회 (00:00 ~ 23:59)
      const startDate = new Date(date);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(date);
      endDate.setHours(23, 59, 59, 999);

      whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else if (month) {
      // 특정 월의 주문 조회
      const [year, monthNum] = month.split("-");
      const startDate = new Date(parseInt(year), parseInt(monthNum) - 1, 1);
      const endDate = new Date(
        parseInt(year),
        parseInt(monthNum),
        0,
        23,
        59,
        59,
        999
      );

      whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    } else {
      // 기본값: 오늘 날짜의 주문 조회
      const today = new Date();
      const startDate = new Date(today);
      startDate.setHours(0, 0, 0, 0);
      const endDate = new Date(today);
      endDate.setHours(23, 59, 59, 999);

      whereClause = {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      };
    }

    const orders = await prisma.orders.findMany({
      where: whereClause,
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
