"use client";
 
import { useState, useEffect } from "react";
import {
  useGetInstallmentOptionsQuery,
  useCalculateInstallmentQuery
} from "@/lib/store/installment/installmentApiSlice";
import { Loader2, Info } from "lucide-react";
import { cn } from "@/lib/utils";
 
interface NormalInstallmentCalculatorProps {
  totalAmount: number;
}
 
export function NormalInstallmentCalculator({ totalAmount }: NormalInstallmentCalculatorProps) {
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
 
  const { data: rawOptions, isLoading, isError } = useGetInstallmentOptionsQuery({ amount: totalAmount });
  
  const options = rawOptions?.filter(option => (totalAmount / option.installmentPeriod) > 15);

  useEffect(() => {
    if (options && options.length > 0 && !selectedOptionId) {
      setSelectedOptionId(options[0].id);
    }
  }, [options, selectedOptionId]);
 
  const { data: calculation, isFetching: isCalculating } = useCalculateInstallmentQuery(
    { amount: totalAmount, optionId: selectedOptionId! },
    { skip: !selectedOptionId }
  );
 
  if (isLoading) {
    return (
      <div className="mt-6 p-6 bg-white rounded-2xl border border-gray-100 flex items-center justify-center">
        <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
      </div>
    );
  }
 
  if (isError || !options || options.length === 0) {
    return null;
  }
 
  const selectedOption = options.find((o) => o.id === selectedOptionId);
 
  return (
    <div className="mt-8 bg-white rounded-[24px] border border-gray-100 p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-[17px] font-black text-gray-900 tracking-tight">
          Hissəli alış kalkulyatoru
        </h3>
        <p className="text-[11px] font-bold text-gray-400 mt-1 uppercase tracking-tight">
          Şərtlər bank tariflərinə əsasən tətbiq olunur
        </p>
      </div>
 
      <div className="flex flex-col border border-gray-100 rounded-[20px] overflow-hidden">
        {/* Months selection */}
        <div className="flex-1 p-4 md:p-5 flex items-center justify-center gap-3 overflow-x-auto no-scrollbar border-b border-gray-50">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelectedOptionId(option.id)}
              className="relative flex flex-col items-center flex-shrink-0"
            >
              {option.interestPercentage === 0 && (
                <span className="absolute -top-1 text-[10px] font-black text-red-500 whitespace-nowrap bg-white px-1">
                  0%
                </span>
              )}
              <div
                className={cn(
                  "h-12 w-12 md:h-14 md:w-14 rounded-full flex text-center items-center justify-center text-[11px] md:text-sm font-black transition-all duration-300 mt-3",
                  selectedOptionId === option.id
                    ? "bg-[#111111] text-white shadow-lg scale-105"
                    : "bg-[#F3F3F3] text-[#777777] hover:bg-gray-200"
                )}
              >
                {option.installmentPeriod} ay
              </div>
            </button>
          ))}
        </div>
 
        {/* Monthly Payment */}
        <div className="bg-[#F9FAFB] p-5 md:p-6 flex flex-col justify-center items-center">
          <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 text-center">
            Aylıq
          </span>
          <div className="flex items-center justify-center gap-1.5">
            <span className="text-xl md:text-2xl font-black text-[#111111] tracking-tighter">
              {isCalculating ? (
                <span className="animate-pulse">...</span>
              ) : (
                calculation?.monthlyPayment.toFixed(2) || (totalAmount / (selectedOption?.installmentPeriod || 1)).toFixed(2)
              )}
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
