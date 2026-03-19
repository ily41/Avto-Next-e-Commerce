"use client";

import React, { useEffect, useState } from "react";
import { useGetBrandsQuery } from "@/lib/store/brands/apislice";
import { fullUrl } from "@/lib/utils";

const PopularBrands = () => {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        setWidth(window.innerWidth);
        const handleResize = () => setWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    // Fetch up to 8 brands
    const { data, isLoading } = useGetBrandsQuery({ pageIndex: 1, pageSize: 10 });

    // Determine limit based on breakpoints
    // Mobile (<768): 4
    // Tablet (768-1024): 6
    // Desktop (>1024): 8
    const displayLimit = width < 768 ? 4 : width < 1024 ? 6 : width < 1350 ? 8 : 10;
    const brands = (data?.items || []).slice(0, displayLimit);

    return (
        <section className="w-full bg-white py-10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
                {/* Header */}
                <div className="mb-8 pb-4 border-b border-gray-100">
                    <h2 className="text-xl font-bold text-[#1a1a1a]">Popular Brands</h2>
                </div>

                {/* Brands Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                    {isLoading ? (
                        [...Array(displayLimit)].map((_, i) => (
                            <div key={i} className="h-24 bg-gray-50 rounded-xl animate-pulse" />
                        ))
                    ) : (
                        brands.map((brand) => (
                            <div 
                                key={brand.id} 
                                className="h-24 bg-[#F8F8F8] rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-md cursor-pointer group"
                            >
                                <img
                                    src={fullUrl(brand.logoUrl)}
                                    alt={brand.name}
                                    className="max-h-full min-h-[90px] max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                                />
                            </div>
                        ))
                    )}
                </div>
            </div>
        </section>
    );
};

export default PopularBrands;
