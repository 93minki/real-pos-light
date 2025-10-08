"use client";

import { useEffect, useState } from "react";

interface Menu {
  id: number;
  name: string;
  price: number;
  category?: string;
  isActive: boolean;
}

export default function MenuPage() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [selected, setSelected] = useState<
    { menuId: number; quantity: number; price: number }[]
  >([]);

  // 메뉴 목록 불러오기
  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then(setMenus)
      .catch(console.error);
  }, []);

  // 메뉴 추가
  const toggleMenu = (menu: Menu) => {
    const exists = selected.find((s) => s.menuId === menu.id);
    if (exists) {
      setSelected(selected.filter((s) => s.menuId !== menu.id));
    } else {
      setSelected([
        ...selected,
        { menuId: menu.id, quantity: 1, price: menu.price },
      ]);
    }
  };

  // 주문 전송
  const handleOrder = async () => {
    if (selected.length === 0) return alert("메뉴를 선택하세요.");

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: selected }),
    });

    if (res.ok) {
      alert("주문 완료!");
      setSelected([]);
    } else {
      alert("주문 실패!");
    }
  };

  return (
    <main className="p-8 space-y-4">
      <h1 className="text-2xl font-bold">메뉴 선택</h1>

      <ul className="grid grid-cols-2 gap-4">
        {menus
          .filter((m) => m.isActive)
          .map((menu) => (
            <li
              key={menu.id}
              onClick={() => toggleMenu(menu)}
              className={`p-4 border rounded-lg cursor-pointer ${
                selected.find((s) => s.menuId === menu.id)
                  ? "bg-blue-200"
                  : "bg-white"
              }`}
            >
              <p className="font-semibold">{menu.name}</p>
              <p>{menu.price.toLocaleString()}원</p>
            </li>
          ))}
      </ul>

      <button
        onClick={handleOrder}
        className="mt-6 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
      >
        주문하기 ({selected.length}개)
      </button>
    </main>
  );
}
