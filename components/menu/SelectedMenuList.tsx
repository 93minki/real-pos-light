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
    <div className="flex flex-col h-full w-1/5 justify-between border rounded-lg p-4">
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto">
        {Array.from(selectedMenuList.entries()).map(([menuId, item]) => (
          <div key={menuId} className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-2xl">
              <span>{item.name}</span>
              <span>{item.quantity}</span>
            </div>
            <div className="flex gap-2">
              <button
                className="w-1/2 border rounded-sm"
                onClick={() => updateQuantity(menuId, item.quantity - 1)}
              >
                -
              </button>
              <button
                className="w-1/2 border rounded-sm"
                onClick={() => updateQuantity(menuId, item.quantity + 1)}
              >
                +
              </button>
            </div>
          </div>
        ))}
      </div>
      <button className="border rounded-xl shrink-0">주문하기</button>
    </div>
  );
};

export default SelectedMenuList;
