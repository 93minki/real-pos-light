import { Menu } from "@/lib/types/Menu";
import { create } from "zustand";

interface MenuStates {
  menus: Menu[];
  loading: boolean;
  error: string | null;
}

interface MenuActions {
  fetchMenus: () => void;
  updateMenu: (id: number, data: Partial<Menu>) => void;
  addMenu: (data: Partial<Menu>) => void;
}

type MenuStoreType = MenuStates & MenuActions;

export const useMenuStore = create<MenuStoreType>((set) => ({
  menus: [],
  loading: false,
  error: null,

  fetchMenus: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/menu");
      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      const data = await res.json();
      set({ menus: data, loading: false });
    } catch (error) {
      console.error("메뉴 조회 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
    }
  },
  updateMenu: async (id: number, data: Partial<Menu>) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/menu/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      useMenuStore.getState().fetchMenus();

      return true;
    } catch (error) {
      console.error("메뉴 수정 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      return false;
    }
  },
  addMenu: async (data: Partial<Menu>) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }

      useMenuStore.getState().fetchMenus();
      return true;
    } catch (error) {
      console.error("메뉴 추가 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      return false;
    }
  },
}));
