"use client";

import { useGetBrandsQuery } from "@/lib/store/brands/apislice";
import { fullUrl } from "@/lib/api/url-utils";
import Link from "next/link";
import { Award, Loader2, ArrowRight } from "lucide-react";

export default function BrandsPage() {
    const { data, isLoading } = useGetBrandsQuery({});

    const brands = data?.items;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="max-w-[1650px] mx-auto px-4 sm:px-6 lg:px-0 w-[calc(100%-2.5rem)] py-12">
            <div className="flex items-center gap-3 mb-10 pb-6 border-b border-gray-100">
                <Award className="h-8 w-8 text-blue-600" />
                <h1 className="text-3xl font-black text-gray-900 tracking-tight">Əməkdaşlıq etdiyimiz Brendlər</h1>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {brands?.map((brand) => (
                    <Link
                        key={brand.id}
                        href={`/shop?brand=${brand.slug}`}
                        className="group bg-white border border-gray-100 rounded-[32px] p-8 flex flex-col items-center justify-center gap-6 hover:shadow-2xl hover:border-blue-100 transition-all duration-500 hover:-translate-y-2"
                    >
                        <div className="h-24 w-full flex items-center justify-center grayscale group-hover:grayscale-0 transition-all duration-500">
                            <img
                                src={fullUrl(brand.logoUrl)}
                                alt={brand.name}
                                className="max-h-full max-w-full object-contain opacity-60 group-hover:opacity-100 transition-opacity"
                            />
                        </div>
                        <div className="flex flex-col items-center gap-2">
                            <span className="text-sm font-black text-gray-900 group-hover:text-blue-600 transition-colors uppercase tracking-widest">{brand.name}</span>
                            <div className="flex items-center gap-2 text-[10px] font-black text-blue-500 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                                MƏHSULLARA BAX <ArrowRight className="h-3 w-3" />
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
