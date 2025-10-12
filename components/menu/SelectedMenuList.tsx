import { useSelectedMenuStore } from "@/store/useSelectedMenuStore";
import { toast } from "sonner";
import PaymentDialog from "./PaymentDialog";

const SelectedMenuList = () => {
  const selectedMenuList = useSelectedMenuStore(
    (state) => state.selectedMenuList
  );
  const updateQuantity = useSelectedMenuStore((state) => state.updateQuantity);
  const removeMenu = useSelectedMenuStore((state) => state.removeMenu);
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
      resetSelectedMenuList();
      toast.success("주문 성공");
    } else {
      toast.error("주문 실패", {
        description: res.status,
      });
    }
  };

  return (
    <div className="flex flex-col h-full w-1/4 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
      {/* 헤더 */}
      <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
          선택된 메뉴
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          {selectedMenuList.size}개 메뉴 선택됨
        </p>
      </div>

      {/* 메뉴 목록 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {selectedMenuList.size === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">🛒</div>
            <p>선택된 메뉴가 없습니다</p>
            <p className="text-sm">메뉴를 클릭하여 주문에 추가하세요</p>
          </div>
        ) : (
          Array.from(selectedMenuList.entries()).map(([menuId, item]) => (
            <div
              key={menuId}
              className="bg-gray-50 rounded-xl p-4 border border-gray-100"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 text-lg">
                  {item.name}
                </h3>
                <button
                  onClick={() => removeMenu(menuId)}
                  className="text-red-500 hover:text-red-700 transition-colors duration-200"
                >
                  ✕
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-lg flex items-center justify-center font-bold transition-colors duration-200"
                    onClick={() => updateQuantity(menuId, item.quantity - 1)}
                  >
                    -
                  </button>
                  <span className="w-12 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center font-bold">
                    {item.quantity}
                  </span>
                  <button
                    className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-lg flex items-center justify-center font-bold transition-colors duration-200"
                    onClick={() => updateQuantity(menuId, item.quantity + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="text-right">
                  <div className="font-bold text-gray-900">
                    {(item.price * item.quantity).toLocaleString()}원
                  </div>
                  <div className="text-xs text-gray-500">
                    {item.price.toLocaleString()}원 × {item.quantity}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 총액 및 주문 버튼 */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="flex items-center justify-between mb-4">
          <span className="text-lg font-bold text-gray-900">총 결제금액</span>
          <span className="text-2xl font-bold text-blue-600">
            {totalPrice.toLocaleString()}원
          </span>
        </div>

        <PaymentDialog
          totalPrice={totalPrice}
          disabled={selectedMenuList.size === 0}
          handleOrder={handleOrder}
        />
      </div>
    </div>
  );
};

export default SelectedMenuList;
