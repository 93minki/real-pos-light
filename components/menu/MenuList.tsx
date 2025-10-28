"use client";

import { Menu } from "@/lib/types/Menu";
import { useEditModeStore } from "@/store/useEditModeStore";
import { useMenuStore } from "@/store/useMenuStore";
import { useEffect, useMemo } from "react";
import MenuCard from "./MenuCard";

interface MenuListProps {
  menuClickHandler: (menu: Menu) => void;
}

const MenuList = ({ menuClickHandler }: MenuListProps) => {
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

  return (
    <div
      className={`relative w-full flex-5 sm:flex-6 border rounded-lg p-4 overflow-y-auto ${
        isEditMode ? "shadow-urgent" : ""
      }`}
    >
      <div className="space-y-6">
        {Object.entries(menuListByCategory).map(
          ([categoryName, categoryMenus]) => (
            <div key={categoryName} className="space-y-3 @container w-full">
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
                className={`grid grid-cols-1 @xs:grid-cols-2 @xl:grid-cols-3 @3xl:grid-cols-4 gap-4`}
                style={{ gridAutoRows: "min-content" }}
              >
                {categoryMenus
                  .filter((m) => (isEditMode ? true : m.isActive))
                  .sort((a, b) => {
                    const mainA = a.name.replace(/^\(.*?\)/, "").trim();
                    const mainB = b.name.replace(/^\(.*?\)/, "").trim();

                    if (mainA > mainB) return 1;
                    if (mainA < mainB) return -1;

                    const typeA = a.name.match(/^\((.*?)\)/)?.[1] || "";
                    const typeB = b.name.match(/^\((.*?)\)/)?.[1] || "";

                    if (typeA === typeB) return 0;
                    if (typeA === "핫") return -1;
                    if (typeB === "핫") return 1;

                    return typeA.localeCompare(typeB);
                  })
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
