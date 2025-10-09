"use client";

import { Order } from "@/lib/types/Order";
import { useEffect, useState } from "react";
import OrderCard from "./OrderCard";

interface OrderListProps {
  statusFilter?: string[];
  layout?: "list" | "grid";
}

const OrderList = ({ statusFilter, layout = "list" }: OrderListProps) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async () => {
    try {
      console.log("주문 목록 조회 시작...");
      const res = await fetch("/api/orders");
      console.log("응답 상태:", res.status);

      if (!res.ok) {
        console.error("API 에러:", res.status, res.statusText);
        return;
      }

      const data = await res.json();
      console.log("받은 데이터:", data);
      setOrders(data);
    } catch (error) {
      console.error("fetch 에러:", error);
    }
  };

  useEffect(() => {
    fetchOrders();
    const eventSource = new EventSource("/api/events");
    eventSource.onmessage = (event) => {
      console.log("SSE 업데이트 감지:", event.data);
      fetchOrders();
    };

    return () => eventSource.close();
  }, []);

  const filteredOrders = statusFilter
    ? orders.filter((order) => statusFilter.includes(order.status))
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
