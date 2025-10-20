"use client";

import Link from "next/link";

interface NaviButtonRrops {
  pathName: "menu" | "order" | "sales-manage";
  className?: string;
}

const NaviButton = ({ pathName, className }: NaviButtonRrops) => {
  const pathNameChange = (pathName: "menu" | "order" | "sales-manage") => {
    switch (pathName) {
      case "menu":
        return "메뉴 목록";
      case "order":
        return "주문 목록";
      case "sales-manage":
        return "매출 관리";
    }
  };

  const getIcon = (pathName: "menu" | "order" | "sales-manage") => {
    switch (pathName) {
      case "menu":
        return "🍽️";
      case "order":
        return "📋";
      case "sales-manage":
        return "📊";
    }
  };

  const getDescription = (pathName: "menu" | "order" | "sales-manage") => {
    switch (pathName) {
      case "menu":
        return "메뉴 관리 및 등록";
      case "order":
        return "주문 처리 및 관리";
      case "sales-manage":
        return "매출 분석 및 통계";
    }
  };

  return (
    <Link
      href={`/${pathName}`}
      className={`${className} p-8 rounded-2xl text-center group cursor-pointer min-h-[200px] flex flex-col justify-center items-center space-y-4`}
    >
      <div className="text-4xl mb-2 group-hover:scale-110 transition-transform duration-300">
        {getIcon(pathName)}
      </div>
      <h3 className="text-xl font-bold mb-2">{pathNameChange(pathName)}</h3>
      <p className="text-sm opacity-90">{getDescription(pathName)}</p>
    </Link>
  );
};

export default NaviButton;
