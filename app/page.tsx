import HeroSection from "@/components/hero/HeroSection";
import MonthlyDealsSection from "@/components/home/MonthlyDealsSection";
import TechGadgets from "@/components/home/TechGadgets";
import PopularBrands from "@/components/home/PopularBrands";
import ShopByCategories from "@/components/shop-by-categories/ShopByCategories";
import MiddleBanners from "@/components/home/MiddleBanners";
import RecentlyLaunched from "@/components/home/RecentlyLaunched";

export default function Home() {
  return (
    <main className="w-full flex-1 bg-white flex flex-col items-center">
      <div className="w-full lg:w-[80.3%] relative">
        <HeroSection />
        <ShopByCategories />
        <MiddleBanners />
        <MonthlyDealsSection />
        <RecentlyLaunched />
        <PopularBrands />
        <TechGadgets />
      </div>
      <div className="h-[30vh]"></div>
    </main>
  );
}
