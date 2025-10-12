"use client";

import { getMenuColor } from "@/lib/chartColors";
import { Order } from "@/lib/types/Order";
import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

interface DailySalesChartProps {
  orders: Order[];
  year: number;
  month: number;
  day: number;
}

const DailySalesChart = ({
  orders,
  year,
  month,
  day,
}: DailySalesChartProps) => {
  // 선택된 날짜의 메뉴별 판매량 계산
  const dailyMenuSales = React.useMemo(() => {
    const menuMap = new Map<string, number>();

    orders.forEach((order) => {
      const orderDate = new Date(order.createdAt);
      const isTargetDate =
        orderDate.getFullYear() === year &&
        orderDate.getMonth() === month - 1 &&
        orderDate.getDate() === day &&
        order.status === "COMPLETED";

      if (isTargetDate) {
        order.items.forEach((item) => {
          const menuName = item.menu?.name || `메뉴 ${item.menu.id}`;
          const currentCount = menuMap.get(menuName) || 0;
          menuMap.set(menuName, currentCount + item.quantity);
        });
      }
    });

    return Array.from(menuMap.entries())
      .map(([name, count], index) => ({
        menu: name,
        sales: count,
        fill: getMenuColor(name, index),
      }))
      .sort((a, b) => b.sales - a.sales);
  }, [orders, year, month, day]);

  // 차트 설정
  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      sales: {
        label: "판매량",
      },
    };

    dailyMenuSales.forEach((item, index) => {
      config[item.menu] = {
        label: item.menu,
        color: getMenuColor(item.menu, index),
      };
    });

    return config;
  }, [dailyMenuSales]);

  const totalDailySales = React.useMemo(() => {
    return dailyMenuSales.reduce((acc, curr) => acc + curr.sales, 0);
  }, [dailyMenuSales]);

  // 일일 총 매출 금액 계산
  const totalDailyRevenue = React.useMemo(() => {
    return orders
      .filter((order) => {
        const orderDate = new Date(order.createdAt);
        const isTargetDate =
          orderDate.getFullYear() === year &&
          orderDate.getMonth() === month - 1 &&
          orderDate.getDate() === day &&
          order.status === "COMPLETED";
        return isTargetDate;
      })
      .reduce((acc, order) => {
        const orderTotal = order.items.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        return acc + orderTotal;
      }, 0);
  }, [orders, year, month, day]);

  if (dailyMenuSales.length === 0) {
    return (
      <Card className="flex flex-col">
        <CardHeader className="items-center pb-0">
          <CardTitle className="text-xl font-semibold">
            일일 매출 통계
          </CardTitle>
          <CardDescription className="text-gray-600">
            {year}년 {month}월 {day}일
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-1 pb-0">
          <div className="flex flex-col items-center justify-center h-[300px] text-gray-500">
            <div className="text-6xl mb-4">📈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              데이터가 없습니다
            </h3>
            <p className="text-gray-600">해당 날짜의 완료된 주문이 없습니다</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-xl font-semibold">일일 매출 통계</CardTitle>
        <CardDescription className="text-gray-600">
          {year}년 {month}월 {day}일
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dailyMenuSales}
              dataKey="sales"
              nameKey="menu"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-foreground text-3xl font-bold"
                        >
                          {totalDailySales.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-muted-foreground"
                        >
                          총 판매량
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
      <CardFooter className="flex-col gap-3 text-sm">
        <div className="flex items-center justify-end w-full">
          <div className="text-right">
            <div className="text-lg font-bold text-gray-900">
              {totalDailyRevenue.toLocaleString()}원
            </div>
            <div className="text-xs text-gray-600">일일 매출 금액</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default DailySalesChart;
