import { getMenuColor } from "@/lib/chartColors";
import { Order } from "@/lib/types/Order";
import * as React from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
  YAxis,
} from "../ui/chart";

interface DailySalesBarChart {
  orders: Order[];
}

const DailySalesBarChart = ({ orders }: DailySalesBarChart) => {
  const menuSales = React.useMemo(() => {
    const menuMap = new Map<string, number>();

    orders.forEach((order) => {
      if (order.status === "COMPLETED") {
        order.items.forEach((item) => {
          const menuName = item.menu?.name || `메뉴 ${item.menu.id}`;
          const currentCount = menuMap.get(menuName) || 0;
          menuMap.set(menuName, currentCount + item.quantity);
        });
      }
    });

    return Array.from(menuMap.entries())
      .map(([name, count]) => ({
        menu: name,
        sales: count,
        fill: getMenuColor(name),
      }))
      .sort((a, b) => b.sales - a.sales);
  }, [orders]);

  const chartConfig = React.useMemo(() => {
    const config: ChartConfig = {
      sales: {
        label: "판매량",
      },
    };

    menuSales.forEach((item) => {
      config[item.menu] = {
        label: item.menu,
        color: getMenuColor(item.menu),
      };
    });

    return config;
  }, [menuSales]);

  if (menuSales.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[250px] text-gray-500">
        <div className="text-4xl mb-2">📊</div>
        <p className="text-sm">판매 데이터가 없습니다</p>
      </div>
    );
  }

  const getChartWidth = () => {
    const menuCount = menuSales.length;
    if (menuCount <= 2) return "w-1/4";
    if (menuCount <= 4) return "w-1/2";
    if (menuCount <= 6) return "w-3/4";
    return "w-full";
  };

  return (
    <ChartContainer
      config={chartConfig}
      className={`mx-auto h-full ${getChartWidth()}`}
    >
      <BarChart data={menuSales}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="menu"
          tickLine={false}
          tickMargin={10}
          axisLine={true}
          tickFormatter={(value) => value.slice(0, 10)}
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => `${Math.round(value)}개`}
          domain={[0, "dataMax"]}
          allowDecimals={false}
        />
        <Bar dataKey="sales" />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
      </BarChart>
    </ChartContainer>
  );
};

export default DailySalesBarChart;
