import { getMenuColor } from "@/lib/chartColors";
import { Order } from "@/lib/types/Order";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  XAxis,
} from "../ui/chart";

const generateChartData = (orders: Order[]) => {
  const hourlyData: Array<{ hour: string; [key: string]: number | string }> =
    Array.from({ length: 24 }, (_, index) => {
      const hour = index.toString().padStart(2, "0");
      return {
        hour: `${hour}:00`,
        total: 0,
      };
    });

  const menuNames = new Set<string>();

  orders.forEach((order) => {
    const orderDate = new Date(order.createdAt);
    const hour = orderDate.getHours();

    order.items.forEach((item) => {
      const menuName = item.menu.name;
      menuNames.add(menuName);

      if (!hourlyData[hour][menuName]) {
        hourlyData[hour][menuName] = 0;
      }
      hourlyData[hour][menuName] =
        (hourlyData[hour][menuName] as number) + item.quantity;
      hourlyData[hour].total =
        (hourlyData[hour].total as number) + item.quantity;
    });
  });

  const config: ChartConfig = {};
  menuNames.forEach((menuName) => {
    config[menuName] = {
      label: menuName,
    };
  });

  return {
    data: hourlyData,
    config,
    menuNames: Array.from(menuNames),
  };
};
const CustomLegend = ({
  menuNames,
  colors,
}: {
  menuNames: string[];
  colors: string[];
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-4 p-2 bg-gray-50 rounded-lg">
      {menuNames.map((menuName, index) => (
        <div key={menuName} className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-sm"
            style={{ backgroundColor: colors[index % colors.length] }}
          />
          <span className="text-sm font-medium text-gray-700">{menuName}</span>
        </div>
      ))}
    </div>
  );
};

interface HourlySalesChartProps {
  orders: Order[];
}

export function HourlySalesChart({ orders }: HourlySalesChartProps) {
  const { chartData, chartConfig, menuNames, colors, totalByHour } =
    useMemo(() => {
      const { data, config, menuNames: menus } = generateChartData(orders);
      const colors = menus.map((menuName) => getMenuColor(menuName));

      // 시간별 총합을 미리 계산
      const totalByHour = new Map(
        data.map((item) => [item.hour, item.total as number])
      );

      return {
        chartData: data,
        chartConfig: config,
        menuNames: menus,
        colors,
        totalByHour,
      };
    }, [orders]);

  return (
    <div className="w-full">
      <ChartContainer config={chartConfig} className="w-full h-[400px]">
        <BarChart accessibilityLayer data={chartData} margin={{ bottom: 20 }}>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="hour"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fontSize: 12 }}
            tickFormatter={(value) => {
              const total = totalByHour.get(value) || 0;
              return `${value} (${total})`;
            }}
          />
          <ChartTooltip content={<ChartTooltipContent hideLabel />} />

          {menuNames.map((menuName, index) => (
            <Bar
              key={menuName}
              dataKey={menuName}
              stackId="sales"
              fill={colors[index]}
            />
          ))}
        </BarChart>
      </ChartContainer>

      <CustomLegend menuNames={menuNames} colors={colors} />
    </div>
  );
}
