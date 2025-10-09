import { useSelectedMenuStore } from "@/store/useSelectedMenuStore";

const SelectedMenuList = () => {
  const selectedMenuList = useSelectedMenuStore(
    (state) => state.selectedMenuList
  );
  const updateQuantity = useSelectedMenuStore((state) => state.updateQuantity);
  const totalPrice = useSelectedMenuStore((state) => state.totalPrice);
  const resetSelectedMenuList = useSelectedMenuStore(
    (state) => state.resetSelectedMenuList
  );

  const handleOrder = async () => {
    const res = await fetch("/api/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: Array.from(selectedMenuList.entries()).map(([menuId, item]) => ({
          menuId,
          quantity: item.quantity,
          price: item.price,
        })),
      }),
    });

    if (res.ok) {
      alert("주문 완료");
      resetSelectedMenuList();
    } else {
      alert("주문 실패");
    }
  };

  return (
    <div className="flex flex-col h-full w-1/5 justify-between border rounded-lg p-2 gap-4">
      <div className="flex-1 flex flex-col gap-4 overflow-y-auto border p-2">
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
      <div className="flex items-center justify-between">
        <span className="">총 가격</span>
        <span className="font-extrabold text-xl">
          {totalPrice.toLocaleString()}원
        </span>
      </div>
      <button
        className="border rounded-xl shrink-0 py-2 bg-blue-400"
        onClick={handleOrder}
        disabled={selectedMenuList.size === 0}
      >
        주문하기
      </button>
    </div>
  );
};

export default SelectedMenuList;
