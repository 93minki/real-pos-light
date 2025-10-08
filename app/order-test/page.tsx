"use client";

import { useEffect, useState } from "react";

interface OrderItem {
  id: number;
  menu: { id: number; name: string; price: number };
  quantity: number;
  price: number;
}

interface Order {
  id: number;
  status: string;
  items: OrderItem[];
}

export default function OrderPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editQuantities, setEditQuantities] = useState<Record<number, number>>(
    {}
  );

  const fetchOrders = async () => {
    const res = await fetch("/api/orders");
    const data = await res.json();
    console.log("data", data);
    setOrders(data);
  };

  useEffect(() => {
    fetchOrders();

    // SSE 연결
    const evtSource = new EventSource("/api/events");
    evtSource.onmessage = (event) => {
      console.log("SSE 업데이트 감지:", event.data);
      fetchOrders();
    };

    return () => evtSource.close();
  }, []);

  // ✅ 주문 완료 처리
  const handleComplete = async (orderId: number) => {
    const res = await fetch(`/api/orders/${orderId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "COMPLETED" }),
    });
    if (res.ok) {
      fetchOrders();
    } else {
      alert("주문 완료 처리 실패");
    }
  };

  // ✅ 편집 시작
  const handleEdit = (order: Order) => {
    setEditingId(order.id);
    const quantities = Object.fromEntries(
      order.items.map((i) => [i.menu.id, i.quantity])
    );
    setEditQuantities(quantities);
  };

  // ✅ 편집 취소
  const cancelEdit = () => {
    setEditingId(null);
    setEditQuantities({});
  };

  // ✅ 수정 저장 (수량 변경만)
  const saveEdit = async (order: Order) => {
    const updatedItems = order.items.map((item) => ({
      menuId: item.menu.id,
      quantity: editQuantities[item.menu.id],
      price: item.menu.price,
    }));

    const res = await fetch(`/api/orders/${order.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: updatedItems }),
    });

    if (res.ok) {
      setEditingId(null);
      fetchOrders();
    } else {
      alert("수정 실패");
    }
  };

  return (
    <main className="p-8 space-y-6">
      <h1 className="text-2xl font-bold">주문 현황</h1>

      {orders.length === 0 && <p>아직 주문이 없습니다.</p>}

      {orders.map((order) => (
        <div key={order.id} className="p-4 border rounded-lg bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-semibold">
              주문 #{order.id} —{" "}
              <span
                className={`${
                  order.status === "COMPLETED"
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {order.status}
              </span>
            </h2>

            {/* 버튼 영역 */}
            <div className="space-x-2">
              {order.status === "IN_PROGRESS" && (
                <>
                  {editingId === order.id ? (
                    <>
                      <button
                        onClick={() => saveEdit(order)}
                        className="px-3 py-1 bg-blue-500 text-white rounded"
                      >
                        저장
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-300 text-gray-800 rounded"
                      >
                        취소
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => handleEdit(order)}
                      className="px-3 py-1 bg-yellow-400 text-black rounded"
                    >
                      수정하기
                    </button>
                  )}

                  <button
                    onClick={() => handleComplete(order.id)}
                    className="px-3 py-1 bg-green-600 text-white rounded"
                  >
                    완료하기
                  </button>
                </>
              )}
            </div>
          </div>

          <ul className="mt-2 space-y-1">
            {order.items.map((item) => (
              <li key={item.id} className="flex items-center justify-between">
                <span>
                  {item.menu.name} — {item.price.toLocaleString()}원
                </span>
                {editingId === order.id ? (
                  <input
                    type="number"
                    min={1}
                    value={editQuantities[item.menu.id] ?? 1}
                    onChange={(e) =>
                      setEditQuantities({
                        ...editQuantities,
                        [item.menu.id]: Number(e.target.value),
                      })
                    }
                    className="w-16 border rounded px-1 text-center"
                  />
                ) : (
                  <span>x {item.quantity}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </main>
  );
}
