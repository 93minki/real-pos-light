import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function GET() {
  const menus = await prisma.menu.findMany({
    orderBy: { id: "desc" },
  });
  return NextResponse.json(menus);
}

export async function POST(req: Request) {
  console.log("req", req);
  try {
    const body = await req.json();
    const { name, price, category, description, isActive } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "이름과 가격은 필수 정보입니다." },
        { status: 400 }
      );
    }

    const newMenu = await prisma.menu.create({
      data: {
        name,
        price,
        category,
        description,
        isActive: isActive ?? true,
      },
    });
    return NextResponse.json(newMenu, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
