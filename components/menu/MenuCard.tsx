"use client";

import { Menu } from "@/lib/types/Menu";
import { useEditModeStore } from "@/store/useEditModeStore";
import { useSelectedMenuStore } from "@/store/useSelectedMenuStore";
import EditMenu from "./EditMenu";

interface MenuCardProps {
  menu: Menu;
}

const MenuCard = ({ menu }: MenuCardProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  const selectMenu = useSelectedMenuStore((state) => state.selectMenu);

  return (
    <div
      className={`h-1/6  border rounded flex flex-col justify-center items-center cursor-pointer ${
        menu.isActive ? "bg-green-500" : "bg-red-500"
      }`}
      onClick={() => {
        if (!isEditMode) selectMenu(menu);
      }}
    >
      <span className="text-4xl">{menu.name}</span>
      <span className="text-xl">{menu.price}</span>
      {isEditMode && (
        <div onClick={(e) => e.stopPropagation()}>
          <EditMenu menu={menu} />
        </div>
      )}
    </div>
  );
};

export default MenuCard;
