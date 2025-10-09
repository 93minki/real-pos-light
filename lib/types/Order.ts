import { Menu } from "./Menu";

export type OrderItem = {
  id: number;
  menu: Menu;
  quantity: number;

  price: number;
};

export type Order = {
  id: number;
  status: string;
  items: OrderItem[];
  createdAt: Date;
  updatedAt: Date;
};
