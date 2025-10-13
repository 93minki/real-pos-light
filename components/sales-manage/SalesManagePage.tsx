"use client";

import { Order } from "@/lib/types/Order";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import DailySalesChart from "./DailySalesChart";
import MonthlyOrderList from "./MonthlyOrderList";
import MonthlySalesChart from "./MonthlySalesChart";

const SalesManagePage = () => {
  const date = new Date();
  const [year, setYear] = useState<number>(date.getFullYear());
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [day, setDay] = useState<number>(date.getDate());

  const [chartType, setChartType] = useState<"monthly" | "daily">("monthly");

  // 월별 주문 데이터 상태
  const [monthlyOrders, setMonthlyOrders] = useState<Order[]>([]);

  // 월별 주문 데이터 fetch
  useEffect(() => {
    const fetchMonthlyOrders = async () => {
      try {
        const monthString = `${year}-${month.toString().padStart(2, "0")}`;
        const res = await fetch(`/api/orders?month=${monthString}`);

        if (!res.ok) {
          throw new Error(`HTTP Error, status: ${res.status}`);
        }

        const data = await res.json();
        setMonthlyOrders(data);
      } catch (err) {
        console.error("월별 주문 목록 조회 실패", err);
      }
    };

    fetchMonthlyOrders();
  }, [year, month]);

  // 선택된 날짜의 주문만 필터링
  const dailyOrders = monthlyOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getFullYear() === year &&
      orderDate.getMonth() === month - 1 &&
      orderDate.getDate() === day &&
      order.status === "COMPLETED"
    );
  });

  return (
    <div className="w-full h-screen bg-gray-50 p-6 pt-20">
      <div className="mx-auto h-full">
        <div className="grid grid-cols-12 grid-rows-3 gap-6 h-full">
          {/* 왼쪽: 캘린더 */}
          <div className="flex items-center justify-center col-span-2 ">
            <Calendar
              year={year}
              setYear={setYear}
              month={month}
              setMonth={setMonth}
              day={day}
              setDay={setDay}
            />
          </div>

          {/* 오른쪽: 주문 리스트 */}
          <div className="col-span-10 row-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <MonthlyOrderList
              orders={dailyOrders}
              year={year}
              month={month}
              selectedDay={day}
            />
          </div>

          {/* 하단: 차트 토글 */}
          <div className="flex flex-col justify-center col-span-2 row-span-2">
            <div className="flex gap-2 p-4">
              <button
                onClick={() => {
                  setChartType("monthly");
                }}
                className={`w-full h-10 ${
                  chartType === "monthly" ? "bg-gray-500" : "bg-gray-400"
                }  text-white rounded-lg`}
              >
                월 매출 차트
              </button>
              <button
                onClick={() => {
                  setChartType("daily");
                }}
                className={`w-full h-10 ${
                  chartType === "daily" ? "bg-gray-500" : "bg-gray-400"
                }  text-white rounded-lg`}
              >
                일일 매출 차트
              </button>
            </div>
            {chartType === "monthly" ? (
              <MonthlySalesChart
                orders={monthlyOrders}
                year={year}
                month={month}
              />
            ) : (
              <DailySalesChart
                orders={dailyOrders}
                year={year}
                month={month}
                day={day}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesManagePage;
