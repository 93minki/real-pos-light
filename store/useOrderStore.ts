import { Order } from "@/lib/types/Order";
import { create } from "zustand";

interface OrderStoreStates {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

interface OrderStoreActions {
  fetchOrders: (date?: string | Date) => void;
  fetchOrdersByMonth: (month: string) => void;
  updateOrder: (
    orderId: number,
    items: Array<{ menuId: number; quantity: number; price: number }>
  ) => Promise<boolean>;
  completeOrder: (orderId: number) => void;
  deleteOrder: (orderId: number) => void;
}

type OrderStoreType = OrderStoreStates & OrderStoreActions;

export const useOrderStore = create<OrderStoreType>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async (date?: string | Date) => {
    set({ loading: true, error: null });
    try {
      let url = "/api/orders";
      if (date) {
        // Date 객체인 경우 문자열로 변환
        const dateString =
          date instanceof Date ? date.toISOString().split("T")[0] : date;
        url += `?date=${dateString}`;
      }

      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      const data = await res.json();
      set({ orders: data, loading: false });
    } catch (error) {
      console.error("주문 목록 조회 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
    }
  },
  fetchOrdersByMonth: async (month: string) => {
    set({ loading: true, error: null });
    try {
      const res = await fetch(`/api/orders?month=${month}`);
      if (!res.ok) {
        throw new Error(`HTTP Error, status: ${res.status}`);
      }
      const data = await res.json();
      set({ orders: data, loading: false });
    } catch (error) {
      console.error("월별 주문 목록 조회 실패", error);
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

      useOrderStore.getState().fetchOrders();
      return true;
    } catch (error) {
      console.error("주문 수정 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
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
      useOrderStore.getState().fetchOrders();
      return true;
    } catch (error) {
      console.error("주문 완료 실패", error);
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
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
      useOrderStore.getState().fetchOrders();
      return true;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : "알 수 없는 오류",
        loading: false,
      });
      return false;
    }
  },
}));
