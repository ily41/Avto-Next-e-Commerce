// Server Component — no "use client" directive

import { fetchBanners } from "@/lib/api/server-fetchers";
import BannerItem from "../hero/BannerItem";

const MiddleBanners = async () => {
  // Fetch banners of type 3
  const banners = await fetchBanners(3);

  if (!banners || banners.length === 0) return null;

  // Filter active banners
  const activeBanners = banners
    .filter((b) => b.isCurrentlyActive)
    .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

  return (
    <section className="w-full py-6">
      <div className="max-w-[90%] mx-auto sm:px-6 lg:px-0  w-[calc(100%-2.5rem)]">
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
