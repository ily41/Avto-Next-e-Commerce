"use client";

import React, { useState, useEffect } from "react";
import { IconFlame } from "@tabler/icons-react";

const messages = [
  "Son 2 gündə 2 məhsul satılıb",
  "Bu məhsula hazırda 5 nəfər baxır"
];

const SoldNotification = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % messages.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center gap-2 text-[#e32c2c] bg-red-50 px-3 py-1.5 rounded-md w-fit h-9 overflow-hidden">
      <IconFlame size={18} className="shrink-0 fill-[#e32c2c] animate-pulse" />
      <div className="relative h-full overflow-hidden flex-1 min-w-[220px]">
        <div 
          className="flex flex-col transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateY(-${currentIndex * 100}%)` }}
        >
          {messages.map((msg, i) => (
            <div key={i} className="h-full min-h-full flex items-center text-[13px] font-bold whitespace-nowrap uppercase tracking-tight">
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SoldNotification;
