"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useGetRecommendationsQuery, Product } from "@/lib/store/products/apislice";
import { IconStarFilled, IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { fullUrl } from "@/lib/utils";
import ProductCard from "@/components/card/ProductCard";

const PLACEHOLDER_IMAGE = "/logos/logo3.svg";

// --- FeaturedItemCard Component (Horizontal layout) ---
const FeaturedItemCard = ({ product }: { product: Product }) => {
    const fullPrimaryUrl = fullUrl(product.primaryImageUrl || product.imageUrl);

    return (
        <div className="bg-white border border-[#f2f2f2] rounded-xl  p-4 flex items-stretch gap-4 h-full transition-all duration-300  cursor-pointer group max-h-[150px] hover:border-blue-100">
            {/* Image on Left */}
            <div className="w-[110px] shrink-0 flex items-center justify-center rounded-lg overflow-hidden transition-colors group-hover:bg-white">
                <img
                    src={fullPrimaryUrl}
                    alt={product.name}
                    onError={(e) => (e.currentTarget.src = PLACEHOLDER_IMAGE)}
                    className="max-h-full max-w-full object-contain transition-transform duration-700 group-hover:scale-110"
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
                        ${product.discountedPrice || product.price}
                    </span>
                    {product.discountedPrice && product.discountedPrice < product.price && (
                        <span className="text-[12px] text-gray-400 line-through">
                            ${product.price}
                        </span>
                    )}
                </div>

                {/* Short Description */}
                <div className="text-[11px] text-[#777] line-clamp-2 leading-normal">
                    {product.shortDescription || "Functional Crown Fhd Footage 1.78\"..."}
                </div>
            </div>
        </div>
    );
};

// --- Sliding Grid Component ---
const SlidingGrid = ({ products, isLoading }: { products: Product[], isLoading: boolean }) => {
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
        if (width < 768) {
            setPageSize(2);
        } else if (width < 1200) {
            setPageSize(4);
        } else {
            setPageSize(6);
        }
    }, []);

    useEffect(() => {
        checkScroll();
        window.addEventListener('resize', checkScroll);
        return () => window.removeEventListener('resize', checkScroll);
    }, [products, checkScroll]);

    const scroll = (dir: "left" | "right") => {
        if (scrollRef.current) {
            const width = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
            setTimeout(checkScroll, 500);
        }
    };

    // Calculate pages based on dynamic pageSize
    const pages = [];
    if (!isLoading && products.length > 0) {
        for (let i = 0; i < products.length; i += pageSize) {
            pages.push(products.slice(i, i + pageSize));
        }
    }

    return (
        <div className="flex flex-col">
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
                className="flex overflow-x-auto no-scrollbar-categories snap-x snap-mandatory"
                onScroll={checkScroll}
            >
                {isLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 grid-rows-2 gap-4 w-full">
                        {[...Array(6)].map((_, i) => (
                            <div key={i} className="h-[140px] bg-gray-50 rounded-xl animate-pulse" />
                        ))}
                    </div>
                ) : (
                    <div className="flex min-w-full">
                        {pages.map((page, pageIdx) => (
                            <div key={pageIdx} className="grid grid-cols-1 md:grid-cols-2  xl:grid-cols-3 grid-rows-2 gap-x-6 gap-y-4 w-full shrink-0 snap-start pr-1">
                                {page.map((product) => (
                                    <FeaturedItemCard key={product.id} product={product} />
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

// --- Hot Deals Slider Component ---
const HotDealsSlider = ({ products, isLoading }: { products: Product[], isLoading: boolean }) => {
    const scrollRef = useRef<HTMLDivElement>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [windowWidth, setWindowWidth] = useState(0);

    useEffect(() => {
        setWindowWidth(window.innerWidth);
        const handleResize = () => setWindowWidth(window.innerWidth);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const step = (windowWidth >= 400 && windowWidth < 768) ? 2 : 1;

    const scroll = (dir: "left" | "right") => {
        if (scrollRef.current) {
            const width = scrollRef.current.clientWidth;
            scrollRef.current.scrollBy({ left: dir === "left" ? -width : width, behavior: "smooth" });
            setCurrentIndex(prev => dir === "left" ? Math.max(0, prev - step) : Math.min(products.length - step, prev + step));
        }
    };

    return (
        <div className="flex flex-col border border-blue-600 rounded-lg px-1">
            <div className="flex items-center justify-between mb-4 pb-2 px-2 pt-2  border-b border-gray-100">
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
                className="flex overflow-hidden snap-x snap-mandatory flex-1"
            >
                {isLoading ? (
                    <div className="w-full h-full bg-gray-50 rounded-xl animate-pulse " />
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="w-full min-[400px]:w-1/2 md:w-full shrink-0 snap-start h-full">
                            <ProductCard product={product} noBorder={true} />
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

// --- Main Section Component ---
const MonthlyDealsSection = () => {
    const { data: recommendations, isLoading } = useGetRecommendationsQuery({ limit: 12 });

    // Fallback products if API doesn't return enough or for specific categories
    const hotDeals = recommendations?.hotDeals || [];
    const featuredItems = (recommendations?.recentlyAdded || []).length > 0
        ? recommendations?.recentlyAdded || []
        : recommendations?.basedOnCategory || [];

    return (
        <section className="w-full bg-white py-14">
            <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
                <div className="flex flex-col md:flex-row items-start gap-10">

                    {/* --- Hot Deals Column (approx. 27%) --- */}
                    <div className="w-full md:w-[23%] shrink-0">
                        <HotDealsSlider products={hotDeals} isLoading={isLoading} />
                    </div>

                    {/* --- Monthly Featured Item Column (approx. 72%) --- */}
                    <div className="w-full md:flex-1">
                        <SlidingGrid products={featuredItems} isLoading={isLoading} />
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

export default MonthlyDealsSection;
