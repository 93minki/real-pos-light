"use client";

import { Order } from "@/lib/types/Order";
import { useEffect, useState } from "react";
import { Calendar } from "./Calendar";
import DailyOrderList from "./DailyOrderList";
import DailySalesBarChart from "./DailySalesBarChart";
import { HourlySalesChart } from "./HourlySalesChart";
import MonthlySalesChart from "./MonthlySalesChart";

const SalesManagePage = () => {
  const date = new Date();
  const [year, setYear] = useState<number>(date.getFullYear());
  const [month, setMonth] = useState<number>(date.getMonth() + 1);
  const [day, setDay] = useState<number>(date.getDate());

  const [monthlyOrders, setMonthlyOrders] = useState<Order[]>([]);
  const [chartOrList, setChartOrList] = useState<"chart" | "list">("chart");
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

  const dailyOrders = monthlyOrders.filter((order) => {
    const orderDate = new Date(order.createdAt);
    return (
      orderDate.getFullYear() === year &&
      orderDate.getMonth() === month - 1 &&
      orderDate.getDate() === day &&
      order.status === "COMPLETED"
    );
  });

  const sortedOrders = dailyOrders.sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  const dailySales = dailyOrders.reduce((acc, order) => {
    return (
      acc +
      order.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
    );
  }, 0);

  return (
    <div className="w-full h-dvh bg-gray-50 p-6 pt-18 xl:pt-20">
      <div className="grid grid-cols-12 grid-rows-3 gap-6 h-full">
        <div className="col-span-3 xl:col-span-3 flex items-center justify-center  ">
          <Calendar
            year={year}
            setYear={setYear}
            month={month}
            setMonth={setMonth}
            day={day}
            setDay={setDay}
          />
        </div>

        <div className="col-span-9 xl:col-span-9 row-span-3 bg-white rounded-xl shadow-sm border border-gray-200 h-full flex flex-col">
          {chartOrList === "chart" ? (
            <div className="p-6 flex flex-col h-full">
              <div className="flex items-center justify-between flex-none mb-4">
                <h2
                  className="text-lg font-semibold text-gray-900 cursor-pointer"
                  onClick={() => setChartOrList("list")}
                >
                  메뉴별 판매량 차트
                </h2>
                <p className="text-xl text-gray-600 font-bold flex flex-col">
                  <span>총 {dailySales.toLocaleString()}원</span>
                  <span className="text-xs">
                    {sortedOrders.length}건의 완료된 주문
                  </span>
                </p>
              </div>
              <div className="flex flex-col gap-4 min-h-0 flex-1">
                <div className="flex-1 min-h-0 overflow-hidden">
                  <DailySalesBarChart orders={dailyOrders} />
                </div>
                <div className="flex-none">
                  <HourlySalesChart orders={dailyOrders} />
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between">
                  <div className="px-6 py-4 border-b border-gray-100">
                    <h2
                      className="text-lg font-semibold text-gray-900 cursor-pointer"
                      onClick={() => setChartOrList("chart")}
                    >
                      {year}년 {month}월 {day}일 주문 내역
                    </h2>
                    <p className="text-xs text-gray-600 mt-1">
                      총 {sortedOrders.length}건의 완료된 주문
                    </p>
                  </div>
                  <p className="text-xl text-gray-600 font-bold px-6 py-4">
                    {dailySales.toLocaleString()}원
                  </p>
                </div>
                <DailyOrderList
                  orders={sortedOrders}
                  year={year}
                  month={month}
                  selectedDay={day}
                />
              </div>
            </div>
          )}
        </div>

        <div className="col-span-3 xl:col-span-3 flex flex-col justify-center row-span-2">
          <MonthlySalesChart orders={monthlyOrders} year={year} month={month} />
        </div>
      </div>
    </div>
  );
};

export default SalesManagePage;
