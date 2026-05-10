// Server Component — no "use client" directive
// Data is fetched on the server with Next.js ISR caching.

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { fetchRecommendations, fetchBanners } from "@/lib/api/server-fetchers";
import ProductCard from "../card/ProductCard";
import BannerItem from "../hero/BannerItem";
import { cn } from "@/lib/utils";

const TechGadgets = async () => {
  const [recommendations, banners] = await Promise.all([
    fetchRecommendations(12),
    fetchBanners(4),
  ]);

  // Prefer hotDeals; fall back to recentlyAdded — max 4 per equivalent of desktop displayLimit
  const products = (
    recommendations?.hotDeals?.length
      ? recommendations.hotDeals
      : recommendations?.recentlyAdded ?? []
  ).slice(0, 4);

  const activeBanner =
    banners.find((b) => b.isCurrentlyActive) ?? banners[0] ?? null;

  return (
    <section className="w-full bg-white py-[var(--section-py)]">
      <div className="max-w-[80%] mx-auto sm:px-6 lg:px-0  w-[calc(100%-2.5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 md:mb-8 pb-3 md:pb-4 border-b border-gray-100">
          <h2 className="text-[16px] md:text-xl font-bold text-[#1a1a1a]">Sizin üçün tövsiyyə olunanlar</h2>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-[11px] md:text-[13px] font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Hamısına bax
            <IconChevronRight size={16} />
          </Link>
        </div>

        {/* Layout Containers — Reversed Order for Side Banner on Desktop */}
        <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-6">
          {/* Banner Column — Right on Desktop, stretches to match card row */}
          <div className="w-full md:w-[30%] lg:w-[25%] xl:w-[20%] self-stretch flex flex-col">
            {activeBanner ? (
              <div className="h-full">
                <BannerItem banner={activeBanner} variant="secondary" />
              </div>
            ) : null}
          </div>

          {/* Product Cards Column — Slideable on mobile, Grid on desktop */}
          <div className="flex-1 mt-4 md:mt-0 min-w-0">
            <div className="flex md:grid md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6 overflow-x-auto md:overflow-x-visible no-scrollbar snap-x snap-mandatory md:snap-none pb-1">
              {products.map((product) => (
                <div 
                  key={product.id} 
                  className="min-w-[48%] xs:min-w-[45%] md:min-w-0 h-full snap-start"
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechGadgets;
