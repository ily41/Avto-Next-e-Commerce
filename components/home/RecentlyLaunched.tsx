// Server Component — no "use client" directive
// Data is fetched on the server; no loading skeleton on initial HTML.

import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { fetchRecommendations, fetchBanners } from "@/lib/api/server-fetchers";
import ProductCard from "../card/ProductCard";
import BannerItem from "../hero/BannerItem";
import { cn } from "@/lib/utils";

const RecentlyLaunched = async () => {
  // Both fetches run in parallel on the server
  const [recommendations, banners] = await Promise.all([
    fetchRecommendations(12),
    fetchBanners(1),
  ]);

  // Fetch up to 4 products; responsive column count is handled purely via CSS
  // (2 cols on mobile → 3 on medium → 4 on large) so we always pass 4 max.
  const products = (recommendations?.recentlyAdded ?? []).slice(0, 4);
  const activeBanner = banners.find((b) => b.isCurrentlyActive);

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-[90%] mx-auto sm:px-6 lg:px-0  w-[calc(100%-2.5rem)]">
        {/* Header */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Yeni Təqdim Olunmuşlar</h2>
          <Link
            href="/shop"
            className="flex items-center gap-1 text-[13px] font-bold text-gray-800 hover:text-blue-600 transition-colors"
          >
            Hamısına bax
            <IconChevronRight size={18} />
          </Link>
        </div>

        {/* Layout Containers */}
        <div className="flex flex-col md:flex-row gap-6">
          {/* Banner Column — stretches to match card row height */}
          <div className="w-full md:w-[30%] lg:w-[25%] xl:w-[20%] self-stretch flex flex-col">
            {activeBanner ? (
              <div className="h-full">
                <BannerItem banner={activeBanner} variant="secondary" />
              </div>
            ) : null}
          </div>

          {/* Product Cards Column — CSS handles responsive column count */}
          <div className="flex-1">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product, i) => {
                let displayClass = "";
                // mobile (< md): 2 elements (2 cols, 1 row). indices 2 & 3 are hidden.
                // tablet (md - lg): 3 elements (3 cols, 1 row). index 3 is hidden.
                // desktop (lg+): 4 elements (4 cols, 1 row). all visible.
                if (i === 2) displayClass = "hidden md:block";
                else if (i === 3) displayClass = "hidden lg:block";

                return (
                  <div key={product.id} className={cn(displayClass, "h-full")}>
                    <ProductCard product={product} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RecentlyLaunched;
