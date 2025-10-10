"use client";

import { useOrderStore } from "@/store/useOrderStore";
import { useEffect } from "react";
import OrderCard from "./OrderCard";

interface OrderListProps {
  statusFilter?: string[];
  layout?: "list" | "grid";
}

const OrderList = ({ statusFilter, layout = "list" }: OrderListProps) => {
  const orders = useOrderStore((state) => state.orders);
  const fetchOrders = useOrderStore((state) => state.fetchOrders);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

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
