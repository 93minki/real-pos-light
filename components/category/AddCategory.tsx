"use client";

import { useState } from "react";
import { toast } from "sonner";
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

interface AddCategoryProps {
  onCategoryAdded?: () => void;
}

const AddCategory = ({ onCategoryAdded }: AddCategoryProps) => {
  const [name, setName] = useState("");

  const addCategory = async () => {
    const res = await fetch("api/category", {
      method: "POST",
      body: JSON.stringify({ name }),
    });
    if (!res.ok) {
      throw new Error("Failed to add category");
    }
    const data = await res.json();
    console.log(data);
    setName("");
    toast.success("카테고리 추가 성공");
    onCategoryAdded?.();
  };

  return (
    <Dialog>
      <DialogTrigger className="px-3 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-1">
        <span>+</span>
        <span>추가</span>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 flex flex-col">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-xl font-bold text-gray-900 text-center">
            카테고리 추가
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center">
            새로운 카테고리를 추가합니다
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">
              카테고리 이름
            </label>
            <input
              type="text"
              value={name}
              placeholder="카테고리 이름을 입력하세요"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white"
              onChange={(e) => setName(e.target.value)}
            />
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
              className="flex-1 px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
              onClick={addCategory}
            >
              추가하기
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddCategory;
