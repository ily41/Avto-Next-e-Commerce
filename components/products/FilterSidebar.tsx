"use client";

import { useState, useEffect } from "react";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { useGetBrandsQuery } from "@/lib/store/brands/apislice";
import { useGetFiltersQuery } from "@/lib/store/filters/apislice";
import { IconCheck, IconChevronDown, IconChevronRight } from "@tabler/icons-react";

interface FilterSidebarProps {
   currentCategories?: string[];
   currentBrand?: string;
   currentFilters?: Record<string, string[]>;
   onFilterChange: (key: string, value: string | null) => void;
}

export default function FilterSidebar({
   currentCategories = [],
   currentBrand,
   currentFilters,
   onFilterChange
}: FilterSidebarProps) {
   const { data: categories } = useGetCategoriesQuery();
   const { data: brandsData } = useGetBrandsQuery({ pageIndex: 1, pageSize: 50 });
   const { data: customFilters } = useGetFiltersQuery();

   const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>({});

   // Auto-expand parent if any currentCategory is a subcategory
   useEffect(() => {
      if (currentCategories.length > 0 && categories) {
         categories.forEach(cat => {
            if (cat.subCategories?.some(sub => currentCategories.includes(sub.slug))) {
               setExpandedCategories(prev => ({ ...prev, [cat.id]: true }));
            }
         });
      }
   }, [currentCategories, categories]);

   const toggleExpand = (e: React.MouseEvent, categoryId: string) => {
      e.preventDefault();
      e.stopPropagation();
      setExpandedCategories(prev => ({
         ...prev,
         [categoryId]: !prev[categoryId]
      }));
   };

   const handleCategoryToggle = (slug: string) => {
      let nextCategories;
      if (currentCategories.includes(slug)) {
         nextCategories = currentCategories.filter(s => s !== slug);
      } else {
         nextCategories = [...currentCategories, slug];
      }
      onFilterChange("category", nextCategories.length > 0 ? nextCategories.join(",") : null);
   };


   return (
      <aside className="w-full flex flex-col space-y-8">

         {/* Categories */}
         <div className="border border-[#f2f2f2] rounded-lg p-5">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
               Shop By Categories
               <span className="text-gray-400 font-normal leading-none">-</span>
            </h3>
            <div className="flex flex-col gap-1">
               {categories?.map((cat) => {
                  const hasSubCategories = cat.subCategories && cat.subCategories.length > 0;
                  const isExpanded = expandedCategories[cat.id];
                  const isSelected = currentCategories.includes(cat.slug);

                  return (
                     <div key={cat.id} className="flex flex-col">
                        <div className="flex items-center group">
                           <div
                              className="relative flex-grow flex items-center gap-3 py-1.5 cursor-pointer"
                              onClick={() => {
                                 handleCategoryToggle(cat.slug);
                                 if (hasSubCategories && !isExpanded) {
                                    setExpandedCategories(prev => ({ ...prev, [cat.id]: true }));
                                 }
                              }}
                           >
                              <div className={`w-4 h-4 rounded-sm border ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-500"} flex items-center justify-center transition-colors flex-shrink-0`}>
                                 {isSelected && <IconCheck size={12} className="text-white" />}
                              </div>
                              <span className={`text-[13px] ${isSelected ? "text-blue-600 font-medium" : "text-gray-600 group-hover:text-blue-600"} transition-colors line-clamp-1`}>
                                 {cat.name}
                              </span>
                           </div>

                           {hasSubCategories && (
                              <button
                                 onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(e, cat.id);
                                 }}
                                 className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                                 aria-label={isExpanded ? "Collapse" : "Expand"}
                              >
                                 {isExpanded ? <IconChevronDown size={16} /> : <IconChevronRight size={16} />}
                              </button>
                           )}
                        </div>

                        {/* Subcategories */}
                        {hasSubCategories && isExpanded && (
                           <div className="flex flex-col gap-1 ml-7 mt-1 border-l border-gray-100 pl-3">
                              {cat.subCategories?.map((sub) => {
                                 const isSubSelected = currentCategories.includes(sub.slug);
                                 return (
                                    <div 
                                       key={sub.id} 
                                       className="relative flex items-center gap-3 py-1 cursor-pointer group/sub"
                                       onClick={() => handleCategoryToggle(sub.slug)}
                                    >
                                       <div className={`w-3.5 h-3.5 rounded-sm border ${isSubSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover/sub:border-blue-500"} flex items-center justify-center transition-colors flex-shrink-0`}>
                                          {isSubSelected && <IconCheck size={10} className="text-white" />}
                                       </div>
                                       <span className={`text-[12px] ${isSubSelected ? "text-blue-600 font-medium" : "text-gray-500 group-hover/sub:text-blue-600"} transition-colors line-clamp-1`}>
                                          {sub.name}
                                       </span>
                                    </div>
                                 );
                              })}
                           </div>
                        )}
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Brands */}
         <div className="border border-[#f2f2f2] rounded-lg p-5">
            <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center">
               Brands
               <span className="text-gray-400 font-normal leading-none">-</span>
            </h3>
            <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto no-scrollbar">
               {brandsData?.items?.map((brand) => {
                  const isSelected = currentBrand === brand.slug || currentBrand === brand.name.toLowerCase();
                  return (
                     <div 
                        key={brand.id} 
                        className="relative flex items-center gap-3 py-0.5 cursor-pointer group"
                        onClick={() => onFilterChange("brand", isSelected ? null : brand.slug)}
                     >
                        <div className={`w-4 h-4 rounded-sm border ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-500"} flex items-center justify-center transition-colors flex-shrink-0`}>
                           {isSelected && <IconCheck size={12} className="text-white" />}
                        </div>
                        <span className={`text-[13px] ${isSelected ? "text-blue-600 font-medium" : "text-gray-600 group-hover:text-blue-600"} transition-colors line-clamp-1`}>
                           {brand.name}
                        </span>
                     </div>
                  );
               })}
            </div>
         </div>

         {/* Dynamic Admin Filters */}
         {customFilters?.map((filter) => {
            const filterKey = `f_${filter.id}`;
            const selectedOptions = currentFilters?.[filter.id] || [];

            return (
               <div key={filter.id} className="border border-[#f2f2f2] rounded-lg p-5">
                  <h3 className="text-[15px] font-bold text-[#1a1a1a] mb-5 flex justify-between items-center capitalize">
                     {filter.name}
                     <span className="text-gray-400 font-normal leading-none">-</span>
                  </h3>
                  <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto no-scrollbar">
                     {filter.options?.map((option) => {
                        const isSelected = selectedOptions.includes(option.id);
                        
                        const handleToggle = () => {
                           let nextOptions;
                           if (isSelected) {
                              nextOptions = selectedOptions.filter(id => id !== option.id);
                           } else {
                              nextOptions = [...selectedOptions, option.id];
                           }
                           onFilterChange(filterKey, nextOptions.length > 0 ? nextOptions.join(",") : null);
                        };

                        return (
                           <div 
                              key={option.id} 
                              className="relative flex items-center gap-3 py-1 cursor-pointer group"
                              onClick={handleToggle}
                           >
                              <div className={`w-4 h-4 rounded-sm border ${isSelected ? "bg-blue-600 border-blue-600" : "border-gray-300 group-hover:border-blue-500"} flex items-center justify-center transition-colors flex-shrink-0`}>
                                 {isSelected && <IconCheck size={12} className="text-white" />}
                              </div>
                              <span className={`text-[13px] ${isSelected ? "text-blue-600 font-medium" : "text-gray-600 group-hover:text-blue-600"} transition-colors line-clamp-1`}>
                                 {option.displayName}
                              </span>
                           </div>
                        );
                     })}
                  </div> 
               </div>
            );
         })}

      </aside>
   );
}
