import { Order } from "@/lib/types/Order";
import { toast } from "sonner";
import { create } from "zustand";

interface OrderStoreStates {
  todayOrders: Order[];
  monthlyOrders: Order[];
  loading: boolean;
  error: string | null;
}

interface OrderStoreActions {
  fetchTodayOrders: () => void;
  updateOrder: (
    orderId: number,
    items: Array<{ menuId: number; quantity: number; price: number }>
  ) => Promise<boolean>;
  completeOrder: (orderId: number) => void;
  deleteOrder: (orderId: number) => void;
}

type OrderStoreType = OrderStoreStates & OrderStoreActions;

export const useOrderStore = create<OrderStoreType>((set) => ({
  todayOrders: [],
  monthlyOrders: [],
  loading: false,
  error: null,

  fetchTodayOrders: async () => {
    set({ loading: true, error: null });
    try {
      const res = await fetch("/api/orders");
      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      const data = await res.json();
      set({ todayOrders: data, loading: false });
    } catch (error) {
      console.error("주문 목록 조회 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
    }
  },

  updateOrder: async (
    orderId: number,
    items: Array<{ menuId: number; quantity: number; price: number }>
  ) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }

      useOrderStore.getState().fetchTodayOrders();
      toast.success("주문 수정 성공");
      return true;
    } catch (error) {
      console.error("주문 수정 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      toast.error("주문 수정 실패", {
        description: error instanceof Error ? error.message : "알 수 없는 오류",
      });
      return false;
    }
  },
  completeOrder: async (orderId: number) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: "COMPLETED" }),
      });

      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      useOrderStore.getState().fetchTodayOrders();
      toast.success("주문 완료 성공");
      return true;
    } catch (error) {
      console.error("주문 완료 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      toast.error("주문 완료 실패", {
        description: error instanceof Error ? error.message : "알 수 없는 오류",
      });
      return false;
    }
  },
  deleteOrder: async (orderId: number) => {
    set({ loading: true, error: null });
    console.log("deleteOrder", orderId);
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      useOrderStore.getState().fetchTodayOrders();
      toast.success("주문 삭제 성공");
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      toast.error("주문 삭제 실패", {
        description: error instanceof Error ? error.message : "알 수 없는 오류",
      });
      return false;
    }
  },
}));
