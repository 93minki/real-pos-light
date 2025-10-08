"use client";

interface MenuCardProps {
  name: string;
  price: number;
  onClickMenu: () => void;
}

const MenuCard = ({ name, price, onClickMenu }: MenuCardProps) => {
  return (
    <div
      className="flex flex-col border rounded-lg p-4 max-w-1/5"
      onClick={onClickMenu}
    >
      <span>{name}</span>
      <span>{price}</span>
    </div>
  );
};

export default MenuCard;
