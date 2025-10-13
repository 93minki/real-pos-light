import { Menu } from "@/lib/types/Menu";
import { Order } from "@/lib/types/Order";
import { useOrderStore } from "@/store/useOrderStore";
import MenuList from "../menu/MenuList";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface EditOrderProps {
  order: Order;
}

const EditOrder = ({ order }: EditOrderProps) => {
  const updateOrder = useOrderStore((state) => state.updateOrder);

  const updateOrderItems = async (newItems: Order["items"]) => {
    await updateOrder(
      order.id,
      newItems.map((item) => ({
        menuId: item.menu.id,
        quantity: item.quantity,
        price: item.price,
      }))
    );
  };

  const menuClickHandler = async (menu: Menu) => {
    if (!order) return;

    const existing = order.items.find((item) => item.menu.id === menu.id);

    // API 호출을 위한 items 배열 생성
    let newItems;
    if (existing) {
      // 기존 메뉴 수량 +1
      newItems = order.items.map((item) =>
        item.menu.id === menu.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      // 새 메뉴 추가
      newItems = [
        ...order.items,
        {
          id: -1, // 임시 ID (API에서 실제 ID로 교체됨)
          menu,
          quantity: 1,
          price: menu.price,
        },
      ];
    }

    await updateOrderItems(newItems);
  };

  const handleQuantityChange = async (
    item: Order["items"][0],
    change: number
  ) => {
    if (!order) return;

    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }

    const newItems = order.items.map((orderItem) =>
      orderItem.menu.id === item.menu.id
        ? { ...orderItem, quantity: newQuantity }
        : orderItem
    );

    await updateOrderItems(newItems);
  };

  const handleRemoveItem = async (item: Order["items"][0]) => {
    if (!order) return;

    const newItems = order.items.filter(
      (orderItem) => orderItem.menu.id !== item.menu.id
    );

    await updateOrderItems(newItems);
  };

  return (
    <Dialog>
      <DialogTrigger>❁</DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 flex flex-col max-w-4xl w-[90vw] h-[90vh]">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            주문 수정
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center"></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 gap-4 overflow-y-auto ">
          {/* 현재 주문 내역 - 60% 높이 */}
          {order && (
            <div className="h-[60%] flex flex-col overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                현재 주문 내역
              </h3>
              <div className="flex-1 space-y-2 overflow-y-auto border rounded-lg p-3">
                {order.items.map((item) => (
                  <div
                    key={item.menu.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.menu.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {item.price.toLocaleString()}원 × {item.quantity}개
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item, -1)}
                        className="w-8 h-8 bg-red-100 hover:bg-red-200 text-red-600 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-medium">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item, 1)}
                        className="w-8 h-8 bg-green-100 hover:bg-green-200 text-green-600 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        +
                      </button>
                      <button
                        onClick={() => handleRemoveItem(item)}
                        className="w-8 h-8 bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 rounded-full flex items-center justify-center text-sm font-medium transition-colors"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 메뉴 리스트 - 40% 높이 */}
          <div className="h-[40%] flex flex-col overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">
              메뉴 선택
            </h3>
            <div className="flex-1 overflow-y-auto">
              <MenuList columns={2} menuClickHandler={menuClickHandler} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrder;
