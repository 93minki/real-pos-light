"use client";

import { Menu } from "@/lib/types/Menu";
import { useState } from "react";
import MenuList from "./MenuList";
import SelectedMenuList from "./SelectedMenuList";

export default function MenuPage() {
  const [selectedMenuList, setSelectedMenuList] = useState<
    Map<number, { name: string; quantity: number; price: number }>
  >(new Map());

  const clickMenu = (menu: Menu) => {
    setSelectedMenuList((prev) => {
      const newMap = new Map(prev);
      const exisiting = newMap.get(menu.id);

      if (exisiting) {
        newMap.set(menu.id, {
          ...exisiting,
          quantity: exisiting?.quantity + 1,
        });
      } else {
        newMap.set(menu.id, {
          name: menu.name,
          quantity: 1,
          price: menu.price,
        });
      }

      return newMap;
    });
  };

  const removeMenu = (menuId: number) => {
    setSelectedMenuList((prev) => {
      const newMap = new Map(prev);
      newMap.delete(menuId);
      return newMap;
    });
  };

  const updateQuantity = (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      removeMenu(menuId);
      return;
    }

    setSelectedMenuList((prev) => {
      const newMap = new Map(prev);
      const existing = newMap.get(menuId);
      if (existing) {
        newMap.set(menuId, {
          ...existing,
          quantity,
        });
      }
      return newMap;
    });
  };

  return (
    <div className="w-full flex gap-2">
      <MenuList clickMenu={clickMenu} />
      <SelectedMenuList
        selectedMenuList={selectedMenuList}
        updateQuantity={updateQuantity}
      />
    </div>
  );
}
