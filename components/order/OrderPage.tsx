"use client";

import OrderList from "./OrderList";

const OrderPage = () => {
  return (
    <div className="w-full h-dvh flex flex-col sm:flex-row gap-4 px-4 pt-11 sm:pt-18 pb-2">
      {/* 진행중인 주문 (모바일: 2/3 높이, 데스크톱: 3/4 너비) */}
      <div className="flex-[2] sm:flex-[3] min-h-0">
        <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-sm sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-orange-500 rounded-full"></span>
              진행중인 주문
            </h2>
            <p className="hidden sm:block text-sm text-gray-600 mt-1">
              조리중이거나 대기중인 주문들
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <OrderList statusFilter={"IN_PROGRESS"} layout="grid" />
          </div>
        </div>
      </div>

      {/* 완료된 주문 (모바일: 1/3 높이, 데스크톱: 1/4 너비) */}
      <div className="flex-[1] min-h-0">
        <div className="h-full bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden flex flex-col">
          <div className="p-4 bg-gradient-to-r from-green-50 to-blue-50 border-b border-gray-100 flex-shrink-0">
            <h2 className="text-sm sm:text-xl font-bold text-gray-900 flex items-center gap-2">
              <span className="w-3 h-3 bg-green-500 rounded-full"></span>
              완료된 주문
            </h2>
            <p className="hidden sm:block text-sm text-gray-600 mt-1">
              최근 완료된 주문들
            </p>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <OrderList statusFilter={"COMPLETED"} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderPage;
