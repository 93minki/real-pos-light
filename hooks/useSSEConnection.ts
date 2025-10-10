import { useCallback, useEffect, useRef, useState } from "react";

interface SSEConnectionState {
  isConnected: boolean;
  isConnecting: boolean;
  reconnectAttempts: number;
  lastError: string | null;
}

interface UseSSEConnectionOptions {
  onMessage?: (data: string) => void;
}

export const useSSEConnection = (options?: UseSSEConnectionOptions) => {
  const [state, setState] = useState<SSEConnectionState>({
    isConnected: false,
    isConnecting: false,
    reconnectAttempts: 0,
    lastError: null,
  });

  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const connect = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    setState((prev) => ({ ...prev, isConnecting: true, lastError: null }));

    const eventSource = new EventSource("/api/events");
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log("SSE 연결 성공");
      setState({
        isConnected: true,
        isConnecting: false,
        reconnectAttempts: 0,
        lastError: null,
      });
    };

    eventSource.onmessage = (event) => {
      console.log("SSE 이벤트 수신:", event.data);
      // 이벤트 데이터를 부모 컴포넌트로 전달
      if (options?.onMessage) {
        options.onMessage(event.data);
      }
    };

    eventSource.onerror = (error) => {
      console.error("SSE 연결 오류:", error);
      setState((prev) => ({
        ...prev,
        isConnected: false,
        isConnecting: false,
        lastError: "SSE 연결 오류",
      }));

      // 자동 재연결 시도
      const maxAttempts = 5;
      if (state.reconnectAttempts < maxAttempts) {
        const delay = Math.pow(2, state.reconnectAttempts) * 1000; // 지수 백오프
        console.log(`${delay}ms 후 재연결 시도...`);

        reconnectTimeoutRef.current = setTimeout(() => {
          setState((prev) => ({
            ...prev,
            reconnectAttempts: prev.reconnectAttempts + 1,
          }));
          connect();
        }, delay);
      } else {
        console.error("최대 재연결 시도 횟수 초과");
      }
    };
  }, [state.reconnectAttempts, options]);

  const disconnect = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    setState({
      isConnected: false,
      isConnecting: false,
      reconnectAttempts: 0,
      lastError: null,
    });
  };

  const manualReconnect = () => {
    setState((prev) => ({ ...prev, reconnectAttempts: 0 }));
    connect();
  };

  useEffect(() => {
    connect();
    return () => {
      disconnect();
    };
  }, [connect]);

  return {
    ...state,
    connect,
    disconnect,
    manualReconnect,
  };
};
