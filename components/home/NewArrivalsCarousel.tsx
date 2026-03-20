"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Product } from "@/lib/api/types";
import ProductCard from "@/components/card/ProductCard";
import SliderArrows from "@/components/ui/SliderArrows";

const SCROLL_AMOUNT = 640;

interface NewArrivalsCarouselProps {
  products: Product[];
}

const NewArrivalsCarousel = ({ products }: NewArrivalsCarouselProps) => {
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
    <div className="relative group/slider mt-6">
      <SliderArrows
        onPrev={() => scroll("left")}
        onNext={() => scroll("right")}
        canPrev={canScrollLeft}
        canNext={canScrollRight}
        top="180px"
        className="max-[1300px]:hidden"
      />

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        role="list"
        className="flex overflow-x-auto scroll-smooth pb-3 snap-x snap-mandatory no-scrollbar-categories"
      >
        {products.map((product) => (
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
  );
};

export default NewArrivalsCarousel;
