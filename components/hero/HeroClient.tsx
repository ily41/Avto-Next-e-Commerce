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
    <section className="w-full bg-white pb-10 mt-5">
      {/* Spacing-first responsiveness: padding reduces at smaller breakpoints, mx-auto only at 2xl */}
      <div className="w-full   2xl:px-0 2xl:max-w-[90%] 2xl:mx-auto">
        {/* Height uses clamp so it shrinks proportionally with viewport width */}
        <div className="flex flex-col relative lg:grid lg:grid-cols-[306px_auto] mb-3 lg:mb-20 lg:justify-center gap-4 xl:gap-6 lg:[height:clamp(100px,40vw,700px)]">
          {/* Column 1: Vertical Sidebar (Desktop only) — matches banner height */}
          <div className="hidden lg:flex lg:flex-col h-full min-h-0 relative z-30">
            <CategoryMenu />
          </div>

          {/* Column 2: Header Row + Main Banner */}
          <div className="flex flex-col h-full ">
            {/* Desktop Row 1: Nav Links Header */}
            <div className="hidden lg:flex shrink-0 items-center justify-between h-[52px]">
              <NavLinks />
            </div>

            {/* Main Hero — takes remaining height and follows aspect ratio to avoid empty space */}
            <div className="flex-1 min-h-0 relative h-full  aspect-[1.45/1]">
              {mainBanner && <BannerItem banner={mainBanner} />}
            </div>
          </div>
        </div>

        {/* Bottom Block: Secondary Banners */}
        <div className="w-full mt-6 lg:mt-8">
          {/* Desktop: Grid of 3 */}
          <div className=" max-w-[90%] mx-auto sm:px-6 lg:px-0  w-[calc(100%-2.5rem)] hidden lg:grid grid-cols-3 gap-4 xl:gap-6 [height:clamp(120px,13vw,180px)]">
            {secondaryBanners.slice(0, 3).map((banner) => (
                <div key={banner.id} className="h-full relative">
                  <BannerItem banner={banner} variant="secondary" />
                </div>
              ))}
          </div>

          {/* Tablet & Mobile: Only the first one (when sidebar disappears) */}
          <div className="flex lg:hidden flex-col">
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
