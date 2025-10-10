interface ConnectionIndicatorProps {
  isConnected: boolean;
  isConnecting: boolean;
  onManualReconnect?: () => void;
}

const ConnectionIndicator = ({
  isConnected,
  isConnecting,
  onManualReconnect,
}: ConnectionIndicatorProps) => {
  const getStatusInfo = () => {
    if (isConnected) {
      return {
        color: "text-green-600",
        bgColor: "bg-green-100",
        icon: "🟢",
        text: "연결됨",
      };
    } else if (isConnecting) {
      return {
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        icon: "🟡",
        text: "연결중",
      };
    } else {
      return {
        color: "text-red-600",
        bgColor: "bg-red-100",
        icon: "🔴",
        text: "연결실패",
      };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm">{statusInfo.icon}</span>
      <span className={`text-sm font-medium ${statusInfo.color}`}>
        {statusInfo.text}
      </span>
      {!isConnected && !isConnecting && onManualReconnect && (
        <button
          onClick={onManualReconnect}
          className="text-xs text-blue-600 hover:text-blue-800 underline"
        >
          재연결
        </button>
      )}
    </div>
  );
};

export default ConnectionIndicator;
