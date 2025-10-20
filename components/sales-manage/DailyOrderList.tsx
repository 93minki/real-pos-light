"use client";

import { Order } from "@/lib/types/Order";
import SalesOrderCard from "./SalesOrderCard";

interface DailyOrderListProps {
  orders: Order[];
  year: number;
  month: number;
  selectedDay: number;
}

const DailyOrderList = ({
  orders,
  year,
  month,
  selectedDay,
}: DailyOrderListProps) => {
  // 최신 순으로 정렬
  const sortedOrders = orders.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  return (
    <div className="h-full flex flex-col">
      {/* 헤더 - 고정 */}
      <div className="px-6 py-4 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-gray-900">
          {year}년 {month}월 {selectedDay}일 주문 내역
        </h2>
        <p className="text-xs text-gray-600 mt-1">
          총 {sortedOrders.length}건의 완료된 주문
        </p>
      </div>

      {/* 스크롤 가능한 콘텐츠 */}
      <div className="flex-1 overflow-y-auto p-6 pt-4">
        {sortedOrders.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              주문이 없습니다
            </h3>
            <p className="text-gray-600">해당 날짜의 완료된 주문이 없습니다</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
            {sortedOrders.map((order) => (
              <SalesOrderCard key={order.id} order={order} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyOrderList;
