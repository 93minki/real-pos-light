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
    <div
      className="w-full grid grid-cols-4 gap-4 border rounded-lg p-4 overflow-y-auto"
      style={{ gridAutoRows: "min-content" }}
    >
      {menus
        .filter((m) => (isEditMode ? true : m.isActive))
        .map((menu) => (
          <div key={menu.id} className="h-48">
            <MenuCard menu={menu} />
          </div>
        ))}
    </div>
  );
};

export default MenuList;
