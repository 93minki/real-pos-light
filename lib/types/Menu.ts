export type Menu = {
  id: number;
  name: string;
  price: number;
  categoryId?: number;
  desrciption?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};
