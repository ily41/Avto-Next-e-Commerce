"use client";

import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { useGetHotDealsQuery } from "@/lib/store/products/apislice";
import Link from "next/link";
import MiniProductCard from "./MiniProductCard";

interface CategoriesMegaMenuProps {
    isOpen: boolean;
    setHoveredLink: (link: string | null) => void;
}

const CategoriesMegaMenu = ({ isOpen, setHoveredLink }: CategoriesMegaMenuProps) => {
    const { data: categories, isLoading: isCatsLoading } = useGetCategoriesQuery();
    const { data: hotDeals, isLoading: isProductsLoading } = useGetHotDealsQuery();

    // Take first 6 root categories for display
    const displayCategories = categories?.slice(0, 6) || [];
    // Take first 4 hot deals for display
    const displayProducts = hotDeals?.slice(0, 4) || [];

    return (
        <div
            className={`absolute top-[52px] left-0 max-w-[calc(100vw-48px)] w-full bg-white border border-gray-100 shadow-2xl z-[100] transition-all duration-300 ease-in-out flex origin-bottom ${isOpen
                ? "opacity-100 translate-y-0 pointer-events-auto"
                : "opacity-0 translate-y-8 pointer-events-none"
                }`}
            onMouseEnter={() => setHoveredLink("Categories")}
            onMouseLeave={() => setHoveredLink(null)}
        >
            {/* Left Side: Categories Grid */}
            <div className="w-[50%] p-8 grid grid-cols-3 gap-y-10 gap-x-8">
                {displayCategories.map((category) => (
                    <div key={category.id} className="flex flex-col gap-4">
                        <Link
                            href={`/category/${category.slug}`}
                            className="text-[17px] font-medium text-gray-900 hover:text-blue-600 transition-colors"
                        >
                            {category.name}
                        </Link>
                        <div className="flex flex-col gap-2.5">
                            {category.subCategories?.slice(0, 4).map((sub) => (
                                <Link
                                    key={sub.id}
                                    href={`/category/${sub.slug}`}
                                    className="text-[14px] text-gray-500 hover:text-blue-600 hover:translate-x-1 transition-all"
                                >
                                    {sub.name}
                                </Link>
                            ))}
                            {(category.subCategories?.length || 0) > 4 && (
                                <Link
                                    href={`/category/${category.slug}`}
                                    className="text-[14px] text-blue-600 font-medium hover:underline"
                                >
                                    View all
                                </Link>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Right Side: Hot Deals Grid (2 columns) */}
            <div className="w-[50%] bg-gray-50/50 p-4 border-l border-gray-100">
                <div className="flex items-center justify-center my-4">
                    <h3 className="text-[14px] font-semibold text-gray-900">Best Selling</h3>

                </div>

                <div className="grid grid-cols-2 gap-px bg-gray-100 border border-gray-100">
                    {displayProducts.length > 0 ? (
                        displayProducts.map((product) => (
                            <div key={product.id} className="bg-white">
                                <MiniProductCard product={product} />
                            </div>
                        ))
                    ) : (
                        <div className="col-span-2 py-10 flex flex-col items-center justify-center bg-white">
                            {isProductsLoading ? (
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                            ) : (
                                <p className="text-gray-400 text-sm">No hot deals found</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategoriesMegaMenu;
