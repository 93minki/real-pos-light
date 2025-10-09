"use client";

import { useEditModeStore } from "@/store/useEditModeStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";
import MenuCard from "./MenuCard";

const MenuList = () => {
  const menus = useMenuStore((state) => state.menus);
  const fetchMenus = useMenuStore((state) => state.fetchMenus);
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);


  return (
    <div className="w-full grid grid-cols-4 gap-4 border rounded-lg p-4 overflow-y-auto">
      {menus
        .filter((m) => (isEditMode ? true : m.isActive))
        .map((menu) => (
          <MenuCard key={menu.id} menu={menu} />
        ))}
    </div>
  );
};

export default MenuList;
