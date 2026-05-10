"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import type { Product } from "@/lib/api/types";
import { fullUrl } from "@/lib/api/url-utils";
import ProductCard from "@/components/card/ProductCard";
import { calculateBestInstallment } from "@/lib/installmentUtils";


const PLACEHOLDER_IMAGE = "/logos/logo3.svg";

// --- FeaturedItemCard Component (Horizontal layout) ---
const FeaturedItemCard = ({ product }: { product: Product }) => {
  const fullPrimaryUrl = fullUrl(product.primaryImageUrl || product.imageUrl);

  const productPrice = product.discountedPrice || product.price;
  const installment = calculateBestInstallment(productPrice);

  const maxPeriod = installment?.month || 0;
  const availableMonths = installment?.availableMonths || [];
  const monthlyPayment = installment?.monthlyPayment || null;

  return (
    <Link
      href={`/product/${product.slug || product.id}`}
      className="bg-white border border-[#f2f2f2] rounded-xl p-4 flex items-stretch gap-3 h-[224px] transition-all duration-300 cursor-pointer group hover:border-blue-100 shadow-sm"
    >
      {/* Image on Left */}
      <div className="w-[120px] max-[1000px]:w-[85px] shrink-0 flex items-center justify-center rounded-lg overflow-hidden transition-colors group-hover:bg-white text-[10px]">
        <img
          src={fullPrimaryUrl}
          alt={product.name}
          onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
          className="max-h-full max-w-full  object-contain transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content on Right */}
      <div className="flex flex-col flex-1 min-w-0 justify-center">
        <h4 className="text-[12px] font-bold text-[#1a1a1a] line-clamp-2 leading-tight mb-1 group-hover:text-blue-600 transition-colors">
          {product.name}
        </h4>

        {/* Price & Installment */}
        <div className="flex flex-col gap-1 mb-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[16px] font-bold text-[#e52e2e] whitespace-nowrap">
              ₼{(product.discountedPrice || product.price).toFixed(2)}
            </span>
            {product.discountedPrice && product.discountedPrice < product.price && (
              <span className="text-[12px] text-gray-400 line-through whitespace-nowrap">
                ₼{product.price.toFixed(2)}
              </span>
            )}
          </div>

          {monthlyPayment && maxPeriod > 0 && (
            <div className="flex flex-col gap-1">
              <div className="inline-flex items-center">
                <span
                  className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                  style={{ background: "#f5d000", color: "#1a1a1a" }}
                >
                  {monthlyPayment} ₼ x {maxPeriod} ay
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {availableMonths.map((m) => (
                  <span
                    key={m}
                    className="text-[8px] font-black px-1.5 py-0.5 rounded bg-gray-50 text-gray-400 border border-gray-100 uppercase"
                  >
                    {m} ay
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Short Description */}
        <div className="text-[11px] text-[#777] line-clamp-1 leading-normal">
          {product.shortDescription || 'Avto Store-dan təklif...'}
        </div>
      </div>
    </Link>
  );
};

// --- SlidingGrid Component ---
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
      <div className="flex items-center justify-between mb-2 md:mb-4 pb-2 md:pb-4 border-b border-gray-100">
        <h2 className="text-[16px] md:text-xl font-bold text-[#1a1a1a]">Ayın Seçilmiş Məhsulları</h2>
        <div className="flex">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className={`py-1 cursor-pointer transition-colors ${canScrollLeft ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className={`py-1 cursor-pointer transition-colors ${canScrollRight ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronRight size={20} />
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
              className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 grid-rows-2 gap-x-4 md:gap-x-6 gap-y-3 md:gap-y-4 w-full shrink-0 snap-start pr-1"
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
      setTimeout(() => {
          if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            setCurrentIndex(Math.round(scrollLeft / clientWidth) * step);
          }
      }, 500);
    }
  };

  return (
    <div className="flex flex-col border border-blue-600 rounded-lg h-full overflow-hidden">
      <div className="flex items-center justify-between mb-0 pb-2 px-2 pt-2 border-b border-gray-100">
        <h2 className="text-[16px] font-semibold text-[#1a1a1a]">Qaynar təkliflər</h2>
        <div className="flex">
          <button
            onClick={() => scroll("left")}
            disabled={currentIndex === 0}
            className={`py-1 cursor-pointer transition-colors ${currentIndex > 0 ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronLeft size={20} />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={currentIndex >= products.length - step}
            className={`py-1 cursor-pointer transition-colors ${currentIndex < products.length - step ? "text-gray-900 hover:text-blue-600" : "text-gray-300 cursor-not-allowed"}`}
          >
            <IconChevronRight size={20} />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        onScroll={() => {
          if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const index = Math.round(scrollLeft / clientWidth) * step;
            if (index !== currentIndex) setCurrentIndex(index);
          }
        }}
        className="flex flex-1 overflow-x-auto no-scrollbar snap-x snap-mandatory items-stretch"
      >
        {products.map((product) => (
          <div
            key={product.id}
            className="w-full min-[400px]:w-1/2 md:w-full shrink-0 snap-start flex flex-col"
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
    <div className="flex flex-col md:flex-row items-stretch gap-6 md:gap-8 lg:gap-10">
      {/* Hot Deals Column (~30% on md, ~23% on lg) */}
      <div className="w-full md:w-[30%] lg:w-[23%] shrink-0">
        <HotDealsSlider products={hotDeals} />
      </div>

      {/* Monthly Featured Item Column (~72%) */}
      <div className="w-full md:flex-1 flex flex-col mt-4 md:mt-0">
        <SlidingGrid products={featuredItems} />
      </div>
    </div>
  );
};

export default MonthlyDealsClient;
