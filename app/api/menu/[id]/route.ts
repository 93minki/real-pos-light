/* eslint-disable @typescript-eslint/no-explicit-any */
// 메뉴 수정, 메뉴 삭제? 삭제는 하지 않을 예정
// 메뉴 수정은 이름, 가격, 카테고리, 설명, 활성화 여부 등을 수정함

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const menuId = Number(resolvedParams.id);
    if (isNaN(menuId)) {
      return NextResponse.json(
        { error: "유효하지 않은 ID 형식입니다." },
        { status: 400 }
      );
    }

    const data = await req.json();

    if (Object.keys(data).length === 0) {
      return NextResponse.json(
        { error: "수정할 데이터가 없습니다." },
        { status: 400 }
      );
    }

    const updatedMenu = await prisma.menu.update({
      where: { id: menuId },
      data,
    });

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error(error);

    if ((error as any).code === "P2025") {
      return NextResponse.json(
        { error: "해당 메뉴가 존재하지 않습니다" },
        { status: 404 }
      );
    }

    return NextResponse.json({ error: "서버 에러" }, { status: 500 });
  }
}
