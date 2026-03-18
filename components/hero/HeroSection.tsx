"use client";

import { useMemo } from "react";
import { useGetBannersQuery } from "@/lib/store/banners/apislice";
import BannerItem from "./BannerItem";
import CategoryMenu from "./CategoryMenu";
import NavLinks from "./NavLinks";

const HeroSection = () => {
    const { data: banners, isLoading } = useGetBannersQuery();
    console.log(banners);

    const { mainBanner, secondaryBanners } = useMemo(() => {
        if (!banners) return { mainBanner: null, secondaryBanners: [] };

        const activeBanners = banners
            .filter((b) => b.isCurrentlyActive)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        return {
            mainBanner: activeBanners.find((b) => b.type === 0) || null,
            secondaryBanners: activeBanners.filter((b) => b.type === 2),
        };
    }, [banners]);

    console.log()

    if (isLoading) {
        return (
            <div className="w-full max-w-[1440px] mx-auto px-4 py-12 flex justify-center items-center h-[500px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <section className="w-full bg-white pb-10">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 ">

                <div className="flex flex-col relative lg:grid lg:grid-cols-[256px_1fr] gap-6">

                    {/* Column 1: Vertical Sidebar (Desktop only) */}
                    <div className="hidden lg:block">
                        <CategoryMenu />
                    </div>

                    {/* Column 2: Header Row + Main Banner */}
                    <div className="flex flex-col lg:h-full">

                        {/* Desktop Row 1: Nav Links Header */}
                        <div className="hidden lg:flex shrink-0 items-center justify-between h-[52px] ">
                            <NavLinks />
                            {/* <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <span className="text-red-500 text-lg sm:text-xl">%</span>
                                <span className="whitespace-nowrap uppercase tracking-tight text-xs">Super Endirim</span>
                            </div> */}
                        </div>

                        {/* Main Hero */}
                        <div className="h-[320px] md:h-[442px] lg:flex-1 lg:h-full relative">
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
                                <BannerItem banner={banner} />
                            </div>
                        ))}
                    </div>

                    {/* Tablet: Horizontal scroll */}
                    <div className="hidden md:flex lg:hidden w-full overflow-x-auto no-scrollbar pb-2">
                        <div className="flex flex-nowrap gap-4 h-[220px]">
                            {secondaryBanners.map((banner) => (
                                <div key={banner.id} className="w-[350px] shrink-0 h-full relative">
                                    <BannerItem banner={banner} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mobile: Only the first one */}
                    <div className="flex md:hidden flex-col">
                        {secondaryBanners.length > 0 && (
                            <div className="h-[220px]">
                                <BannerItem banner={secondaryBanners[0]} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
        </section>
    );
};

export default HeroSection;
