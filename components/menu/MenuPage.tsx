"use client";

import { Menu } from "@/lib/types/Menu";
import { useEditModeStore } from "@/store/useEditModeStore";
import { useSelectedMenuStore } from "@/store/useSelectedMenuStore";
import MenuList from "./MenuList";
import SelectedMenuList from "./SelectedMenuList";

export default function MenuPage() {
  const selectMenu = useSelectedMenuStore((state) => state.selectMenu);
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  const menuClickHandler = (menu: Menu) => {
    if (!isEditMode) selectMenu(menu);
  };

  return (
    <div className="w-full h-dvh flex gap-2 px-4 pt-16 pb-2">
      <MenuList columns={4} menuClickHandler={menuClickHandler} />
      <SelectedMenuList />
    </div>
  );
}
