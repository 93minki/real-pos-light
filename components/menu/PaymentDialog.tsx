import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

interface PaymentDialogProps {
  totalPrice: number;
  disabled: boolean;
  handleOrder: () => void;
}

const PaymentDialog = ({
  totalPrice,
  disabled,
  handleOrder,
}: PaymentDialogProps) => {
  const [receivedPrice, setReceivedPrice] = useState(0);

  const change = receivedPrice - totalPrice;
  const isEnough = change >= 0;

  const addAmount = (amount: number) => {
    setReceivedPrice((prev) => prev + amount);
  };

  const resetAmount = () => {
    setReceivedPrice(0);
  };

  return (
    <Dialog
      onOpenChange={() => {
        resetAmount();
      }}
    >
      <DialogTrigger
        className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
          disabled
            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
            : "bg-blue-500 hover:bg-blue-600 text-white shadow-lg hover:shadow-xl"
        }`}
      >
        🛒 주문하기
      </DialogTrigger>
      <DialogContent className="bg-white rounded-2xl shadow-2xl border-0 flex flex-col max-w-md w-[90vw]">
        <DialogHeader className="space-y-3 ">
          <DialogTitle className="text-2xl font-bold text-gray-900 text-center">
            💳 결제
          </DialogTitle>
          <DialogDescription className="text-gray-600 text-center"></DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* 결제 금액 표시 */}
          <div className="bg-blue-50 rounded-xl p-4 border-2 border-blue-200">
            <div className="text-center">
              <div className="text-sm text-blue-600 font-medium">결제 금액</div>
              <div className="text-3xl font-bold text-blue-800">
                {totalPrice.toLocaleString()}원
              </div>
            </div>
          </div>

          {/* 받은 금액 및 거스름돈 계산 */}
          <div className="space-y-4">
            <div className="text-sm font-semibold text-gray-700">받은 금액</div>

            <div className="bg-gray-50 rounded-xl p-4 border">
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-900">
                  {receivedPrice.toLocaleString()}원
                </div>
              </div>
            </div>

            {/* 금액 버튼들 */}
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => addAmount(50000)}
                  className="py-3 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors"
                >
                  5만원
                </button>
                <button
                  onClick={() => addAmount(10000)}
                  className="py-3 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors"
                >
                  1만원
                </button>
                <button
                  onClick={() => addAmount(5000)}
                  className="py-3 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors"
                >
                  5천원
                </button>
                <button
                  onClick={() => addAmount(1000)}
                  className="py-3 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors"
                >
                  1천원
                </button>
                <button
                  onClick={() => addAmount(500)}
                  className="py-3 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors"
                >
                  5백원
                </button>
                <button
                  onClick={() => addAmount(100)}
                  className="py-3 px-4 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded-lg font-medium transition-colors"
                >
                  1백원
                </button>
              </div>

              {/* 초기화 버튼 */}
              <button
                onClick={resetAmount}
                className="w-full py-4 bg-red-100 hover:bg-red-200 text-red-700 rounded-xl font-bold text-lg transition-colors"
              >
                🔄 초기화
              </button>
            </div>

            {/* 거스름돈 표시 */}
            <div
              className={`rounded-xl p-4 border-2 ${
                isEnough
                  ? "bg-green-50 border-green-200"
                  : "bg-red-50 border-red-200"
              }`}
            >
              <div className="text-center">
                <div className="text-sm font-medium text-gray-600">
                  거스름돈
                </div>
                <div
                  className={`text-2xl font-bold ${
                    isEnough ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {isEnough ? `${change.toLocaleString()}원` : "0원"}
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex gap-3 pt-6">
          <DialogClose asChild>
            <button className="flex-1 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-all duration-200">
              취소
            </button>
          </DialogClose>
          <DialogClose asChild>
            <button
              className={`flex-1 px-6 py-3 font-medium rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl ${
                receivedPrice > 0 && !isEnough
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
              disabled={receivedPrice > 0 && !isEnough}
              onClick={handleOrder}
            >
              💳 결제 완료
            </button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PaymentDialog;
