"use client";

import { useState } from "react";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import { fullUrl } from "@/lib/api/url-utils";
import Link from "next/link";
import { LayoutGrid, ChevronDown, Loader2, ArrowRight } from "lucide-react";

export default function CategoriesPage() {
    const { data: categories, isLoading } = useGetCategoriesQuery();
    const [openId, setOpenId] = useState<string | null>(null);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[90%] mx-auto px-4 sm:px-6 lg:px-0 w-[calc(100%-2.5rem)] py-12">
            {/* Page heading */}
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                <LayoutGrid className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bütün Kateqoriyalar</h1>
            </div>

            <div className="flex flex-col gap-3">
                {categories?.map((category) => {
                    const isOpen = openId === category.id;
                    const hasSubs = (category.subCategories?.length ?? 0) > 0;

                    return (
                        <div
                            key={category.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
                        >
                            {/* ── Dropdown trigger ── */}
                            <button
                                onClick={() => setOpenId(isOpen ? null : category.id)}
                                className="w-full flex items-center gap-5 px-5 py-4 text-left group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-inset"
                                aria-expanded={isOpen}
                            >
                                {/* Category image */}
                                <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-1">
                                    <img
                                        src={fullUrl(category.imageUrl)}
                                        alt={category.name}
                                        onError={(e) => (e.currentTarget.src = "/logos/logo3.svg")}
                                        className="w-full h-full object-contain"
                                        loading="lazy"
                                    />
                                </div>

                                {/* Name + sub-count */}
                                <div className="flex-1 min-w-0">
                                    <p className="text-base font-bold text-gray-900 group-hover:text-blue-600 transition-colors truncate">
                                        {category.name}
                                    </p>
                                    {hasSubs && (
                                        <p className="text-xs text-gray-400 mt-0.5">
                                            {category.subCategories!.length} alt kateqoriya
                                        </p>
                                    )}
                                </div>

                                {/* Shop link (stops propagation so it doesn't toggle the accordion) */}
                                <Link
                                    href={`/shop?category=${category.slug}`}
                                    onClick={(e) => e.stopPropagation()}
                                    className="flex-shrink-0 hidden sm:flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-full transition-colors"
                                >
                                    Hamısına bax
                                    <ArrowRight className="h-3 w-3" />
                                </Link>

                                {/* Chevron */}
                                {hasSubs && (
                                    <ChevronDown
                                        className={`flex-shrink-0 h-5 w-5 text-gray-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-blue-500" : ""
                                            }`}
                                    />
                                )}
                            </button>

                            {/* ── Subcategory panel ── */}
                            {hasSubs && (
                                <div
                                    style={{
                                        maxHeight: isOpen ? `${category.subCategories!.length * 80 + 64}px` : "0px",
                                    }}
                                    className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
                                >
                                    <div className="border-t border-gray-100 px-5 py-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                                        {category.subCategories!.map((sub) => (
                                            <Link
                                                key={sub.id}
                                                href={`/shop?category=${sub.slug}`}
                                                className="flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-blue-50 group/sub transition-colors"
                                            >
                                                {/* Sub image */}
                                                <div className="flex-shrink-0 w-9 h-9 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex items-center justify-center p-0.5">
                                                    <img
                                                        src={fullUrl(sub.imageUrl)}
                                                        alt={sub.name}
                                                        onError={(e) => (e.currentTarget.src = "/logos/logo3.svg")}
                                                        className="w-full h-full object-contain"
                                                        loading="lazy"
                                                    />
                                                </div>

                                                <span className="flex-1 text-sm font-medium text-gray-600 group-hover/sub:text-blue-600 transition-colors">
                                                    {sub.name}
                                                </span>

                                                <ArrowRight className="h-3.5 w-3.5 text-gray-300 group-hover/sub:text-blue-500 transition-colors flex-shrink-0" />
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
