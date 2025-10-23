import { Category } from "./Category";

export type Menu = {
  id: number;
  name: string;
  price: number;
  categoryId?: number;
  desrciption?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  category: Category;
};
