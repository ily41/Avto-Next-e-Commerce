import { fetchBanners } from "@/lib/api/server-fetchers";
import BannerItem from "../hero/BannerItem";

const BottomCampaignBanner = async () => {
  // Fetch all banners and filter manually to be safe
  const allBanners = await fetchBanners();
  const banners = allBanners.filter((b) => b.type === 5);
  
  if (!banners || banners.length === 0) {
    return null;
  }

  // Filter for active ones
  const activeBanners = banners.filter((b) => b.isActive);
  if (activeBanners.length === 0) {
    return null;
  }

  const activeBanner = activeBanners.find((b) => b.isCurrentlyActive) || activeBanners[0];

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-[90%] mx-auto sm:px-6 lg:px-0 w-[calc(100%-2.5rem)]">
        <div className="relative w-full aspect-[21/9] md:aspect-[3/1] lg:aspect-[4/1] xl:aspect-[5/1] rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300 bg-gray-50">
          <BannerItem banner={activeBanner} />
        </div>
      </div>
    </section>
  );
};

export default BottomCampaignBanner;
