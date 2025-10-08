"use client";

import { Menu } from "@/lib/types/Menu";
import { useEffect, useState } from "react";
import MenuCard from "./MenuCard";

interface MenuListProps {
  clickMenu: (menu: Menu) => void;
}

const MenuList = ({ clickMenu }: MenuListProps) => {
  const [menus, setMenus] = useState<Menu[]>([]);

  useEffect(() => {
    const fetchMenus = async () => {
      const res = await fetch("/api/menu");
      const data = await res.json();
      setMenus(data);
    };
    fetchMenus();
  }, []);

  return (
    <div className="w-full flex flex-wrap gap-4 ">
      {menus
        .filter((m) => m.isActive)
        .map((menu) => (
          <MenuCard
            key={menu.id}
            name={menu.name}
            price={menu.price}
            onClickMenu={() => clickMenu(menu)}
          />
        ))}
    </div>
  );
};

export default MenuList;
