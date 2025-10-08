interface SelectedMenuListProps {
  selectedMenuList: Map<
    number,
    { name: string; quantity: number; price: number }
  >;
  updateQuantity: (menuId: number, quantity: number) => void;
}

const SelectedMenuList = ({
  selectedMenuList,
  updateQuantity,
}: SelectedMenuListProps) => {
  return (
    <div className="w-1/5">
      {Array.from(selectedMenuList.entries()).map(([menuId, item]) => (
        <div key={menuId}>
          <button onClick={() => updateQuantity(menuId, item.quantity - 1)}>
            -
          </button>
          <span>{item.name}</span>
          <span>{item.price}</span>
          <span>{item.quantity}</span>
          <button onClick={() => updateQuantity(menuId, item.quantity + 1)}>
            +
          </button>
        </div>
      ))}
    </div>
  );
};

export default SelectedMenuList;
