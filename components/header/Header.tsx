"use client";

import ConnectionIndicator from "@/components/ui/ConnectionIndicator";
import { useSSEConnection } from "@/hooks/useSSEConnection";
import { useEditModeStore } from "@/store/useEditModeStore";
import { useSelectedMenuStore } from "@/store/useSelectedMenuStore";
import Link from "next/link";
import { usePathname } from "next/navigation";
import FullScreenButton from "../fullscreen/FullScreenButton";
import AddMenu from "../menu/AddMenu";

const Header = () => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const setEditMode = useEditModeStore((state) => state.setEditMode);
  const resetSelectedMenuList = useSelectedMenuStore(
    (state) => state.resetSelectedMenuList
  );
  const sseConnection = useSSEConnection();

  const pathname = usePathname();

  const onClickEditMode = () => {
    setEditMode(!isEditMode);
    resetSelectedMenuList();
  };

  const getNavButtonStyle = (path: string) => {
    const isActive = pathname === path;
    return `px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all duration-200 ${
      isActive
        ? "bg-blue-500 text-white shadow-md transform scale-105"
        : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
    }`;
  };

  return (
    <div className="fixed top-0 left-0 w-full h-10 sm:h-16 bg-white border-b border-gray-200 z-50 shadow-sm">
      <div className="h-full px-2 sm:px-6 flex justify-between items-center">
        <div className="flex gap-3">
          <Link href={"/menu"} className={getNavButtonStyle("/menu")}>
            <span className="flex items-center gap-2">
              <span className="text-sm sm:text-lg">🍽️</span>
              <span className="hidden sm:block">메뉴 목록</span>
            </span>
          </Link>
          <Link href={"/order"} className={getNavButtonStyle("/order")}>
            <span className="flex items-center gap-2">
              <span className="text-sm sm:text-lg">📋</span>
              <span className="hidden sm:block">주문 목록</span>
            </span>
          </Link>
          <Link
            href={"/sales-manage"}
            className={getNavButtonStyle("/sales-manage")}
          >
            <span className="flex items-center gap-2">
              <span className="text-sm sm:text-lg">📊</span>
              <span className="hidden sm:block">매출 관리</span>
            </span>
          </Link>
        </div>

        <div className="flex gap-1 sm:gap-3 items-center">
          <FullScreenButton />
          <ConnectionIndicator
            isConnected={sseConnection.isConnected}
            isConnecting={sseConnection.isConnecting}
            onManualReconnect={sseConnection.manualReconnect}
          />
          {pathname === "/menu" && (
            <>
              <button
                className={`px-2 sm:px-4 py-1 sm:py-2 rounded-lg font-medium transition-all duration-200 ${
                  isEditMode
                    ? "bg-green-500 text-white hover:bg-green-600 shadow-md"
                    : "bg-slate-500 text-white hover:bg-slate-600 shadow-md"
                }`}
                onClick={onClickEditMode}
              >
                <span className="flex items-center gap-2">
                  <span className="text-sm">⚙️</span>
                  <span className="hidden sm:block">
                    {isEditMode ? "수정 완료" : "메뉴 수정"}
                  </span>
                </span>
              </button>
              <AddMenu />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
