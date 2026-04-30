"use client";

import React, { useRef } from "react";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import ProductCard from "@/components/card/ProductCard";

interface RelatedProductsSectionProps {
  products: any[];
}

export default function RelatedProductsSection({ products }: RelatedProductsSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = direction === "left" ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <div className="mt-32">
      <div className="flex justify-between items-end mb-10">
        <h2 className="text-[24px] md:text-[28px] font-bold text-gray-900 border-l-4 border-blue-600 pl-4 uppercase tracking-tight">ƏLAQƏLİ MƏHSULLAR</h2>
        <div className="flex gap-2">
          <button onClick={() => scroll("left")} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 bg-white transition-all shadow-sm shadow-[#f2f2f2] group">
            <IconChevronLeft size={20} className="text-gray-400 group-hover:text-blue-600" />
          </button>
          <button onClick={() => scroll("right")} className="w-10 h-10 rounded-full border border-gray-100 flex items-center justify-center hover:bg-gray-50 bg-white transition-all shadow-sm shadow-[#f2f2f2] group">
            <IconChevronRight size={20} className="text-gray-400 group-hover:text-blue-600" />
          </button>
        </div>
      </div>
      
      <div 
        ref={scrollRef}
        className="flex gap-4 md:gap-8 overflow-x-auto no-scrollbar scroll-smooth pb-4 px-1"
      >
        {products.map((item: any) => (
          <div key={item.id} className="min-w-[170px] md:min-w-[280px] w-[50%] md:w-auto h-full">
             <ProductCard product={item} />
          </div>
        ))}
      </div>
    </div>
  );
}
