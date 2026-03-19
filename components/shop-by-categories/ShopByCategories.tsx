"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import CategoryCard from "./CategoryCard";
import CategoryCardSkeleton from "./CategoryCardSkeleton";
import SliderArrows from "@/components/ui/SliderArrows";

const SKELETON_COUNT = 8;
// How many px to scroll per arrow click
const SCROLL_AMOUNT = 640;

const ShopByCategories = () => {
    const { data: categories, isLoading } = useGetCategoriesQuery();
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
    }, [categories, updateScrollState]);

    const scroll = (dir: "left" | "right") => {
        scrollRef.current?.scrollBy({
            left: dir === "left" ? -SCROLL_AMOUNT : SCROLL_AMOUNT,
            behavior: "smooth",
        });
    };

    const activeCategories = categories?.filter((c) => c.isActive) ?? [];

    return (
        <section
            aria-labelledby="shop-by-categories-heading"
            className="w-full bg-white py-10"
        >
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">

                {/* ── Section header ── */}
                <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
                    <h2
                        id="shop-by-categories-heading"
                        className="text-xl sm:text-2xl font-bold text-gray-900"
                    >
                        Kateqoriyalar üzrə alış-veriş
                    </h2>
                    <Link
                        href="/shop"
                        className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
                    >
                        View All <span aria-hidden="true">→</span>
                    </Link>
                </div>

                {/* ── Responsive Slider ── */}
                <div className="relative group/slider mt-6">

                    <SliderArrows 
                        onPrev={() => scroll("left")}
                        onNext={() => scroll("right")}
                        canPrev={canScrollLeft}
                        canNext={canScrollRight}
                        top="100px"
                        className="max-[1300px]:hidden"
                    />

                    {/* Scrollable track — basis-1/2 on mobile, 1/4 on tablet/small desktop, 1/6 on large desktop */}
                    <div
                        ref={scrollRef}
                        role="list"
                        aria-label="Kateqoriyalar"
                        className="flex overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory no-scrollbar-categories"
                    >
                        {isLoading
                            ? Array.from({ length: SKELETON_COUNT }).map((_, i) => (
                                  <div
                                      key={i}
                                      role="listitem"
                                      className="shrink-0 basis-1/2 sm:basis-1/4 lg:basis-1/6 px-2"
                                  >
                                      <CategoryCardSkeleton />
                                  </div>
                              ))
                            : activeCategories.map((cat) => (
                                  <div
                                      key={cat.id}
                                      role="listitem"
                                      className="shrink-0 basis-1/2 sm:basis-1/4 lg:basis-1/6 snap-start px-2"
                                  >
                                      <CategoryCard category={cat} />
                                  </div>
                              ))}
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .no-scrollbar-categories::-webkit-scrollbar {
                    display: none;
                }
                .no-scrollbar-categories {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>
        </section>
    );
};

export default ShopByCategories;
