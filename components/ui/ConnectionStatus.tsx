interface ConnectionStatusProps {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastError: string | null;
  onManualReconnect?: () => void;
}

const ConnectionStatus = ({
  isConnected,
  isConnecting,
  reconnectAttempts,
  lastError,
  onManualReconnect,
}: ConnectionStatusProps) => {
  const getStatusInfo = () => {
    if (isConnected) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        icon: "🟢",
        text: "실시간 연결됨",
        description: "주문이 실시간으로 동기화됩니다",
      };
    } else if (isConnecting) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        icon: "🟡",
        text: "연결 시도 중...",
        description: `재연결 시도 ${reconnectAttempts}/5`,
      };
    } else {
      return {
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        icon: "🔴",
        text: "연결 실패",
        description: lastError || "실시간 연결이 끊어졌습니다",
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div
      className={`flex items-center justify-between p-3 rounded-lg border ${statusInfo.bgColor} ${statusInfo.borderColor}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl">{statusInfo.icon}</span>
        <div>
          <div className={`font-semibold ${statusInfo.color}`}>
            {statusInfo.text}
          </div>
          <div className="text-sm text-gray-600">{statusInfo.description}</div>
        </div>
      </div>

      {!isConnected && !isConnecting && onManualReconnect && (
        <button
          onClick={onManualReconnect}
          className="px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
        >
          재연결
        </button>
      )}
    </div>
  );
};

export default ConnectionStatus;
