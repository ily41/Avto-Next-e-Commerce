"use client";

import { useGetBannersQuery } from "@/lib/store/banners/apislice";
import BannerItem from "../hero/BannerItem";

const MiddleBanners = () => {
    const { data: banners, isLoading } = useGetBannersQuery({ type: 3 });

    if (isLoading) {
        return (
            <section className="w-full py-6">
                <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="w-full h-[180px] sm:h-[220px] bg-gray-100 animate-pulse rounded-xl" />
                    <div className="w-full h-[180px] sm:h-[220px] bg-gray-100 animate-pulse rounded-xl" />
                </div>
            </section>
        );
    }

    if (!banners || banners.length === 0) return null;

    // Filter active banners
    const activeBanners = banners
        .filter((b) => b.isCurrentlyActive)
        .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return (
        <section className="w-full py-6">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0 ">
                {/* Desktop and Tablet: Side by side (2 columns) */}
                <div className="hidden sm:grid grid-cols-2 gap-4 lg:gap-6">
                    {activeBanners.slice(0, 2).map((banner) => (
                        <div key={banner.id} className="h-[220px] relative">
                            <BannerItem banner={banner} variant="secondary" />
                        </div>
                    ))}
                </div>

                {/* Mobile: Stacked vertically */}
                <div className="flex sm:hidden flex-col gap-4">
                    {activeBanners.slice(0, 2).map((banner) => (
                        <div key={banner.id} className="h-[180px] relative">
                            <BannerItem banner={banner} variant="secondary" />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default MiddleBanners;
