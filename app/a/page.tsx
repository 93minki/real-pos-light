"use client";

export default function APage() {
  const sendMessage = async (text: string) => {
    await fetch("/api/message", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <h1 className="text-2xl font-bold">A 페이지 (메뉴)</h1>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => sendMessage("Hello")}
      >
        Hello 전송
      </button>
      <button
        className="px-4 py-2 bg-green-500 text-white rounded"
        onClick={() => sendMessage("Bye")}
      >
        Bye 전송
      </button>
    </div>
  );
}
