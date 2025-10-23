"use client";

import { Order } from "@/lib/types/Order";
import { useOrderStore } from "@/store/useOrderStore";
import EditOrder from "./EditOrder";

interface OrderCardProps {
  order: Order;
  layout?: "list" | "grid";
}

const OrderCard = ({ order, layout = "list"}: OrderCardProps) => {
  const completeOrder = useOrderStore((state) => state.completeOrder);
  const deleteOrder = useOrderStore((state) => state.deleteOrder);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "COMPLETED":
        return "bg-green-100 text-green-800 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "👨‍🍳";
      case "COMPLETED":
        return "🎉";
      case "CANCELLED":
        return "❌";
      default:
        return "📋";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "IN_PROGRESS":
        return "진행중";
      case "COMPLETED":
        return "완료";
      case "CANCELLED":
        return "취소";
      default:
        return status;
    }
  };

  const totalPrice = order.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  if (layout === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
        <div className="px-3 py-2 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-md font-bold text-gray-500">
                  {new Date(order.createdAt).toLocaleString("ko-KR", {
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <EditOrder order={order} />
            </div>
          </div>
        </div>
        <div className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-2">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm sm:text-xl xl:text-5xl"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-900 truncate">
                    {item.menu.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {item.quantity}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
          {order.status === "IN_PROGRESS" && (
            <button
              onClick={() => deleteOrder(order.id)}
              className="flex-1 bg-red-300 hover:bg-red-400 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
            >
              취소
            </button>
          )}

          {order.status === "IN_PROGRESS" && (
            <button
              onClick={() => completeOrder(order.id)}
              className="flex-2 px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm"
            >
              완료
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      <div className="flex items-center justify-between px-4 py-1.5 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-xs sm:text-sm text-gray-500">
              {new Date(order.createdAt).toLocaleString("ko-KR", {
                month: "2-digit",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
              })}
            </p>
          </div>
        </div>
        <div
          className={`hidden sm:block px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
            order.status
          )}`}
        >
          <span className="mr-1">{getStatusIcon(order.status)}</span>
          {getStatusText(order.status)}
        </div>
      </div>

      <div className="p-4">
        {order.items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0 text-sm sm:text-lg lg:text-3xl"
          >
            <div className="flex items-center gap-3">
              <h4 className="font-medium text-gray-900">{item.menu.name}</h4>
              <span className="hidden xl:block px-2 py-1 bg-blue-100 text-blue-600 rounded-lg text-sm font-semibold">
                {item.quantity}개
              </span>
              
            </div>
            <div className="text-right">
              <div className="font-semibold text-gray-900">
                {(item.price * item.quantity).toLocaleString()}원
                <span className="sm:hidden">({item.quantity})</span>
              </div>
              <div className="hidden sm:block text-xs text-gray-500">
                {item.price.toLocaleString()}원 ×{" "}
                <span className="font-extrabold">{item.quantity}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs lg:text-lg font-bold text-gray-900">
            총 결제금액
          </span>
          <span className="text-sm lg:text-2xl font-bold text-blue-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
