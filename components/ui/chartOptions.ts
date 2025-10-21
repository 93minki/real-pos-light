import { ChartConfig } from "./chart";

const chartData = [
  { hour: "00:00~01:00", sales: 100 },
  { hour: "01:00~02:00", sales: 200 },
  { hour: "02:00~03:00", sales: 300 },
  { hour: "03:00~04:00", sales: 400 },
  { hour: "04:00~05:00", sales: 500 },
  { hour: "05:00~06:00", sales: 600 },
  { hour: "06:00~07:00", sales: 700 },
  { hour: "07:00~08:00", sales: 800 },
  { hour: "08:00~09:00", sales: 900 },
  { hour: "09:00~10:00", sales: 1000 },
  { hour: "10:00~11:00", sales: 1100 },
  { hour: "11:00~12:00", sales: 1200 },
  { hour: "12:00~13:00", sales: 1300 },
  { hour: "13:00~14:00", sales: 1400 },
  { hour: "14:00~15:00", sales: 1500 },
  { hour: "15:00~16:00", sales: 1600 },
  { hour: "16:00~17:00", sales: 1700 },
  { hour: "17:00~18:00", sales: 1800 },
  { hour: "18:00~19:00", sales: 1900 },
  { hour: "19:00~20:00", sales: 2000 },
  { hour: "20:00~21:00", sales: 2100 },
  { hour: "21:00~22:00", sales: 2200 },
  { hour: "22:00~23:00", sales: 2300 },
  { hour: "23:00~00:00", sales: 2400 },
];

const chartConfig: ChartConfig = {
  sales: {
    label: "시간대",
  },
};
