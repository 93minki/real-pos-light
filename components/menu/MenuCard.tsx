"use client";

import { Menu } from "@/lib/types/Menu";
import { useEditModeStore } from "@/store/useEditModeStore";
import EditMenu from "./EditMenu";

interface MenuCardProps {
  menu: Menu;
  menuClickHandler: (menu: Menu) => void;
}

const MenuCard = ({ menu, menuClickHandler }: MenuCardProps) => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);

  return (
    <div
      className={`menu-card relative bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border-2 cursor-pointer overflow-hidden group h-full flex flex-col ${
        menu.isActive
          ? "border-green-200 hover:border-green-300"
          : "border-red-200 hover:border-red-300 opacity-60"
      }`}
      onClick={() => {
        menuClickHandler(menu);
      }}
    >
      {/* 메뉴 정보 */}
      <div className="p-6 text-center flex-1 flex flex-col justify-center">
        <h3 className="text-2xl font-bold text-gray-900 mb-2 line-clamp-2">
          {menu.name}
        </h3>
        <div className="text-3xl font-bold text-blue-600">
          {menu.price.toLocaleString()}원
        </div>
        {menu.category && (
          <div className="text-sm text-gray-500 mt-2">{menu.category}</div>
        )}
      </div>

      {/* 활성 상태 표시 */}
      <div
        className={`absolute top-3 right-3 w-3 h-3 rounded-full ${
          menu.isActive ? "bg-green-500" : "bg-red-500"
        }`}
      />

      {/* EditMode 버튼 */}
      {isEditMode && (
        <div
          className="absolute top-3 left-3 z-10"
          onClick={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
        >
          <EditMenu menu={menu} />
        </div>
      )}

      {/* 호버 효과 */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  );
};

export default MenuCard;
