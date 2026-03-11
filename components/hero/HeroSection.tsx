"use client";

import { useMemo } from "react";
import { useGetBannersQuery } from "@/lib/store/banners/apislice";
import BannerItem from "./BannerItem";
import CategoryMenu from "./CategoryMenu";
import NavLinks from "./NavLinks";

const HeroSection = () => {
    const { data: banners, isLoading } = useGetBannersQuery();

    const { mainBanner, secondaryBanners } = useMemo(() => {
        if (!banners) return { mainBanner: null, secondaryBanners: [] };

        const activeBanners = banners
            .filter((b) => b.isCurrentlyActive)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

        return {
            mainBanner: activeBanners.find((b) => b.type === 0) || null,
            secondaryBanners: activeBanners.filter((b) => b.type === 1),
        };
    }, [banners]);

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

                    {/* Column 2: Header Row + Main Banner + Secondary Grid */}
                    <div className="flex flex-col">

                        {/* Desktop Row 1: Nav Links Header */}
                        <div className="hidden lg:flex items-center justify-between h-[52px] border-b border-gray-100mb-6 ">
                            <NavLinks />
                            <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                                <span className="text-red-500 text-lg sm:text-xl">%</span>
                                <span className="whitespace-nowrap uppercase tracking-tight text-xs">Super Discount</span>
                            </div>
                        </div>

                        {/* Main Hero & Tablet View */}
                        <div className="flex flex-col gap-6">

                            <div className="flex flex-col lg:flex-row gap-6">
                                {/* Main Banner */}
                                <div className="w-full lg:flex-1 h-[350px] md:h-[450px]">
                                    {mainBanner && <BannerItem banner={mainBanner} />}
                                </div>

                                {/* Tablet Tablet only horizontal scroll banners */}
                                <div className="hidden md:flex lg:hidden w-full overflow-x-auto no-scrollbar gap-4 py-2">
                                    <div className="flex flex-nowrap gap-4 h-[250px]">
                                        {secondaryBanners.map(banner => (
                                            <div key={banner.id} className="w-[300px] shrink-0">
                                                <BannerItem banner={banner} />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Mobile stacked view (Secondary 1 only in mobile below main) */}
                            <div className="flex md:hidden flex-col gap-4">
                                {secondaryBanners.length > 0 && (
                                    <div className="h-[250px]">
                                        <BannerItem banner={secondaryBanners[0]} />
                                    </div>
                                )}
                            </div>

                            {/* Desktop Row 3: Secondary Grid */}
                            <div className="hidden lg:grid grid-cols-3 gap-6">
                                {secondaryBanners.map((banner) => (
                                    <div key={banner.id} className="h-[220px]">
                                        <BannerItem banner={banner} />
                                    </div>
                                ))}
                            </div>

                        </div>
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
