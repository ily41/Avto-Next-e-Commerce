"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { Product } from "@/lib/api/types";
import { fullUrl } from "@/lib/api/url-utils";
import ProductCard from "@/components/card/ProductCard";

const PLACEHOLDER_IMAGE = "/logos/logo3.svg";

// --- FeaturedItemCard Component (Horizontal layout) ---
const FeaturedItemCard = ({ product }: { product: Product }) => {
  const fullPrimaryUrl = fullUrl(product.primaryImageUrl || product.imageUrl);

  return (
    <Link 
      href={`/product/${product.slug || product.id}`}
      className="bg-white border border-[#f2f2f2] rounded-xl p-4 flex items-stretch gap-4 h-full transition-all duration-300 cursor-pointer group max-h-[150px] hover:border-blue-100"
    >
      {/* Image on Left */}
      <div className="w-[110px] shrink-0 flex items-center justify-center rounded-lg overflow-hidden transition-colors group-hover:bg-white">
        <img
          src={fullPrimaryUrl}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
          className="max-h-full max-w-full  object-contain transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content on Right */}
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <h4 className="text-[12px] font-bold text-[#1a1a1a] line-clamp-2 leading-tight mb-1.5 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>

        {/* Price */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[16px] font-bold text-[#e52e2e]">
            ₼{(product.discountedPrice || product.price).toFixed(2)}
          </span>
          {product.discountedPrice && product.discountedPrice < product.price && (
            <span className="text-[12px] text-gray-400 line-through">
              ₼{product.price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Short Description */}
        <div className="text-[11px] text-[#777] line-clamp-2 leading-normal">
          {product.shortDescription || 'Functional Crown Fhd Footage 1.78"...'}
        </div>
      </div>
    </Link>
  );
};

// --- Sliding Grid Component ---
const SlidingGrid = ({ products }: { products: Product[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [pageSize, setPageSize] = useState(6);

  const checkScroll = useCallback(() => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 10);
      setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 10);
    }
    const width = window.innerWidth;
    if (width < 768) setPageSize(2);
    else if (width < 1280) setPageSize(4);
    else setPageSize(6);
  }, []);

  useEffect(() => {
    checkScroll();
    window.addEventListener("resize", checkScroll);
    return () => window.removeEventListener("resize", checkScroll);
  }, [products, checkScroll]);

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -width : width,
        behavior: "smooth",
      });
      setTimeout(checkScroll, 500);
    }
  };

  const pages: Product[][] = [];
  for (let i = 0; i < products.length; i += pageSize) {
    pages.push(products.slice(i, i + pageSize));
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
        <h2 className="text-xl font-bold text-[#1a1a1a]">Ayın Seçilmiş Məhsulları</h2>
        <div className="flex">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`py-1 cursor-pointer transition-colors ${canScrollLeft ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`py-1 cursor-pointer transition-colors ${canScrollRight ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronRight size={22} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex flex-1 overflow-x-auto no-scrollbar-categories snap-x snap-mandatory"
        onScroll={checkScroll}
      >
        <div className="flex min-w-full">
          {pages.map((page, pageIdx) => (
            <div
              key={pageIdx}
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 w-full shrink-0 snap-start pr-1"
            >
              {page.map((product) => (
                <FeaturedItemCard key={product.id} product={product} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// --- Hot Deals Slider Component ---
const HotDealsSlider = ({ products }: { products: Product[] }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const step = windowWidth >= 400 && windowWidth < 768 ? 2 : 1;

  const scroll = (dir: "left" | "right") => {
    if (scrollRef.current) {
      const width = scrollRef.current.clientWidth;
      scrollRef.current.scrollBy({
        left: dir === "left" ? -width : width,
        behavior: "smooth",
      });
      setCurrentIndex((prev) =>
        dir === "left"
          ? Math.max(0, prev - step)
          : Math.min(products.length - step, prev + step)
      );
    }
  };

  return (
    <div className="flex flex-col border border-blue-600 rounded-lg px-1">
      <div className="flex items-center justify-between mb-2 pb-2 px-2 pt-2 border-b border-gray-100">
        <h2 className="text-lg font-semibold text-[#1a1a1a]">Qaynar Təkliflər</h2>
        <div className="flex">
          <button
            onClick={() => scroll("left")}
            disabled={currentIndex === 0}
            className={`py-1 cursor-pointer transition-colors ${currentIndex > 0 ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronLeft size={22} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={currentIndex >= products.length - step}
            className={`py-1 cursor-pointer transition-colors ${currentIndex < products.length - step ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronRight size={22} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex overflow-hidden snap-x snap-mandatory"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full min-[400px]:w-1/2 md:w-full shrink-0 snap-start"
          >
            <ProductCard product={product} noBorder={true} />
          </div>
        ))}
      </div>
    </div>
  );
};

// --- Main Client Component ---
interface MonthlyDealsClientProps {
  hotDeals: Product[];
  featuredItems: Product[];
}

const MonthlyDealsClient = ({ hotDeals, featuredItems }: MonthlyDealsClientProps) => {
  return (
    <div className="flex flex-col md:flex-row items-stretch gap-10">
      {/* Hot Deals Column (~27%) */}
      <div className="w-full md:w-[23%] shrink-0">
        <HotDealsSlider products={hotDeals} />
      </div>

      {/* Monthly Featured Item Column (~72%) */}
      <div className="w-full md:flex-1 flex flex-col">
        <SlidingGrid products={featuredItems} />
      </div>
    </div>
  );
};

export default MonthlyDealsClient;
