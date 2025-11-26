"use client";

interface PrintOrderProps {
  order: string;
}

const PrintOrder = ({ order }: PrintOrderProps) => {
  const testPrint = async () => {
    const res = await fetch("http://localhost:5000/print", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ order }),
    });
    const data = await res.json();
    console.log("data", data);
  };

  return <button onClick={testPrint}>인쇄하기</button>;
};

export default PrintOrder;
