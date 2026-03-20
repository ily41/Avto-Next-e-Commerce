"use client";

import { useState } from "react";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { useGetBrandsQuery } from "@/lib/store/brands/apislice";
import { IconCheck, IconStarFilled, IconStar } from "@tabler/icons-react";

interface FilterSidebarProps {
  currentCategory?: string;
  currentBrand?: string;
  onFilterChange: (key: string, value: string | null) => void;
}

export default function FilterSidebar({
  currentCategory,
  currentBrand,
  onFilterChange
}: FilterSidebarProps) {
  const { data: categories } = useGetCategoriesQuery();
  const { data: brandsData } = useGetBrandsQuery({ pageIndex: 1, pageSize: 50 }); // Fetch all locally

  // Hardcode color mock data based on exact visual design
  const colors = ["#000000", "#ffae00", "#1bc523", "#ff7a8a", "#6b00a3", "#ff0000", "#c1c1c1", "#5ec2eb", "#ffffff"];
  const sizes = ["L", "M", "S", "XL"];
  const priceRanges = [
     { label: "All", value: "" },
     { label: "$0–$400", value: "0-400" },
     { label: "$400–$800", value: "400-800" },
     { label: "$800–$1,200", value: "800-1200" },
     { label: "$1,200–$1,600", value: "1200-1600" },
     { label: "$1,600+", value: "1600-" },
  ];

  return (
    <aside className="w-full flex flex-col space-y-8">
      
      {/* Categories */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Shop By Categories
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-col gap-3">
            {categories?.map((cat) => (
               <label key={cat.id} className="relative flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-sm border ${currentCategory === cat.slug ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-500"} flex items-center justify-center transition-colors`}>
                     {currentCategory === cat.slug && <IconCheck size={12} className="text-white" />}
                  </div>
                  <span className={`text-[13px] ${currentCategory === cat.slug ? "text-blue-600 font-medium" : "text-gray-600 group-hover:text-blue-600"} transition-colors`}>
                     {cat.name}
                  </span>
                  <input 
                     type="radio" 
                     className="sr-only peer" 
                     checked={currentCategory === cat.slug}
                     onChange={() => onFilterChange("category", currentCategory === cat.slug ? null : cat.slug)}
                  />
                  {/* Focus ring applies when hidden input gets focus */}
                  <div className="absolute inset-0 rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 pointer-events-none" />
               </label>
            ))}
         </div>
      </div>

      {/* Brands */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Brands
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto no-scrollbar">
            {brandsData?.items?.map((brand) => (
               <label key={brand.id} className="relative flex items-center gap-3 cursor-pointer group">
                  <div className={`w-4 h-4 rounded-sm border ${currentBrand === brand.slug || currentBrand === brand.name.toLowerCase() ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-500"} flex items-center justify-center transition-colors`}>
                     {(currentBrand === brand.slug || currentBrand === brand.name.toLowerCase()) && <IconCheck size={12} className="text-white" />}
                  </div>
                  <span className={`text-[13px] ${(currentBrand === brand.slug || currentBrand === brand.name.toLowerCase()) ? "text-blue-600 font-medium" : "text-gray-600 group-hover:text-blue-600"} transition-colors`}>
                     {brand.name}
                  </span>
                  <input 
                     type="radio" 
                     className="sr-only peer" 
                     checked={currentBrand === brand.slug || currentBrand === brand.name.toLowerCase()}
                     onChange={() => onFilterChange("brand", (currentBrand === brand.slug || currentBrand === brand.name.toLowerCase()) ? null : brand.name.toLowerCase())}
                  />
                  <div className="absolute inset-0 rounded-sm peer-focus-visible:ring-2 peer-focus-visible:ring-blue-500 pointer-events-none" />
               </label>
            ))}
         </div>
      </div>

      {/* Highlight section */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Highlight
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-col gap-3">
            {["All Products", "Best Seller", "New Arrivals", "Sale", "Hot Items"].map(h => (
               <label key={h} className="flex items-center gap-3 cursor-pointer group">
                  <span className={`text-[13px] ${h === "All Products" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"} transition-colors`}>
                     {h}
                  </span>
               </label>
            ))}
         </div>
      </div>

      {/* Filter by Color */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Filter by Color
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-wrap gap-2.5">
            {colors.map(color => (
               <button 
                  key={color} 
                  className={`w-5 h-5 rounded-full ${color === "#ffffff" ? "border border-gray-300 bg-white" : ""} ring-2 ring-transparent hover:ring-blue-300 ring-offset-1 transition-all cursor-pointer`}
                  style={{ backgroundColor: color !== "#ffffff" ? color : undefined }}
                  aria-label={`Color ${color}`}
               />
            ))}
         </div>
      </div>

      {/* Filter by Size */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Filter by Size
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-wrap gap-2">
            {sizes.map(size => (
               <button 
                  key={size}
                  className="w-10 h-8 flex items-center justify-center border border-gray-200 text-[#444] text-xs font-medium rounded-sm hover:border-blue-600 hover:text-blue-600 transition-colors bg-white cursor-pointer"
               >
                  {size}
               </button>
            ))}
         </div>
      </div>

      {/* Price Filter */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Price Filter
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-col gap-3">
            {priceRanges.map(range => (
               <label key={range.label} className="flex items-center cursor-pointer group">
                  <span className={`text-[13px] ${range.label === "All" ? "text-blue-600 font-medium" : "text-gray-600 hover:text-blue-600"} transition-colors`}>
                     {range.label}
                  </span>
               </label>
            ))}
         </div>
      </div>

      {/* Average Rating */}
      <div className="border border-[#f2f2f2] rounded-lg p-5">
         <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
            Average rating
            <span className="text-gray-400 font-normal leading-none">-</span>
         </h3>
         <div className="flex flex-col gap-3">
            {[12, 8, 0, 0, 0].map((count, i) => {
               const stars = 5 - i;
               return (
                 <div key={stars} className="flex items-center justify-between group cursor-pointer">
                    <div className="flex gap-0.5">
                       {Array.from({ length: 5 }).map((_, index) => (
                           index < stars 
                             ? <IconStarFilled key={index} size={14} className="text-[#ffb800]" />
                             : <IconStar key={index} size={14} className="text-gray-300" />
                       ))}
                    </div>
                    <span className="text-[12px] text-gray-500 group-hover:text-blue-600 transition-colors">({count})</span>
                 </div>
               )
            })}
         </div>
      </div>

    </aside>
  );
}
