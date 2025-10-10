export type Menu = {
  id: number;
  name: string;
  price: number;
  category?: string;
  desrciption?: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
};
