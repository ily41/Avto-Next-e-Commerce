"use client";

import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { useGetHotDealsQuery } from "@/lib/store/products/apislice";
import { fullUrl } from "@/lib/utils";
import Link from "next/link";
import MiniProductCard from "../categoriesDropdown/MiniProductCard";

interface TopDealsMegaMenuProps {
    isOpen: boolean;
    setHoveredLink: (link: string | null) => void;
}

const TopDealsMegaMenu = ({ isOpen, setHoveredLink }: TopDealsMegaMenuProps) => {
    const { data: categories, isLoading: isCatsLoading } = useGetCategoriesQuery();
    const { data: topRated, isLoading: isProductsLoading } = useGetHotDealsQuery();

    // Take first 8 root categories for the "Shop By" section
    const displayCategories = categories?.slice(0, 8) || [];
    // Take first 6 hot deals for the "Top Rated" section
    const displayProducts = topRated?.slice(0, 6) || [];

    return (
        <div
            className={`absolute top-[52px] left-0 max-w-[calc(100vw-48px)] w-full bg-white border border-gray-100 shadow-2xl z-40 transition-all duration-300 ease-in-out flex origin-bottom ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none"
                }`}
            onMouseEnter={() => setHoveredLink("Top təkliflər")}
            onMouseLeave={() => setHoveredLink(null)}
        >
            {/* Left Side: Shop By Categories Circles */}
            <div className="w-[50%] p-8">
                <h3 className="text-center text-[16px] font-semibold text-gray-900 mb-8">Kateqoriyalar</h3>
                <div className="grid grid-cols-4 gap-y-5">
                    {displayCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`shop?category=${category.slug}`}
                            className="group flex flex-col items-center gap-3"
                        >
                            <div className="w-24 h-24 rounded-full border-2 border-gray-100 flex items-center justify-center p-4 transition-all duration-300 group-hover:border-blue-600 group-hover:shadow-md bg-white overflow-hidden">
                                {category.imageUrl ? (
                                    <img
                                        src={fullUrl(category.imageUrl)}
                                        alt={category.name}
                                        className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-10 h-10 bg-gray-100 rounded-full" />
                                )}
                            </div>
                            <span className="text-[13px] font-medium text-gray-700 group-hover:text-blue-600 transition-colors">
                                {category.name}
                            </span>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Right Side: Top Rated Grid (3 rows x 2 columns) */}
            <div className="w-[50%] bg-gray-50/50 p-6 border-l border-gray-100">
                <h3 className="text-center text-[14px] font-semibold text-gray-900 mb-6">Ən çox satılanlar</h3>

                <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100 rounded-lg overflow-hidden">
                    {displayProducts.length > 0 ? (
                        displayProducts.map((product) => (
                            <div key={product.id} className="bg-white">
                                <MiniProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 py-20 flex flex-col items-center justify-center bg-white">
                            {isProductsLoading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            ) : (
                                <p className="text-gray-400 text-sm">Ən reytinqli məhsul tapılmadı</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default TopDealsMegaMenu;
