"use client";

import { useMemo } from "react";
import type { Banner } from "@/lib/api/types";
import BannerItem from "./BannerItem";
import CategoryMenu from "./CategoryMenu";
import NavLinks from "./NavLinks";

interface HeroClientProps {
  banners: Banner[];
}

const HeroClient = ({ banners }: HeroClientProps) => {
  const { mainBanner, secondaryBanners } = useMemo(() => {
    const activeBanners = banners
      .filter((b) => b.isCurrentlyActive)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return {
      mainBanner: activeBanners.find((b) => b.type === 0) || null,
      secondaryBanners: activeBanners.filter((b) => b.type === 2),
    };
  }, [banners]);

  return (
    <section className="w-full bg-white pb-10">
      <div className="max-w-[1450px] mx-auto ">
        <div className="flex flex-col relative lg:grid lg:grid-cols-[256px_1fr] gap-6">
          {/* Column 1: Vertical Sidebar (Desktop only) */}
          <div className="hidden lg:block">
            <CategoryMenu />
          </div>

          {/* Column 2: Header Row + Main Banner */}
          <div className="flex flex-col lg:h-full">
            {/* Desktop Row 1: Nav Links Header */}
            <div className="hidden lg:flex shrink-0 items-center justify-between h-[52px]">
              <NavLinks />
            </div>

            {/* Main Hero */}
            <div className="h-full lg:flex-1 lg:h-full relative">
              {mainBanner && <BannerItem banner={mainBanner} />}
            </div>
          </div>
        </div>

        {/* Bottom Block: Secondary Banners */}
        <div className="w-full mt-6 lg:mt-8">
          {/* Desktop: Grid of 3 */}
          <div className="hidden lg:grid h-[180px] grid-cols-3 gap-6">
            {secondaryBanners.slice(0, 3).map((banner) => (
              <div key={banner.id} className="h-full relative">
                <BannerItem banner={banner} variant="secondary" />
              </div>
            ))}
          </div>

          {/* Tablet: Horizontal scroll */}
          <div className="hidden md:flex lg:hidden w-full overflow-x-auto no-scrollbar pb-2">
            <div className="flex flex-nowrap gap-4 h-[220px]">
              {secondaryBanners.map((banner) => (
                <div key={banner.id} className="w-[350px] shrink-0 h-full relative">
                  <BannerItem banner={banner} variant="secondary" />
                </div>
              ))}
            </div>
          </div>

          {/* Mobile: Only the first one */}
          <div className="flex md:hidden flex-col">
            {secondaryBanners.length > 0 && (
              <div className="h-[220px]">
                <BannerItem banner={secondaryBanners[0]} variant="secondary" />
              </div>
            )}
          </div>
        </div>
      </div>

    </section>
  );
};

export default HeroClient;
