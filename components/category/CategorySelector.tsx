"use client";

import { Category } from "@/lib/types/Category";
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
  refreshKey?: number;
}

const CategorySelector = ({
  selectedCategoryId,
  onCategoryChange,
  placeholder = "카테고리 선택",
  refreshKey,
}: CategorySelectorProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedValue, setSelectedValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  // 카테고리 로드
  useEffect(() => {
    const getCategories = async () => {
      try {
        setIsLoading(true);
        const res = await fetch("/api/category");
        if (!res.ok) {
          throw new Error(`HTTP Error, status: ${res.status}`);
        }
        const data = await res.json();
        setCategories(data);

        // selectedCategoryId가 있으면 해당 카테고리를 기본값으로 설정
        if (selectedCategoryId && data.length > 0) {
          const defaultCategory = data.find(
            (cat: Category) => cat.id === selectedCategoryId
          );
          if (defaultCategory) {
            setSelectedValue(defaultCategory.name);
            onCategoryChange(defaultCategory.id);
          }
        }
      } catch (error) {
        console.error("카테고리 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getCategories();
  }, []); // 의존성 배열 비우기

  // refreshKey가 변경되면 카테고리 새로고침
  useEffect(() => {
    if (refreshKey !== undefined) {
      const getCategories = async () => {
        try {
          setIsLoading(true);
          const res = await fetch("/api/category");
          if (!res.ok) {
            throw new Error(`HTTP Error, status: ${res.status}`);
          }
          const data = await res.json();
          setCategories(data);

          // selectedCategoryId가 있으면 해당 카테고리를 기본값으로 설정
          if (selectedCategoryId && data.length > 0) {
            const defaultCategory = data.find(
              (cat: Category) => cat.id === selectedCategoryId
            );
            if (defaultCategory) {
              setSelectedValue(defaultCategory.name);
              onCategoryChange(defaultCategory.id);
            }
          }
        } catch (error) {
          console.error("카테고리 로드 실패:", error);
        } finally {
          setIsLoading(false);
        }
      };
      getCategories();
    }
  }, [refreshKey, selectedCategoryId, onCategoryChange]);

  // selectedCategoryId가 변경될 때만 기본값 설정
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
        <SelectTrigger>
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
