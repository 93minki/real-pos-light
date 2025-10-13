"use client";

import OrderList from "./OrderList";

const OrderPage = () => {
  return (
    <div className="w-full h-dvh flex gap-4 px-4 pt-16 pb-2">
      {/* 진행중인 주문 (왼쪽 - 더 넓은 영역) */}
      <div className="flex-3">
        <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              진행중인 주문
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              조리중이거나 대기중인 주문들
            </p>
          </div>
          <div className="h-full overflow-y-auto p-4">
            <OrderList statusFilter={"IN_PROGRESS"} layout="grid" />
          </div>
        </div>
      </div>

      {/* 완료된 주문 (오른쪽 - 좁은 영역) */}
      <div className="flex-1">
        <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              완료된 주문
            </h2>
            <p className="text-sm text-gray-600 mt-1">최근 완료된 주문들</p>
          </div>
          <div className="h-full overflow-y-auto">
            <OrderList statusFilter={"COMPLETED"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
