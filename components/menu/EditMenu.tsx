"use client";
import { Menu } from "@/lib/types/Menu";
import { useMenuStore } from "@/store/useMenuStore";
import { useState } from "react";
import AddCategory from "../category/AddCategory";
import CategorySelector from "../category/CategorySelector";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface EditMenuProps {
  menu: Menu;
}

const EditMenu = ({ menu }: EditMenuProps) => {
  const [name, setName] = useState(menu.name);
  const [price, setPrice] = useState(menu.price);
  const [selectedCategoryId, setSelectedCategoryId] = useState<number>(
    menu.categoryId || 1
  );
  const [isActive, setIsActive] = useState(menu.isActive);
  const updateMenu = useMenuStore((state) => state.updateMenu);

  return (
    <Dialog>
      <DialogTrigger
        onClick={(e) => e.stopPropagation()}
        className="px-3 py-1.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
      >
        ✏️ 수정
      </DialogTrigger>
      <DialogContent
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl shadow-2xl border-0 flex flex-col"
      >
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            메뉴 수정
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              메뉴 이름
            </label>
            <input
              type="text"
              value={name}
              placeholder="메뉴 이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div className="">
            <label className="text-sm font-semibold text-gray-700">가격</label>
            <div className="flex items-center gap-2">
              <button
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 font-medium text-sm border border-red-200"
                onClick={() => setPrice(Math.max(0, price - 1000))}
              >
                -1000
              </button>
              <button
                className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-all duration-200 font-medium text-sm border border-red-200"
                onClick={() => setPrice(Math.max(0, price - 100))}
              >
                -100
              </button>
              <input
                type="number"
                value={price}
                step={100}
                min={0}
                placeholder="가격"
                className="px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white text-center font-semibold w-full"
                onChange={(e) => setPrice(Number(e.target.value))}
              />
              <button
                className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-200 font-medium text-sm border border-green-200"
                onClick={() => setPrice(price + 100)}
              >
                +100
              </button>
              <button
                className="px-3 py-2 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg transition-all duration-200 font-medium text-sm border border-green-200"
                onClick={() => setPrice(price + 1000)}
              >
                +1000
              </button>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-gray-700">
              카테고리
            </label>

            <div className="flex gap-2">
              <div className="flex-1">
                <CategorySelector
                  selectedCategoryId={menu.categoryId}
                  onCategoryChange={(categoryId: number) => {
                    setSelectedCategoryId(categoryId);
                  }}
                  placeholder="카테고리를 선택하세요"
                />
              </div>
              <AddCategory />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              판매 상태
            </label>
            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isActive ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm font-semibold text-gray-700">
                  {isActive ? "판매가능" : "판매불가"}
                </span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  className="sr-only peer"
                  onChange={(e) => setIsActive(e.target.checked)}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6">
          <DialogClose asChild>
            <button className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200">
              취소
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              className="flex-1 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={() =>
                updateMenu(menu.id, {
                  name,
                  price,
                  categoryId: selectedCategoryId,
                  isActive,
                })
              }
            >
              저장하기
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditMenu;
