"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import type { Banner } from "@/lib/api/types";
import BannerItem from "./BannerItem";
import CategoryMenu from "./CategoryMenu";
import NavLinks from "./NavLinks";
import SliderArrows from "../ui/SliderArrows";

interface HeroClientProps {
  banners: Banner[];
}

const HeroClient = ({ banners }: HeroClientProps) => {
  const { mainBanners, secondaryBanners } = useMemo(() => {
    const activeBanners = banners
      .filter((b) => b.isCurrentlyActive)
      .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0));

    return {
      mainBanners: activeBanners.filter((b) => b.type === 0),
      secondaryBanners: activeBanners.filter((b) => b.type === 2),
    };
  }, [banners]);

  const mainScrollRef = useRef<HTMLDivElement>(null);
  const [mainIndex, setMainIndex] = useState(0);

  const handleMainScroll = () => {
    if (mainScrollRef.current) {
      const { scrollLeft, clientWidth } = mainScrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      if (index !== mainIndex) setMainIndex(index);
    }
  };

  const scrollToMain = (index: number) => {
    if (mainScrollRef.current) {
      const { clientWidth } = mainScrollRef.current;
      mainScrollRef.current.scrollTo({ left: index * clientWidth, behavior: "smooth" });
    }
  };

  // Auto-scroll effect for main banner
  useEffect(() => {
    if (mainBanners.length <= 1) return;
    const interval = setInterval(() => {
      const next = (mainIndex + 1) % mainBanners.length;
      scrollToMain(next);
    }, 6000);
    return () => clearInterval(interval);
  }, [mainBanners, mainIndex]);

  const scrollRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const updateScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanPrev(scrollLeft > 10);
      setCanNext(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      updateScrollButtons();
      el.addEventListener("scroll", updateScrollButtons);
      window.addEventListener("resize", updateScrollButtons);
      return () => {
        el.removeEventListener("scroll", updateScrollButtons);
        window.removeEventListener("resize", updateScrollButtons);
      };
    }
  }, [secondaryBanners]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === "left" ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
    }
  };

  return (
    <section className="w-full bg-white pb-[var(--section-py)] mt-3 md:mt-5">
      <div className="max-w-[80%] mx-auto sm:px-6 lg:px-0 w-[calc(100%-2.5rem)]">
        <div className="flex flex-col relative min-[1000px]:grid min-[1000px]:grid-cols-[280px_auto] lg:grid-cols-[306px_auto] mb-4 md:mb-3 gap-3 md:gap-4 xl:gap-6 min-[1000px]:h-[clamp(300px,40vw,700px)]">
          <div className="hidden min-[1000px]:flex min-[1000px]:flex-col h-full min-h-0 relative z-30">
            <CategoryMenu />
          </div>

          <div className="flex flex-col min-[1000px]:h-full min-h-0">
            <div className="hidden lg:flex shrink-0 items-center justify-between h-[64px]">
              <NavLinks />
              <div className="hidden xl:flex items-center gap-2 text-gray-800 font-bold text-[13px] uppercase tracking-wider">
                <span className="w-6 h-6 bg-red-600 text-white flex items-center justify-center rounded-full text-[12px] font-bold">
                  %
                </span>
                Super Endirim
              </div>
            </div>

            <div className="flex-1 min-h-0 relative h-[180px] xs:h-[220px] sm:h-[400px] min-[1000px]:h-full aspect-[1.45/1] min-[1000px]:aspect-auto group/main-slider">
              <div
                ref={mainScrollRef}
                onScroll={handleMainScroll}
                className="w-full h-full flex overflow-x-auto snap-x snap-mandatory no-scrollbar rounded-xl overflow-hidden shadow-sm border border-gray-100/50"
              >
                {mainBanners.map((banner) => (
                  <div key={banner.id} className="min-w-full h-full snap-center relative">
                    <BannerItem banner={banner} />
                  </div>
                ))}
              </div>

              {mainBanners.length > 1 && (
                <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 md:gap-3 z-20">
                  {mainBanners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => scrollToMain(idx)}
                      className={`transition-all duration-300 rounded-full ${
                        mainIndex === idx
                          ? "w-6 md:w-8 h-1.5 md:h-2 bg-blue-600 shadow-lg shadow-blue-500/30"
                          : "w-1.5 md:w-2 h-1.5 md:h-2 bg-white/60 hover:bg-white border border-black/5"
                      }`}
                      aria-label={`Slayd ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="w-full mt-4 md:mt-8 sm:mt-6 lg:mt-8 relative group/slider">
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-3 md:gap-4 xl:gap-6 no-scrollbar snap-x snap-mandatory"
          >
            {secondaryBanners.map((banner) => (
              <div
                key={banner.id}
                className="flex-shrink-0 w-[85%] min-[1000px]:w-[calc((100%-2rem)/3)] lg:w-[calc((100%-3rem)/3)] snap-start h-[120px] xs:h-[150px] md:h-[clamp(150px,15vw,220px)] relative"
              >
                <BannerItem banner={banner} variant="secondary" />
              </div>
            ))}
          </div>

          {(secondaryBanners.length > 3 ||
            (typeof window !== "undefined" && window.innerWidth < 1000 && secondaryBanners.length > 1)) && (
            <SliderArrows
              onPrev={() => scroll("left")}
              onNext={() => scroll("right")}
              canPrev={canPrev}
              canNext={canNext}
              variant="blue"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default HeroClient;
