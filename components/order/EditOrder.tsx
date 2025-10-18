import { Menu } from "@/lib/types/Menu";
import { Order } from "@/lib/types/Order";
import { useOrderStore } from "@/store/useOrderStore";
import { useEffect, useState } from "react";
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

  // 다이얼로그 열림 상태 및 편집 버퍼 상태
  const [open, setOpen] = useState(false);
  const [editableItems, setEditableItems] = useState<Order["items"]>([]);

  // 다이얼로그가 열릴 때 원본 주문 항목을 편집 버퍼로 복사
  useEffect(() => {
    if (open) {
      setEditableItems(order.items);
    }
  }, [open, order.items]);

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

  const menuClickHandler = (menu: Menu) => {
    const existing = editableItems.find((item) => item.menu.id === menu.id);

    if (existing) {
      setEditableItems((prev) =>
        prev.map((item) =>
          item.menu.id === menu.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setEditableItems((prev) => [
        ...prev,
        {
          id: -1,
          menu,
          quantity: 1,
          price: menu.price,
        },
      ]);
    }
  };

  const handleQuantityChange = (item: Order["items"][0], change: number) => {
    const newQuantity = item.quantity + change;
    if (newQuantity <= 0) {
      handleRemoveItem(item);
      return;
    }

    setEditableItems((prev) =>
      prev.map((orderItem) =>
        orderItem.menu.id === item.menu.id
          ? { ...orderItem, quantity: newQuantity }
          : orderItem
      )
    );
  };

  const handleRemoveItem = (item: Order["items"][0]) => {
    setEditableItems((prev) =>
      prev.filter((orderItem) => orderItem.menu.id !== item.menu.id)
    );
  };

  // 확인 버튼에서 한 번만 API 업데이트
  const handleConfirm = async () => {
    await updateOrderItems(editableItems);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <span role="img" aria-label="edit">
          ✏️
        </span>
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 flex flex-col max-w-4xl w-[90vw] h-[90vh]">
        <DialogHeader className="space-y-3 pb-6">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            주문 수정
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center"></DialogDescription>
        </DialogHeader>

        <div className="flex flex-col flex-1 gap-4 overflow-y-auto ">
          {/* 현재 주문 내역 - 60% 높이 */}
          {open && (
            <div className="h-[60%] flex flex-col overflow-y-auto">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">
                현재 주문 내역
              </h3>
              <div className="flex-1 space-y-2 overflow-y-auto border rounded-lg p-3">
                {editableItems.map((item) => (
                  <div
                    key={item.menu.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                  >
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {item.menu.name}
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

        {/* 하단 확인/취소 버튼 */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            className="px-4 py-2 rounded-lg border bg-gray-50 hover:bg-gray-100"
            onClick={() => setOpen(false)}
          >
            취소
          </button>
          <button
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white"
            onClick={handleConfirm}
          >
            확인
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrder;
