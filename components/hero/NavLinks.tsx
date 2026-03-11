"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useFilterProductsQuery } from "@/lib/store/products/apislice";
import { useGetCategoriesQuery } from "@/lib/store/categories/apislice";
import ProductCard from "@/components/card/ProductCard";
import { ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";

const NavLinks = () => {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Fetch a few products for the dropdown
    const { data: productData } = useFilterProductsQuery({ pageSize: 8 });
    const products = productData?.products || [];

    // Fetch root categories for the top links in the dropdown
    const { data: categoryData } = useGetCategoriesQuery();
    const topCategories = categoryData?.slice(0, 3) || [];

    const links = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop", hasDropdown: true },
        { name: "Categories", href: "/categories", label: "SALE", labelColor: "bg-green-100 text-green-600", hasDropdown: true },
        { name: "Products", href: "/products", label: "HOT", labelColor: "bg-red-100 text-red-600", hasDropdown: true },
        { name: "Top deals", href: "/top-deals", hasDropdown: true },
    ];

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left'
                ? scrollLeft - clientWidth / 2
                : scrollLeft + clientWidth / 2;

            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    return (
        <nav className=" h-full flex items-center">
            <ul className="flex items-center gap-6 lg:gap-8 h-full">
                {links.map((link) => (
                    <li
                        key={link.name}
                        className="h-full flex items-center group/navItem"
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                        <div className="flex items-center gap-1.5 cursor-pointer py-4">
                            <Link
                                href={link.href}
                                className={`text-[15px] font-medium transition-colors whitespace-nowrap ${hoveredLink === link.name ? "text-blue-600" : "text-gray-700"
                                    }`}
                            >
                                {link.name}
                            </Link>
                            {link.label && (
                                <span className={`text-[9px] font-bold px-1 py-0.5 rounded uppercase leading-none ${link.labelColor}`}>
                                    {link.label}
                                </span>
                            )}
                            {link.hasDropdown && (
                                <ChevronDown
                                    size={14}
                                    className={`transition-transform duration-300 ${hoveredLink === link.name ? "rotate-180 text-blue-600" : "text-gray-400"
                                        }`}
                                />
                            )}
                        </div>

                        {/* Mega Menu Dropdown for Products */}
                        {link.name === "Products" && (
                            <div
                                className={`absolute top-[52px] left-0 max-w-[calc(100vw-48px)] bg-white border border-gray-100 shadow-2xl z-[100] transition-all duration-60 ease-inout p-4 pt-6 rounded-b-2xl origin-bottom ${hoveredLink === "Products"
                                    ? "opacity-100 translate-y-0 pointer-events-auto"
                                    : "opacity-0 translate-y-8 pointer-events-none"
                                    }`}
                                onMouseEnter={() => setHoveredLink("Products")}
                                onMouseLeave={() => setHoveredLink(null)}
                            >
                                {/* Inner Nav within Dropdown */}
                                <div className="flex items-center justify-center gap-6 mb-5 border-b border-gray-50 ">
                                    {topCategories.map((cat, i) => (
                                        <div key={cat.id} className="flex items-center gap-4">
                                            <Link
                                                href={`/category/${cat.slug}`}
                                                className={`text-sm font-semibold transition-colors cursor-pointer ${i === 0 ? "text-blue-600 underline underline-offset-8 decoration-2" : "text-gray-500 hover:text-blue-600"}`}
                                            >
                                                {cat.name}
                                            </Link>
                                            {i < topCategories.length - 1 && <span className="text-gray-200">|</span>}
                                        </div>
                                    ))}
                                </div>

                                {/* Product Slider Container */}
                                <div className="relative group/slider">
                                    <div
                                        ref={scrollRef}
                                        className="flex gap-0 overflow-x-hidden scroll-smooth border-l border-t border-b border-gray-100"
                                    >
                                        {products.length > 0 ? (
                                            products.map((product) => (
                                                <div key={product.id} className="min-w-[25%] border-r border-gray-100">
                                                    <ProductCard product={product} />
                                                </div>
                                            ))
                                        ) : (
                                            <div className="w-full py-20 flex flex-col items-center justify-center bg-gray-50 rounded-xl">
                                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600 mb-4"></div>
                                                <p className="text-sm text-gray-400 font-medium">Fetching active products...</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Navigation Arrows */}
                                    {products.length > 4 && (
                                        <>
                                            <button
                                                onClick={() => scroll('left')}
                                                className="absolute left-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 transition-all hover:bg-blue-600 hover:text-white opacity-0 group-hover/slider:opacity-100 z-50"
                                            >
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button
                                                onClick={() => scroll('right')}
                                                className="absolute right-[-20px] top-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-gray-100 rounded-full shadow-lg flex items-center justify-center text-gray-600 transition-all hover:bg-blue-600 hover:text-white opacity-0 group-hover/slider:opacity-100 z-50"
                                            >
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavLinks;
