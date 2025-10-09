"use client";

import { useEditModeStore } from "@/store/useEditModeStore";
import { useSelectedMenuStore } from "@/store/useSelectedMenuStore";
import Link from "next/link";
import AddMenu from "../menu/AddMenu";

const Header = () => {
  const isEditMode = useEditModeStore((state) => state.isEditMode);
  const setEditMode = useEditModeStore((state) => state.setEditMode);
  const resetSelectedMenuList = useSelectedMenuStore(
    (state) => state.resetSelectedMenuList
  );

  const onClickEditMode = () => {
    setEditMode(!isEditMode);
    resetSelectedMenuList();
  };

  return (
    <div className="fixed top-0 left-0 w-full h-16 p-4 flex justify-between ">
      <div className="flex gap-4">
        <Link href={"/menu"} className="border rounded-lg py-1 px-2">
          메뉴 목록
        </Link>
        <Link href={"/order"} className="border rounded-lg py-1 px-2">
          주문 목록
        </Link>
      </div>

      <div className="flex gap-4">
        <button
          className="border rounded-lg py-1 px-2"
          onClick={onClickEditMode}
        >
          {isEditMode ? "수정 완료" : "메뉴 수정"}
        </button>
        <AddMenu />
      </div>
    </div>
  );
};

export default Header;
