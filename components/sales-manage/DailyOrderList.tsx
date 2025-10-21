"use client";

import { Order } from "@/lib/types/Order";
import SalesOrderCard from "./SalesOrderCard";

interface DailyOrderListProps {
  orders: Order[];
  year: number;
  month: number;
  selectedDay: number;
}

const DailyOrderList = ({ orders }: DailyOrderListProps) => {
  return (
    <div className="flex-1 overflow-y-auto p-6 pt-4">
      {orders.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <div className="text-6xl mb-4">📋</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            주문이 없습니다
          </h3>
          <p className="text-gray-600">해당 날짜의 완료된 주문이 없습니다</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
          {orders.map((order) => (
            <SalesOrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyOrderList;
