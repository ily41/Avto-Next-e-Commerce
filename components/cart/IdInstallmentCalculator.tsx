"use client";
 
import { useState } from "react";
import { Info } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface IdInstallmentCalculatorProps {
  totalAmount: number;
}
 
const INSTALLMENT_OPTIONS = [
  { months: 2, interest: 4 },
  { months: 3, interest: 5.5 },
  { months: 6, interest: 8.5 },
  { months: 12, interest: 15.5 },
  { months: 18, interest: 24 },
  { months: 24, interest: 30 },
  { months: 35, interest: 46 },
];
 
export function IdInstallmentCalculator({ totalAmount }: IdInstallmentCalculatorProps) {
  const [selectedMonths, setSelectedMonths] = useState<number>(INSTALLMENT_OPTIONS[0].months);
 
  const selectedOption = INSTALLMENT_OPTIONS.find((o) => o.months === selectedMonths) || INSTALLMENT_OPTIONS[0];
  
  const totalWithInterest = totalAmount * (1 + selectedOption.interest / 100);
  const monthlyPayment = totalWithInterest / selectedOption.months;
 
  return (
    <div className="mt-8 bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[15px] font-black text-gray-900 tracking-tight uppercase">
          Şəxsiyyət vəsiqəsi ilə hissəli ödəniş
        </h3>
        <p className="text-[10px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
          Faiz dərəcələri və aylıq ödəniş cədvəli
        </p>
      </div>
 
      <div className="flex flex-col border border-gray-100 rounded-[20px] overflow-hidden">
        {/* Months selection */}
        <div className="flex-1 p-4 md:p-5 grid grid-cols-4 md:grid-cols-7 gap-2 border-b border-gray-50">
          {INSTALLMENT_OPTIONS.map((option) => (
            <button
              key={option.months}
              onClick={() => setSelectedMonths(option.months)}
              className="relative flex flex-col items-center flex-shrink-0"
            >
              <div
                className={cn(
                  "h-10 w-10 md:h-12 md:w-12 rounded-full flex text-center items-center justify-center text-[10px] md:text-xs font-black transition-all duration-300",
                  selectedMonths === option.months
                    ? "bg-[#111111] text-white shadow-lg scale-105"
                    : "bg-[#F3F3F3] text-[#777777] hover:bg-gray-200"
                )}
              >
                {option.months} ay
              </div>
            </button>
          ))}
        </div>
 
        {/* Monthly Payment */}
        <div className="bg-[#F9FAFB] p-4 flex flex-col justify-center items-center">
          <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-0.5 text-center">
            AYLIQ ÖDƏNİŞ
          </span>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl md:text-2xl font-black text-[#111111] tracking-tighter">
              {monthlyPayment.toFixed(2)}
            </span>
            <span className="text-xl md:text-2xl font-bold text-[#111111]">₼</span>
          </div>
        </div>
      </div>
 
      <div className="mt-4 flex items-center gap-2 text-[10px] text-gray-400 font-bold uppercase tracking-tight">
        <Info className="h-3.5 w-3.5 text-blue-500" />
        <span>Bank seçimi ödəniş mərhələsində aparılır</span>
      </div>
    </div>
  );
}
