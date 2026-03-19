import { Navbar } from "@/components/avto-ui/navbar";
import StoreProvider from "@/lib/providers/store-provider";
import HeroSection from "@/components/hero/HeroSection";
import ShopByCategories from "@/components/shop-by-categories/ShopByCategories";
import RecentlyLaunched from "@/components/home/RecentlyLaunched";
import MiddleBanners from "@/components/home/MiddleBanners";
import MonthlyDealsSection from "@/components/home/MonthlyDealsSection";
import TechGadgets from "@/components/home/TechGadgets";
import PopularBrands from "@/components/home/PopularBrands";

export default function Home() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col items-center bg-white">

        {/* Navbar */}
        <Navbar />

        {/* Homepage Container */}
        <main className="w-full lg:w-[80.3%] flex-1 bg-white flex flex-col relative ">
          <HeroSection />
          <ShopByCategories />
          <MiddleBanners />
          <MonthlyDealsSection />
          <RecentlyLaunched />
          <PopularBrands />
          <TechGadgets />

        </main>

        <div className="h-screen"></div>
      </div>
    </StoreProvider>
  );
}
