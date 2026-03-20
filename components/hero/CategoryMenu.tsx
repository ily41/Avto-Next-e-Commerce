"use client";

import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { ChevronRight, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import CategoryMenuSkeleton from "./CategoryMenuSkeleton";

const CategoryMenu = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

    if (isLoading) {
        return <CategoryMenuSkeleton />;
    }

    return (
        <div className="relative w-full bg-white border border-blue-600 rounded-lg mt-2">
            <div className="bg-blue-600 text-white px-5 py-[13.5px] font-bold flex items-center rounded-t-lg lg:hidden">
                <LayoutGrid size={18} className="mr-3" />
                <span className="capitalize text-xs tracking-widest">Bütün Kateqoriyalar</span>
            </div>
            <ul className="flex flex-col">
                <li className="bg-blue-600 text-white px-5 py-3.5 font-bold hidden lg:flex items-center rounded-t-lg">
                    <LayoutGrid size={18} className="mr-3" />
                    <span className="capitalize text-xs tracking-widest">Bütün Kateqoriyalar</span>
                </li>
                {/* Our Store with Mega Menu */}
                <li
                    onMouseEnter={() => setHoveredCategory("our-store")}
                    onMouseLeave={() => setHoveredCategory(null)}
                    className="relative group px-5 py-3.5 hover:bg-gray-50 cursor-pointer flex justify-between items-center transition-all border-b border-gray-50"
                >
                    <Link href="/shop" className="text-blue-600 font-bold text-[15px] flex items-center">
                        Mağazamız
                    </Link>
                    <ChevronRight size={16} className="text-blue-600 group-hover:translate-x-1 transition-transform" />

                    {/* Mega Menu Content */}
                    {hoveredCategory === "our-store" && categories && categories.length > 0 && (
                        <div className="absolute left-full top-0 w-[700px] bg-white border border-gray-100 shadow-2xl z-50 p-8 rounded-r-2xl grid grid-cols-3 gap-x-8 gap-y-10 animate-in fade-in slide-in-from-left-2 duration-200">
                            {categories.map((category) => (
                                <div key={category.id} className="flex flex-col space-y-4">
                                    <Link href={`shop?category=${category.slug}`} className="font-bold text-gray-900 text-base hover:text-blue-600 transition-colors">
                                        {category.name}
                                    </Link>
                                    <ul className="flex flex-col space-y-1">
                                        {category.subCategories?.map((sub) => (
                                            <li key={sub.id}>
                                                <Link href={`shop?category=${sub.slug}`} className="text-sm text-gray-500 hover:text-blue-600 transition-colors">
                                                    {sub.name}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    )}
                </li>

                {/* Dynamic Root Categories */}
                {categories?.map((category) => (
                    <li
                        key={category.id}
                        onMouseEnter={() => setHoveredCategory(category.id)}
                        onMouseLeave={() => setHoveredCategory(null)}
                        className="relative group px-5 py-3.5 hover:bg-gray-50 last:rounded-xl cursor-pointer flex justify-between items-center transition-all border-b border-gray-50 last:border-0"
                    >
                        <Link
                            href={`shop?category=${category.slug}`}
                            className="text-gray-700 group-hover:text-blue-600 text-[14px] font-medium transition-colors"
                        >
                            {category.name}
                        </Link>
                        {category.subCategories && category.subCategories.length > 0 && (
                            <ChevronRight size={14} className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-transform" />
                        )}

                        {/* Optional: Render subcategories in a simple dropdown if needed */}
                        {hoveredCategory === category.id && category.subCategories && category.subCategories.length > 0 && (
                            <div className="absolute left-full top-0 w-64 bg-white border border-gray-100 shadow-xl z-50 py-3 rounded-r-xl animate-in fade-in slide-in-from-left-1 duration-150">
                                {category.subCategories.map((sub) => (
                                    <Link
                                        key={sub.id}
                                        href={`shop?category=${sub.slug}`}
                                        className="block px-5 py-2.5 text-sm text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                    >
                                        {sub.name}
                                    </Link>
                                ))}
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CategoryMenu;
