"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useGetRecommendationsQuery } from "@/lib/store/products/apislice";
import ProductCard from "@/components/card/ProductCard";
import SliderArrows from "@/components/ui/SliderArrows";

const SKELETON_COUNT = 4;
const SCROLL_AMOUNT = 640;

const NewArrivals = () => {
    // Fetch recommended/recently added products
    const { data, isLoading } = useGetRecommendationsQuery({ limit: 12 });
    
    const products = data?.recentlyAdded || [];
    const scrollRef = useRef<HTMLDivElement>(null);
    const [canScrollLeft, setCanScrollLeft] = useState(false);
    const [canScrollRight, setCanScrollRight] = useState(false);

    const updateScrollState = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        setCanScrollLeft(el.scrollLeft > 0);
        setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
    }, []);

    useEffect(() => {
        const el = scrollRef.current;
        if (!el) return;
        updateScrollState();
        el.addEventListener("scroll", updateScrollState, { passive: true });
        const ro = new ResizeObserver(updateScrollState);
        ro.observe(el);
        return () => {
            el.removeEventListener("scroll", updateScrollState);
            ro.disconnect();
        };
    }, [products, updateScrollState]);

    const scroll = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({
            left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };

    return (
        <section
            aria-labelledby="new-arrivals-heading"
            className="w-full bg-white py-10"
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
                
                {/* ── Section header ── */}
                <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
                    <h2
                        id="new-arrivals-heading"
                        className="text-xl sm:text-2xl font-bold text-gray-900"
                    >
                        Yeni Gələnlər
                    </h2>
                    <Link
                        href="/shop"
                        className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                    >
                        Hamısına bax <span aria-hidden="true">→</span>
                    </Link>
                </div>

                {/* ── Responsive Slider ── */}
                <div className="relative group/slider mt-6">
                    
                    <SliderArrows 
                        onPrev={() => scroll("left")}
                        onNext={() => scroll("right")}
                        canPrev={canScrollLeft}
                        canNext={canScrollRight}
                        top="180px" // Adjusted for product card height
                        className="max-[1300px]:hidden"
                    />

                    {/* Scrollable track — basis-1/2 on mobile, 1/4 on desktop */}
                    <div
                        ref={scrollRef}
                        role="list"
                        className="flex overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory no-scrollbar-categories"
                    >
                        {isLoading
                            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                  <div
                                      key={i}
                                      role="listitem"
                                      className="shrink-0 basis-1/2 sm:basis-1/4 lg:basis-1/5 snap-start px-2"
                                  >
                                      <div className="w-full aspect-[4/5] bg-gray-50 rounded-xl animate-pulse" />
                                  </div>
                              ))
                            : products.map((product) => (
                                  <div
                                      key={product.id}
                                      role="listitem"
                                      className="shrink-0 basis-1/2 sm:basis-1/4 lg:basis-1/5 snap-start px-2"
                                  >
                                      <ProductCard product={product} />
                                  </div>
                              ))}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewArrivals;
