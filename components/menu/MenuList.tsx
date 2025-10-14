"use client";

import { Menu } from "@/lib/types/Menu";
import { useEditModeStore } from "@/store/useEditModeStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect } from "react";
import MenuCard from "./MenuCard";

interface MenuListProps {
  columns?: 2 | 4;
  menuClickHandler: (menu: Menu) => void;
}

const MenuList = ({ columns = 4, menuClickHandler }: MenuListProps) => {
  const menus = useMenuStore((state) => state.menus);
  const fetchMenus = useMenuStore((state) => state.fetchMenus);
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const gridCols =
    columns === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div
      className={`w-full grid ${gridCols} gap-4 border rounded-lg p-4 overflow-y-auto`}
      style={{ gridAutoRows: "min-content" }}
    >
      {menus
        .filter((m) => (isEditMode ? true : m.isActive))
        .map((menu) => (
          <div key={menu.id} className="h-48">
            <MenuCard menu={menu} menuClickHandler={menuClickHandler} />
          </div>
        ))}
    </div>
  );
};

export default MenuList;
