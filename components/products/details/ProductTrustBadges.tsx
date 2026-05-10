"use client";

import React from "react";
import { IconShieldCheck, IconCoins, IconTruck } from "@tabler/icons-react";

const ProductTrustBadges = () => {
  return (
    <div className="w-full bg-[#f4f7ff] border border-[#e2e8f5] rounded-xl flex items-stretch overflow-hidden shadow-sm">
      <div className="flex-1 flex flex-col min-[450px]:flex-row items-center justify-center gap-1.5 min-[450px]:gap-3 p-3 min-[450px]:p-4 border-r border-[#e2e8f5]">
        <IconShieldCheck className="text-blue-600 shrink-0" size={22} />
        <span className="text-[clamp(9px,2.5vw,13px)] lg:text-[14px] font-bold text-[#4a5568] uppercase tracking-tight text-center">
          101% Orijinal
        </span>
      </div>
      
      <div className="flex-1 flex flex-col min-[450px]:flex-row items-center justify-center gap-1.5 min-[450px]:gap-3 p-3 min-[450px]:p-4 border-r border-[#e2e8f5]">
        <IconCoins className="text-blue-600 shrink-0" size={22} />
        <span className="text-[clamp(9px,2.5vw,13px)] lg:text-[14px] font-bold text-[#4a5568] uppercase tracking-tight text-center">
          Ən Aşağı Qiymət
        </span>
      </div>
      
      <div className="flex-1 flex flex-col min-[450px]:flex-row items-center justify-center gap-1.5 min-[450px]:gap-3 p-3 min-[450px]:p-4">
        <IconTruck className="text-blue-600 shrink-0" size={22} />
        <span className="text-[clamp(9px,2.5vw,13px)] lg:text-[14px] font-bold text-[#4a5568] uppercase tracking-tight text-center">
          Pulsuz Çatdırılma
        </span>
      </div>
    </div>
  );
};

export default ProductTrustBadges;
