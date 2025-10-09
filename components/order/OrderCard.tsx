"use client";

import { Order } from "@/lib/types/Order";

interface OrderCardProps {
  order: Order;
  layout?: "list" | "grid";
}

const OrderCard = ({ order, layout = "list" }: OrderCardProps) => {
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

  // Grid 레이아웃용 간소화된 카드
  if (layout === "grid") {
    return (
      <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 overflow-hidden flex flex-col h-full">
        {/* 헤더 */}
        <div className="p-3 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                {order.id}
              </div>
              <div>
                <p className="text-xs text-gray-500">
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
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                  order.status
                )}`}
              >
                <span className="mr-1">{getStatusIcon(order.status)}</span>
                {getStatusText(order.status)}
              </div>
              {/* 수정 아이콘 */}
              <button className="w-5 h-5 bg-blue-100 hover:bg-blue-200 text-blue-600 rounded-full flex items-center justify-center text-xs transition-colors duration-200">
                ✏️
              </button>
            </div>
          </div>
        </div>

        {/* 메뉴 목록 (스크롤 가능) */}
        <div className="flex-1 p-3 overflow-y-auto max-h-32">
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-sm"
              >
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 bg-gray-100 rounded text-xs flex items-center justify-center font-semibold text-gray-600">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900 truncate">
                    {item.menu.name}
                  </span>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {item.quantity}개
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 총액 */}
        <div className="px-3 py-2 bg-gray-50 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-gray-900">총액</span>
            <span className="text-lg font-bold text-orange-600">
              {totalPrice.toLocaleString()}원
            </span>
          </div>
        </div>

        {/* 액션 버튼 (고정) */}
        <div className="p-3 bg-white border-t border-gray-100">
          {order.status === "IN_PROGRESS" && (
            <button className="w-full px-3 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200 text-sm">
              완료
            </button>
          )}
        </div>
      </div>
    );
  }

  // 기존 List 레이아웃
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
            #{order.id}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">주문 #{order.id}</h3>
            <p className="text-sm text-gray-500">
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
          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${getStatusColor(
            order.status
          )}`}
        >
          <span className="mr-1">{getStatusIcon(order.status)}</span>
          {getStatusText(order.status)}
        </div>
      </div>

      {/* 메뉴 목록 */}
      <div className="p-4 space-y-3">
        {order.items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-center justify-between py-2 border-b border-gray-50 last:border-b-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-xs font-semibold text-gray-600">
                {index + 1}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{item.menu.name}</h4>
                <p className="text-sm text-gray-500">{item.menu.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">수량:</span>
                <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-semibold">
                  {item.quantity}
                </span>
              </div>
              <div className="text-right">
                <div className="font-semibold text-gray-900">
                  {(item.price * item.quantity).toLocaleString()}원
                </div>
                <div className="text-xs text-gray-500">
                  {item.price.toLocaleString()}원 × {item.quantity}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 총액 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">총 결제금액</span>
          <span className="text-2xl font-bold text-blue-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="p-4 bg-white border-t border-gray-100">
        <div className="flex gap-2">
          {order.status === "주문완료" && (
            <button className="flex-1 px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-medium rounded-lg transition-colors duration-200">
              조리 시작
            </button>
          )}
          {order.status === "조리중" && (
            <button className="flex-1 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-medium rounded-lg transition-colors duration-200">
              완료 처리
            </button>
          )}
          <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors duration-200">
            상세보기
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderCard;
