import { Menu } from "@/lib/types/Menu";
import { create } from "zustand";

interface SelectedMenuStates {
  selectedMenuList: Map<
    number,
    { name: string; quantity: number; price: number }
  >;
  totalPrice: number;
}

interface SelectedMenuActions {
  selectMenu: (menu: Menu) => void;
  removeMenu: (menuId: number) => void;
  updateQuantity: (menuId: number, quantity: number) => void;
  resetSelectedMenuList: () => void;
}

type SelectedMenuStoreType = SelectedMenuStates & SelectedMenuActions;

const calculateTotalPrice = (
  menuList: Map<number, { name: string; quantity: number; price: number }>
) => {
  let total = 0;
  for (const [, item] of menuList) {
    total += item.price * item.quantity;
  }
  return total;
};

export const useSelectedMenuStore = create<SelectedMenuStoreType>((set) => ({
  selectedMenuList: new Map(),
  totalPrice: 0,

  selectMenu: (menu: Menu) => {
    const prev = useSelectedMenuStore.getState().selectedMenuList;
    const newMap = new Map(prev);
    const existing = newMap.get(menu.id);

    if (existing) {
      newMap.set(menu.id, {
        ...existing,
        quantity: existing.quantity + 1,
      });
    } else {
      newMap.set(menu.id, {
        name: menu.name,
        quantity: 1,
        price: menu.price,
      });
    }
    set({ selectedMenuList: newMap, totalPrice: calculateTotalPrice(newMap) });
  },
  removeMenu: (menuId: number) => {
    const prev = useSelectedMenuStore.getState().selectedMenuList;
    const newMap = new Map(prev);
    newMap.delete(menuId);
    set({ selectedMenuList: newMap, totalPrice: calculateTotalPrice(newMap) });
  },
  updateQuantity: (menuId: number, quantity: number) => {
    if (quantity <= 0) {
      useSelectedMenuStore.getState().removeMenu(menuId);
      return;
    }

    const prev = useSelectedMenuStore.getState().selectedMenuList;
    const existing = prev.get(menuId);
    if (existing) {
      const newMap = new Map(prev);
      newMap.set(menuId, {
        ...existing,
        quantity,
      });
      set({
        selectedMenuList: newMap,
        totalPrice: calculateTotalPrice(newMap),
      });
    }
  },
  resetSelectedMenuList: () => {
    set({ selectedMenuList: new Map(), totalPrice: 0 });
  },
}));
