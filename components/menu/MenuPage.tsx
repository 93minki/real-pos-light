"use client";

import MenuList from "./MenuList";
import SelectedMenuList from "./SelectedMenuList";

export default function MenuPage() {
  return (
    <div className="w-full h-screen flex gap-2 px-4 pt-16 pb-2">
      <MenuList />
      <SelectedMenuList />
    </div>
  );
}
