"use client";

import { useState, useRef, useEffect } from "react";
import { useFilterProductsQuery } from "@/lib/store/products/apislice";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import ProductCard from "@/components/card/ProductCard";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface ProductsMegaMenuProps {
    isOpen: boolean;
    setHoveredLink: (link: string | null) => void;
}

const ProductsMegaMenu = ({ isOpen, setHoveredLink }: ProductsMegaMenuProps) => {
    const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch root categories for the top links in the dropdown
    const { data: categoryData } = useGetCategoriesQuery();
    const topCategories = categoryData?.slice(0, 3) || [];

    // Set initial category when data loads
    useEffect(() => {
        if (topCategories.length > 0 && !selectedCategoryId) {
            setSelectedCategoryId(topCategories[0].id);
        }
    }, [topCategories, selectedCategoryId]);

    // Fetch products for the dropdown, filtered by selected category
    const { data: productData, isFetching: isProductsFetching } = useFilterProductsQuery({
        pageSize: 8,
        categoryId: selectedCategoryId || undefined
    });
    const products = productData?.products || [];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <div
            className={`absolute top-[52px] left-0 max-w-[calc(100vw-48px)] w-full bg-white border border-gray-100 shadow-2xl z-[100] transition-all duration-60 ease-inout p-4 pt-6 origin-bottom ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none"
                }`}
            onMouseEnter={() => setHoveredLink("Məhsullar")}
            onMouseLeave={() => setHoveredLink(null)}
        >
            {/* Inner Nav within Dropdown */}
            <div className="flex items-center justify-center gap-6 mb-5 border-b border-gray-50 ">
                {topCategories.map((cat, i) => (
                    <div key={cat.id} className="flex items-center gap-4">
                        <div
                            onClick={() => setSelectedCategoryId(cat.id)}
                            className={`text-sm font-semibold transition-all cursor-pointer pb-2 mb-[-1px] ${selectedCategoryId === cat.id
                                ? "text-blue-600 border-b-2 border-blue-600"
                                : "text-gray-500 hover:text-blue-600"}`}
                        >
                            {cat.name}
                        </div>
                        {i < topCategories.length - 1 && <span className="text-gray-200 pb-2">|</span>}
                    </div>
                ))}
            </div>

            {/* Product Slider Container */}
            <div className="relative group/slider ">
                <div
                    ref={scrollRef}
                    className={`flex justify-start items-start overflow-x-hidden scroll-smooth border-l border-t border-b border-gray-100 transition-opacity duration-300 ${isProductsFetching ? "opacity-50" : "opacity-100"}`}
                >
                    {products.length > 0 ? (
                        products.map((product) => (
                            <div key={product.id} className="w-1/4 min-w-[250px] max-w-[300px] border-r border-gray-100 flex-shrink-0">
                                <ProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="w-full py-20 flex flex-col items-center justify-center bg-white rounded-xl">
                            {isProductsFetching &&
                                <div className="animate-spin rounded-full bg-white h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                            }
                            <p className="text-sm text-gray-400 font-medium">{isProductsFetching ? "Məhsullar yüklənir..." : "Bu kateqoriyada məhsul tapılmadı"}</p>
                        </div>
                    )}
                </div>

                {/* Navigation Arrows */}
                {products.length > 4 && (
                    <>
                        <button
                            onClick={() => scroll('left')}
                            className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 transition-all hover:bg-blue-600 hover:text-white opacity-0 group-hover/slider:opacity-100 z-50"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button
                            onClick={() => scroll('right')}
                            className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 transition-all hover:bg-blue-600 hover:text-white opacity-0 group-hover/slider:opacity-100 z-50"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default ProductsMegaMenu;
