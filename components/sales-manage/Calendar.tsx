"use client";
import { SquareChevronLeft, SquareChevronRight } from "lucide-react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

interface CalendarProps {
  year: number;
  setYear: Dispatch<SetStateAction<number>>;
  month: number;
  setMonth: Dispatch<SetStateAction<number>>;
  day: number;
  setDay: Dispatch<SetStateAction<number>>;
}

export const Calendar = ({
  year,
  setYear,
  month,
  setMonth,
  day,
  setDay,
}: CalendarProps) => {
  const [dayArray, setDayArray] = useState<string[]>([]);

  useEffect(() => {
    const start = new Date(year, month - 1, 1);
    const last = new Date(year, month, 0);

    const indentCount = start.getDay();
    const days = Array.from({ length: last.getDate() }, (_, i) =>
      (i + 1).toString()
    );
    for (let i = 0; i < indentCount; i++) {
      days.unshift(" ");
    }

    const moreDaysCount = 7 - (days.length % 7);

    for (let i = 0; i < moreDaysCount; i++) {
      days.push(" ");
    }
    setDayArray(days);
  }, [year, month]);

  return (
    <div className="flex flex-col gap-2 mx-auto">
      <div className="flex justify-between items-center px-2 py-1 bg-white rounded-lg shadow mb-1">
        <SquareChevronLeft
          className="cursor-pointer hover:text-blue-500 transition w-6 h-6"
          onClick={() => {
            if (month === 1) {
              setYear((prev) => prev - 1);
              setMonth(12);
            } else {
              setMonth((prev) => prev - 1);
            }
          }}
        />
        <span className="font-semibold text-base">
          {year}년 {month}월
        </span>
        <SquareChevronRight
          className="cursor-pointer hover:text-blue-500 transition w-6 h-6"
          onClick={() => {
            if (month === 12) {
              setYear((prev) => prev + 1);
              setMonth(1);
            } else {
              setMonth((prev) => prev + 1);
            }
          }}
        />
      </div>

      <div className="grid grid-cols-7 gap-[2px] bg-white rounded-lg shadow p-1">
        {["일", "월", "화", "수", "목", "금", "토"].map((day, index) => (
          <div
            key={index}
            className={`text-center font-bold py-[2px] text-xs ${
              index === 0
                ? "text-red-500"
                : index === 6
                ? "text-blue-500"
                : "text-gray-700"
            }`}
          >
            {day}
          </div>
        ))}
        {dayArray.map((arr, i) => {
          const isToday = (() => {
            const today = new Date();
            return (
              +arr === today.getDate() &&
              month === today.getMonth() + 1 &&
              year === today.getFullYear()
            );
          })();
          return (
            <button
              key={i}
              disabled={arr === " "}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition border-none outline-none focus:ring-2 focus:ring-blue-400 text-xs
                ${
                  arr === " "
                    ? "bg-transparent cursor-default"
                    : day === +arr
                    ? "bg-blue-500 text-white font-bold shadow-lg"
                    : isToday
                    ? "bg-blue-100 text-blue-700 font-semibold"
                    : "hover:bg-gray-100 text-gray-800"
                }
              `}
              onClick={() => {
                setDay(+arr);
              }}
            >
              <span className="w-full h-full flex justify-center items-center">
                {arr}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
