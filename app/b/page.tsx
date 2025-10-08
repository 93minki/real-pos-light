"use client";
import { useEffect, useState } from "react";

export default function BPage() {
  const [message, setMessage] = useState<string>("(아직 없음)");

  useEffect(() => {
    const es = new EventSource("/api/events");

    es.onmessage = (e) => {
      setMessage(e.data);
    };

    es.onerror = () => {
      console.error("SSE 연결 오류");
      es.close();
      setTimeout(() => {
        location.reload(); // 간단한 재시도
      }, 2000);
    };

    return () => es.close();
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">B 페이지 (주문)</h1>
      <p className="text-xl">{message}</p>
    </div>
  );
}
