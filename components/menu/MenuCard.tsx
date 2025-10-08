"use client";

interface MenuCardProps {
  name: string;
  price: number;
  onClickMenu: () => void;
}

const MenuCard = ({ name, price, onClickMenu }: MenuCardProps) => {
  return (
    <div
      className="h-1/6  border rounded flex flex-col justify-center items-center cursor-pointer"
      onClick={onClickMenu}
    >
      <span className="text-4xl">{name}</span>
      <span className="text-xl">{price}</span>
    </div>
  );
};

export default MenuCard;
