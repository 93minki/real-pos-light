"use client";

import { Order } from "@/lib/types/Order";

interface SalesOrderCardProps {
  order: Order;
}

const SalesOrderCard = ({ order }: SalesOrderCardProps) => {
  const formatDateTime = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours().toString().padStart(2, "0");
    const minutes = dateObj.getMinutes().toString().padStart(2, "0");

    return `${month}. ${day}. ${hours}:${minutes}`;
  };

  const calculateTotalAmount = () => {
    return order.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-all duration-200 hover:border-gray-300 h-64 flex flex-col gap-2">
      {/* 주문 번호와 시간 */}
      <div className="flex items-center justify-between h-[20%]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-sm">
            {order.id}
          </div>
          <div className="text-sm text-gray-600 font-medium">
            {formatDateTime(order.createdAt)}
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
            order.status === "COMPLETED"
              ? "bg-green-100 text-green-700"
              : "bg-yellow-100 text-yellow-700"
          }`}
        >
          {order.status === "COMPLETED" ? "완료" : "진행중"}
        </span>
      </div>

      {/* 주문 아이템 목록 */}
      <div className="space-y-2 h-[60%] overflow-y-auto">
        {order.items.map((item, index) => (
          <div
            key={index}
            className="flex justify-between items-center text-sm py-1"
          >
            <span className="text-gray-800 font-medium">
              {item.menu?.name || `메뉴 ${item.menu.id}`}
            </span>
            <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded-md font-medium">
              {item.quantity}개
            </span>
          </div>
        ))}
      </div>

      {/* 총액 */}
      <div className="border-t border-gray-100 pt-3 h-[20%]">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700">총액</span>
          <span className="text-xl font-bold text-gray-900">
            {calculateTotalAmount().toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesOrderCard;
