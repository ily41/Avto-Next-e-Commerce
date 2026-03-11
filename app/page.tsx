import { Navbar } from "@/components/avto-ui/navbar";
import StoreProvider from "@/lib/providers/store-provider";
import HeroSection from "@/components/hero/HeroSection";

export default function Home() {
  return (
    <StoreProvider>
      <div className="min-h-screen flex flex-col items-center bg-white">

        {/* Navbar */}
        <Navbar />

        {/* Homepage Container */}
        <main className="w-full lg:w-[80.3%] flex-1 bg-white border-x border-gray-100 flex flex-col relative overflow-hidden">
          <HeroSection />
        </main>
      </div>
    </StoreProvider>
  );
}
