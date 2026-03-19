"use client";

import { useMemo } from "react";
import { useGetBannersQuery } from "@/lib/store/banners/apislice";
import BannerItem from "./BannerItem";
import CategoryMenu from "./CategoryMenu";
import NavLinks from "./NavLinks";
import CategoryMenuSkeleton from "./CategoryMenuSkeleton";

const SkeletonBox = ({ className = "" }: { className?: string }) => (
    <div className={`animate-pulse rounded-xl bg-blue-100 ${className}`} />
);

const HeroSection = () => {
    const { data: banners, isLoading } = useGetBannersQuery();

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

    if (isLoading) {
        return (
            <section className="w-full bg-white pb-10">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">

                    <div className="flex flex-col relative lg:grid lg:grid-cols-[256px_1fr] gap-6">

                        {/* Sidebar skeleton (desktop only) */}
                        <div className="hidden lg:block">
                            <CategoryMenuSkeleton />
                        </div>

                        {/* Main banner area skeleton */}
                        <div className="flex flex-col lg:h-full">
                            {/* Nav links skeleton (desktop) */}
                            <div className="hidden lg:flex shrink-0 items-center gap-6 h-[52px]">
                                {[...Array(5)].map((_, i) => (
                                    <div key={i} className="animate-pulse h-4 w-20 rounded-md bg-blue-100" />
                                ))}
                            </div>

                            {/* Main hero banner skeleton */}
                            <SkeletonBox className="h-[320px] md:h-[442px] lg:flex-1 w-full" />
                        </div>
                    </div>

                    {/* Secondary banners skeleton */}
                    <div className="w-full mt-6 lg:mt-8">
                        {/* Desktop: 3-column grid */}
                        <div className="hidden lg:grid h-[180px] grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonBox key={i} className="h-full w-full" />
                            ))}
                        </div>

                        {/* Tablet: horizontal scroll */}
                        <div className="hidden md:flex lg:hidden gap-4 h-[220px]">
                            {[...Array(3)].map((_, i) => (
                                <SkeletonBox key={i} className="w-[350px] shrink-0 h-full" />
                            ))}
                        </div>

                        {/* Mobile: single banner */}
                        <div className="flex md:hidden">
                            <SkeletonBox className="h-[220px] w-full" />
                        </div>
                    </div>
                </div>
            </section>
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
