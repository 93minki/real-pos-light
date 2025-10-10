"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import OrderCard from "./OrderCard";

interface OrderListProps {
  statusFilter?: string;
  layout?: "list" | "grid";
}

const OrderList = ({ statusFilter, layout = "list" }: OrderListProps) => {
  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  useEffect(() => {
    console.log("SSE 연결 시작");
    const eventSource = new EventSource("/api/events");

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
    };

    eventSource.onmessage = (event) => {
      console.log("SSE 이벤트 수신:", event.data);
      if (
        event.data === "order-created" ||
        event.data === "order-updated" ||
        event.data === "order-deleted"
      ) {
        console.log("주문 목록 새로고침 시작");
        fetchOrders(); // 주문 목록 새로고침
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
    };

    return () => {
      console.log("SSE 연결 종료");
      eventSource.close();
    };
  }, [fetchOrders]);

  const filteredOrders = statusFilter
    ? statusFilter === "COMPLETED"
      ? orders
          .filter((order) => order.status === statusFilter)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      : orders
          .filter((order) => order.status === statusFilter)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
    : orders;

  return (
    <div className={layout === "grid" ? "grid grid-cols-4 gap-4" : "space-y-4"}>
      {filteredOrders.length === 0 ? (
        <div className="text-center py-12 text-gray-500 col-span-4">
          <div className="text-4xl mb-2">📋</div>
          <p>해당 상태의 주문이 없습니다</p>
        </div>
      ) : (
        filteredOrders.map((order) => (
          <OrderCard key={order.id} order={order} layout={layout} />
        ))
      )}
    </div>
  );
};

export default OrderList;
