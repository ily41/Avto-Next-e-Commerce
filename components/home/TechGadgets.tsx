"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { IconChevronRight } from "@tabler/icons-react";
import { useGetRecommendationsQuery, Product } from "@/lib/store/products/apislice";
import { useGetBannersQuery } from "@/lib/store/banners/apislice";
import ProductCard from "../card/ProductCard";
import BannerItem from "../hero/BannerItem";

const TechGadgets = () => {
  const { data: recommendations, isLoading: itemsLoading } = useGetRecommendationsQuery({ limit: 12 });
  const { data: banners, isLoading: bannersLoading } = useGetBannersQuery({ type: 4 });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    setWidth(window.innerWidth);
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const displayLimit = width < 1024 ? 2 : width < 1350 ? 3 : 4;
  const displayProducts = (recommendations?.hotDeals || recommendations?.recentlyAdded || []).slice(0, displayLimit);
  const activeBanner = banners?.find(b => b.isCurrentlyActive) || banners?.[0];

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-[#1a1a1a]">Ən Son Texnoloji Qadcetlər</h1>
          <Link href="/shop" className="flex items-center gap-1 text-[13px] font-bold text-gray-800 hover:text-blue-600 transition-colors">
            Hamısına bax
            <IconChevronRight size={18} />
          </Link>
        </div>

        {/* Layout Containers - Reversed Order for Side Banner */}
        <div className="flex flex-col md:flex-row-reverse gap-6">
          {/* Banner Column - Right on Desktop */}
          <div className="w-full md:w-[30%] lg:w-[25%] xl:w-[20%] aspect-[16/9] md:aspect-[14/10]">
            {bannersLoading ? (
                 <div className="w-full h-full bg-gray-50 rounded-lg animate-pulse" />
            ) : activeBanner ? (
                <BannerItem banner={activeBanner} variant="secondary" />
            ) : null}
          </div>

          {/* Product Cards Column */}
          <div className="flex-1">
            <div 
              className="grid gap-6"
              style={{ 
                gridTemplateColumns: `repeat(${displayLimit === 2 ? 2 : displayLimit === 3 ? 3 : 4}, minmax(0, 1fr))` 
              }}
            >
              {itemsLoading ? (
                [...Array(displayLimit)].map((_, i) => (
                  <div key={i} className="aspect-[10/14] bg-gray-50 rounded-xl animate-pulse" />
                ))
              ) : (
                displayProducts.map((product) => (
                  <div key={product.id} className="aspect-[10/14]">
                    <ProductCard product={product} />
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechGadgets;
