"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Category } from "@/lib/api/types";
import CategoryCard from "./CategoryCard";
import SliderArrows from "@/components/ui/SliderArrows";

const SCROLL_AMOUNT = 640;

interface CategoryCarouselProps {
  categories: Category[];
}

const CategoryCarousel = ({ categories }: CategoryCarouselProps) => {
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

  return (
    <div className="relative group/slider mt-6">
      <SliderArrows
        onPrev={() => scroll("left")}
        onNext={() => scroll("right")}
        canPrev={canScrollLeft}
        canNext={canScrollRight}
        top="100px"
        className="max-[1300px]:hidden"
      />

      <div
        ref={scrollRef}
        role="list"
        aria-label="Kateqoriyalar"
        className="flex overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory no-scrollbar-categories"
      >
        {categories.map((cat) => (
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
  );
};

export default CategoryCarousel;
