"use client";

import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductsMegaMenu from "./ProductsMegaMenu";
import CategoriesMegaMenu from "./categoriesDropdown/CategoriesMegaMenu";
import TopDealsMegaMenu from "./topDealsDropdown/TopDealsMegaMenu";
import BrandsMegaMenu from "./brandsDropdown/BrandsMegaMenu";

const NavLinks = () => {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const links = [
        { name: "Kateqoriyalar", href: "/categories", label: "ENDİRİM", labelColor: "bg-green-100 text-green-600", hasDropdown: true },
        { name: "Brendlər", href: "/brands", hasDropdown: true },
        { name: "Məhsullar", href: "/shop", label: "QAYNAR", labelColor: "bg-red-100 text-red-600", hasDropdown: true },
        { name: "Top təkliflər", href: "/shop?isHotDeal=true", hasDropdown: true },
    ];

    return (
        <nav className=" h-full flex items-center">
            <ul className="flex items-center gap-6 lg:gap-3 h-full">
                {links.map((link) => (
                    <li
                        key={link.name}
                        className="h-full flex items-center group/navItem"
                        onMouseEnter={() => setHoveredLink(link.name)}
                        onMouseLeave={() => setHoveredLink(null)}
                    >
                        <div className={`flex items-center gap-1.5 py-4 ${link.nonClickable ? "cursor-default" : "cursor-pointer"}`}>
                            {link.nonClickable ? (
                                <span
                                    className={`text-[12px] min-[1150px]:text-[15px] font-medium transition-colors whitespace-nowrap ${hoveredLink === link.name ? "text-blue-600" : "text-gray-700"
                                        }`}
                                >
                                    {link.name}
                                </span>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={`text-[12px] min-[1150px]:text-[15px] font-medium transition-colors whitespace-nowrap ${hoveredLink === link.name ? "text-blue-600" : "text-gray-700"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            )}
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
                        {link.name === "Məhsullar" && (
                            <ProductsMegaMenu 
                                isOpen={hoveredLink === "Məhsullar"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}

                        {/* Mega Menu Dropdown for Categories */}
                        {link.name === "Kateqoriyalar" && (
                            <CategoriesMegaMenu 
                                isOpen={hoveredLink === "Kateqoriyalar"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}
 
                        {/* Mega Menu Dropdown for Brands */}
                        {link.name === "Brendlər" && (
                            <BrandsMegaMenu 
                                isOpen={hoveredLink === "Brendlər"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}

                        {/* Mega Menu Dropdown for Top Deals */}
                        {link.name === "Top təkliflər" && (
                            <TopDealsMegaMenu 
                                isOpen={hoveredLink === "Top təkliflər"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}
                    </li>
                ))}
            </ul>
        </nav>
    );
};

export default NavLinks;

