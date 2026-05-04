import HeroSection from "@/components/hero/HeroSection";
import MonthlyDealsSection from "@/components/home/MonthlyDealsSection";
import TechGadgets from "@/components/home/TechGadgets";
import PopularBrands from "@/components/home/PopularBrands";
import ShopByCategories from "@/components/shop-by-categories/ShopByCategories";
import MiddleBanners from "@/components/home/MiddleBanners";
import RecentlyLaunched from "@/components/home/RecentlyLaunched";
import BottomCampaignBanner from "@/components/home/BottomCampaignBanner";

export default function Home() {
  return (
    <main className="w-full flex-1 bg-white flex flex-col items-center">
      <div className="w-full  relative">
        <HeroSection />
        <ShopByCategories />
        <MiddleBanners />
        <MonthlyDealsSection />
        <RecentlyLaunched />
        <BottomCampaignBanner />
        <PopularBrands />
        <TechGadgets />
      </div>
    </main>
  );
}
