import { Category } from "@/lib/types/Category";
import { create } from "zustand";

interface CategoryStates {
  categories: Category[];
  loading: boolean;
  error: string | null;
}

interface CategoryActions {
  fetchCategories: () => void;
  addCategory: (name: string) => void;
}

type CategoryStoreType = CategoryStates & CategoryActions;

export const useCategoryStore = create<CategoryStoreType>((set) => ({
  categories: [],
  loading: false,
  error: null,

  fetchCategories: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/category");
      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      const data: Category[] = await res.json();
      set({ categories: data, loading: false });
    } catch (error) {
      console.error("카테고리 조회 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
    }
  },
  addCategory: async (name: string) => {
    // 낙관적 업데이트 적용
    const newCategory: Category = {
      id: Date.now(),
      name,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    set((state) => ({
      categories: [...state.categories, newCategory],
      loading: true,
      error: null,
    }));

    try {
      const res = await fetch("/api/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }

      const addedCategory: Category = await res.json();

      set((state) => ({
        categories: state.categories.map((category) =>
          category.id === newCategory.id ? addedCategory : category
        ),
        loading: false,
      }));

      return true;
    } catch (error) {
      set((state) => ({
        categories: state.categories.filter((cat) => cat.id !== newCategory.id),
      }));
      console.error("카테고리 추가 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      return false;
    }
  },
}));
