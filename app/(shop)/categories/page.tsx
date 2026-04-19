"use client";

import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import Link from "next/link";
import { LayoutGrid, ChevronRight, Loader2 } from "lucide-react";

export default function CategoriesPage() {
    const { data: categories, isLoading } = useGetCategoriesQuery();

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1450px] mx-auto px-4 sm:px-6 lg:px-0 w-[calc(100%-2.5rem)] py-12">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                <LayoutGrid className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Bütün Kateqoriyalar</h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {categories?.map((category) => (
                    <div key={category.id} className="bg-white rounded-3xl border border-gray-100 p-8 hover:shadow-xl transition-all group">
                        <Link href={`/shop?category=${category.slug}`} className="flex items-center justify-between mb-6 group-hover:text-blue-600 transition-colors">
                            <h2 className="text-xl font-black">{category.name}</h2>
                            <ChevronRight className="h-5 w-5 text-gray-300 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                        </Link>
                        
                        <div className="space-y-3">
                            {category.subCategories?.map((sub) => (
                                <Link 
                                    key={sub.id} 
                                    href={`/shop?category=${sub.slug}`}
                                    className="flex items-center justify-between text-gray-500 hover:text-blue-600 text-[14px] font-medium transition-colors"
                                >
                                    <span>{sub.name}</span>
                                    <span className="h-1 w-1 rounded-full bg-gray-200" />
                                </Link>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
