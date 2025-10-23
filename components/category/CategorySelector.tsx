"use client";

import { Category } from "@/lib/types/Category";
import { useCategoryStore } from "@/store/useCategoryStore";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

interface CategorySelectorProps {
  selectedCategoryId?: number;
  onCategoryChange: (categoryId: number) => void;
  placeholder?: string;
}

const CategorySelector = ({
  selectedCategoryId,
  onCategoryChange,
  placeholder = "카테고리 선택",
}: CategorySelectorProps) => {
  const [selectedValue, setSelectedValue] = useState<string>("");

  const categories = useCategoryStore((state) => state.categories);
  const isLoading = useCategoryStore((state) => state.loading);
  const fetchCategories = useCategoryStore((state) => state.fetchCategories);

  // 컴포넌트 마운트 시 카테고리 로드
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  // selectedCategoryId가 변경될 때 기본값 설정
  useEffect(() => {
    if (selectedCategoryId && categories.length > 0) {
      const defaultCategory = categories.find(
        (cat: Category) => cat.id === selectedCategoryId
      );
      if (defaultCategory) {
        setSelectedValue(defaultCategory.name);
        onCategoryChange(defaultCategory.id);
      }
    }
  }, [selectedCategoryId, categories]);

  const handleValueChange = (value: string) => {
    setSelectedValue(value);
    const category = categories.find((cat) => cat.name === value);
    if (category) {
      onCategoryChange(category.id);
    }
  };

  if (isLoading) {
    return (
      <Select disabled>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="로딩 중..." />
        </SelectTrigger>
      </Select>
    );
  }

  return (
    <Select value={selectedValue} onValueChange={handleValueChange}>
      <SelectTrigger className="w-full">
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>카테고리</SelectLabel>
          {categories.map((category) => (
            <SelectItem key={category.id} value={category.name}>
              {category.name}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
};

export default CategorySelector;
