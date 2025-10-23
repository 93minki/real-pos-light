"use client";

import { Menu } from "@/lib/types/Menu";
import { useEditModeStore } from "@/store/useEditModeStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect, useMemo } from "react";
import MenuCard from "./MenuCard";

interface MenuListProps {
  columns?: 2 | 4;
  menuClickHandler: (menu: Menu) => void;
}

const MenuList = ({ columns = 4, menuClickHandler }: MenuListProps) => {
  const menus = useMenuStore((state) => state.menus);
  const fetchMenus = useMenuStore((state) => state.fetchMenus);
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  const menuListByCategory = useMemo(() => {
    const groups: { [categoryName: string]: Menu[] } = {};

    menus.forEach((menu) => {
      const categoryName = menu.category?.name || "기타";
      if (!groups[categoryName]) {
        groups[categoryName] = [];
      }
      groups[categoryName].push(menu);
    });

    const sortedEntries = Object.entries(groups).sort(([, a], [, b]) => {
      const categoryIdA = a[0]?.category?.id || 999;
      const categoryIdB = b[0]?.category?.id || 999;
      return categoryIdA - categoryIdB;
    });

    return Object.fromEntries(sortedEntries);
  }, [menus]);

  useEffect(() => {
    fetchMenus();
  }, [fetchMenus]);

  const gridCols =
    columns === 2 ? "grid-cols-2" : "grid-cols-2 md:grid-cols-3 lg:grid-cols-4";

  return (
    <div
      className={`relative w-full flex-5 sm:flex-6 border rounded-lg p-4 overflow-y-auto ${
        isEditMode ? "shadow-urgent" : ""
      }`}
    >
      <div className="space-y-6">
        {Object.entries(menuListByCategory).map(
          ([categoryName, categoryMenus]) => (
            <div key={categoryName} className="space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <h3 className="text-sm sm:text-lg font-semibold text-gray-800">
                  {categoryName}
                </h3>
                <span className="text-xs sm:text-sm text-gray-500">
                  ({categoryMenus.length}개)
                </span>
              </div>

              <div
                className={`grid ${gridCols} gap-4`}
                style={{ gridAutoRows: "min-content" }}
              >
                {categoryMenus
                  .filter((m) => (isEditMode ? true : m.isActive))
                  .map((menu) => (
                    <div key={menu.id} className="h-30 sm:h-48">
                      <MenuCard
                        menu={menu}
                        menuClickHandler={menuClickHandler}
                      />
                    </div>
                  ))}
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default MenuList;
