"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import OrderCard from "./OrderCard";

interface OrderListProps {
  statusFilter?: string;
  layout?: "list" | "grid";
}

const OrderList = ({ statusFilter, layout = "list" }: OrderListProps) => {
  const todayOrders = useOrderStore((state) => state.todayOrders);
  const fetchTodayOrders = useOrderStore((state) => state.fetchTodayOrders);

  useEffect(() => {
    fetchTodayOrders();
  }, []);

  const filteredOrders = statusFilter
    ? statusFilter === "COMPLETED"
      ? todayOrders
          .filter((order) => order.status === statusFilter)
          .sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          )
      : todayOrders
          .filter((order) => order.status === statusFilter)
          .sort(
            (a, b) =>
              new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          )
    : todayOrders;

  return (
    <div
      className={`${
        layout === "grid"
          ? "grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 auto-rows-[300px]"
          : "space-y-4"
      }`}
    >
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
