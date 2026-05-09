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

    interface NavLink {
        name: string;
        href: string;
        label?: string;
        labelColor?: string;
        hasDropdown?: boolean;
        nonClickable?: boolean;
    }

    const links: NavLink[] = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop", hasDropdown: true },
        { name: "Categories", href: "/categories", label: "SALE", labelColor: "bg-green-50 text-green-500", hasDropdown: true },
        { name: "Products", href: "/shop", label: "HOT", labelColor: "bg-red-50 text-red-500", hasDropdown: true },
        { name: "Top deals", href: "/shop?isHotDeal=true", hasDropdown: true },
        { name: "Elements", href: "#", hasDropdown: true },
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
                                    className={`text-[12px] min-[1150px]:text-[14px] font-bold transition-colors whitespace-nowrap ${link.name === "Home" || hoveredLink === link.name ? "text-blue-600" : "text-gray-800"
                                        }`}
                                >
                                    {link.name}
                                </span>
                            ) : (
                                <Link
                                    href={link.href}
                                    className={`text-[12px] min-[1150px]:text-[14px] font-bold transition-colors whitespace-nowrap ${link.name === "Home" || hoveredLink === link.name ? "text-blue-600" : "text-gray-800"
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            )}
                            {link.label && (
                                <span className={`text-[8px] font-bold px-1 py-0.5 rounded uppercase leading-none border ${link.labelColor} ${link.label === "SALE" ? "border-green-200" : "border-red-200"}`}>
                                    {link.label}
                                </span>
                            )}
                            {link.hasDropdown && (
                                <ChevronDown
                                    size={12}
                                    className={`transition-transform duration-300 ${hoveredLink === link.name ? "rotate-180 text-blue-600" : "text-gray-400"
                                        }`}
                                />
                            )}
                        </div>

                        {/* Mega Menu Dropdown for Products */}
                        {link.name === "Products" && (
                            <ProductsMegaMenu 
                                isOpen={hoveredLink === "Products"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}

                        {/* Mega Menu Dropdown for Categories */}
                        {link.name === "Categories" && (
                            <CategoriesMegaMenu 
                                isOpen={hoveredLink === "Categories"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}
 
                        {/* Mega Menu Dropdown for Brands */}
                        {link.name === "Brands" && (
                            <BrandsMegaMenu 
                                isOpen={hoveredLink === "Brands"} 
                                setHoveredLink={setHoveredLink} 
                            />
                        )}

                        {/* Mega Menu Dropdown for Top Deals */}
                        {link.name === "Top deals" && (
                            <TopDealsMegaMenu 
                                isOpen={hoveredLink === "Top deals"} 
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

