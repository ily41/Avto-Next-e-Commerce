"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useFilterProductsQuery } from "@/lib/store/products/apislice";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { fullUrl } from "@/lib/api/url-utils";
import { IconSearch, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface SearchDropdownProps {
  searchTerm: string;
  onClose: () => void;
  className?: string;
}

export function SearchDropdown({ searchTerm, onClose, className }: SearchDropdownProps) {
  // Fetch products with a small limit for the dropdown
  const { data: productData, isFetching: isFetchingProducts } = useFilterProductsQuery(
    { searchTerm, pageSize: 6 },
    { skip: searchTerm.length < 2 }
  );

  // Fetch all categories to filter locally
  const { data: categories } = useGetCategoriesQuery();

  const filteredCategories = useMemo(() => {
    if (!searchTerm || !categories) return [];
    
    const results: any[] = [];
    const searchLower = searchTerm.toLowerCase();

    const traverse = (cats: any[]) => {
      for (const cat of cats) {
        if (cat.name.toLowerCase().includes(searchLower)) {
          results.push(cat);
        }
        if (cat.subCategories && cat.subCategories.length > 0) {
          traverse(cat.subCategories);
        }
      }
    };

    traverse(categories);
    return results.slice(0, 4); // Limit to top 4 category matches
  }, [searchTerm, categories]);

  if (searchTerm.length < 2) return null;

  const hasResults = filteredCategories.length > 0 || (productData?.products && productData.products.length > 0);

  return (
    <div className={cn(
      "absolute top-full left-0 right-0 mt-3 bg-white border border-gray-200 shadow-xl rounded-xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2 duration-300",
      className
    )}>
      <div className="max-h-[500px] overflow-y-auto">
        
        {/* Categories Section */}
        {filteredCategories.length > 0 && (
          <div className="p-5 border-b border-gray-100 bg-[#f9f9f9]/50">
            <h3 className="text-[11px] font-extrabold text-[#767676] uppercase tracking-wider mb-3">Kateqoriyalar</h3>
            <div className="flex flex-wrap gap-2">
              {filteredCategories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={onClose}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white border border-gray-100 hover:border-blue-400 hover:bg-blue-50 group transition-all shadow-sm"
                >
                  <span className="text-[14px] font-semibold text-gray-700 group-hover:text-blue-600">{cat.name}</span>
                  <IconChevronRight size={12} className="text-gray-400 group-hover:text-blue-500" />
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Products Section */}
        <div className="p-5">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-[11px] font-extrabold text-[#767676] uppercase tracking-wider">Məhsullar</h3>
                {isFetchingProducts && (
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                )}
            </div>
            
            {productData?.products && productData.products.length > 0 ? (
                <div className="grid grid-cols-1 gap-1">
                {productData.products.map((product) => (
                    <Link
                    key={product.id}
                    href={`/product/${product.slug || product.id}`}
                    onClick={onClose}
                    className="flex items-center gap-4 p-3 rounded-lg hover:bg-blue-50/50 transition-all group"
                    >
                    <div className="w-14 h-14 bg-white border border-gray-100 rounded-lg p-1.5 shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                        <img 
                        src={fullUrl(product.primaryImageUrl || product.imageUrl)} 
                        alt={product.name}
                        className="w-full h-full object-contain"
                        />
                    </div>
                    <div className="flex flex-col flex-1 overflow-hidden">
                        <span className="text-[14px] font-bold text-gray-800 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                        {product.name}
                        </span>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[14px] font-extrabold text-blue-600">
                                {product.discountedPrice && product.price > product.discountedPrice 
                                ? `$${product.discountedPrice}`
                                : `$${product.price}`
                                }
                            </span>
                            {product.discountedPrice && product.price > product.discountedPrice && (
                                <span className="text-[12px] text-gray-400 line-through font-medium">${product.price}</span>
                            )}
                        </div>
                    </div>
                    </Link>
                ))}
                </div>
            ) : !isFetchingProducts ? (
                <div className="py-10 text-center flex flex-col items-center gap-3">
                    <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300">
                    <IconSearch size={28} />
                    </div>
                    <p className="text-[14px] text-gray-500 font-medium tracking-tight whitespace-pre-wrap px-10">"{searchTerm}" üçün nəticə tapılmadı</p>
                </div>
            ) : null}
        </div>
      </div>

      {/* Footer / See more */}
      {hasResults && !isFetchingProducts && (
         <Link 
           href={`/shop?searchTerm=${encodeURIComponent(searchTerm)}`}
           onClick={onClose}
           className="block w-full py-4 bg-blue-600 text-[13px] font-bold text-white text-center hover:bg-black transition-all uppercase tracking-widest shadow-lg"
         >
            Bütün nəticələrə bax
         </Link>
      )}
    </div>
  );
}
