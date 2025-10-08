import { broadcast } from "@/lib/sse";
import { OrderStatus, PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);
    const body = await req.json();

    const { items, status } = body;

    if (status && Object.values(OrderStatus).includes(status)) {
      const updated = await prisma.orders.update({
        where: { id },
        data: { status },
      });
      broadcast("order-updated");
      return NextResponse.json(updated);
    }

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "items는 배열이어야 합니다." },
        { status: 400 }
      );
    }

    const existing = await prisma.orderItem.findMany({
      where: { orderId: id },
      select: { id: true, menuId: true },
    });

    const newMenuIds = items.map((i) => i.menuId);

    const deleteTargets = existing.filter(
      (e) => !newMenuIds.includes(e.menuId)
    );

    const updates = items.filter((i) =>
      existing.some((e) => e.menuId === i.menuId)
    );

    const creations = items.filter(
      (i) => !existing.some((e) => e.menuId === i.menuId)
    );

    const result = await prisma.$transaction(async (tx) => {
      for (const u of updates) {
        await tx.orderItem.updateMany({
          where: { orderId: id, menuId: u.menuId },
          data: { quantity: u.quantity, price: u.price },
        });
      }

      if (creations.length > 0) {
        await tx.orderItem.createMany({
          data: creations.map((c) => ({
            orderId: id,
            menuId: c.menuId,
            quantity: c.quantity,
            price: c.price,
          })),
        });
      }

      if (deleteTargets.length > 0) {
        await tx.orderItem.deleteMany({
          where: { id: { in: deleteTargets.map((d) => d.id) } },
        });
      }

      const updated = await tx.orders.findUnique({
        where: { id },
        include: { items: { include: { menu: true } } },
      });
      return updated;
    });

    broadcast("order-updated");
    return NextResponse.json(result);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "주문 수정 실패" }, { status: 500 });
  }
}
