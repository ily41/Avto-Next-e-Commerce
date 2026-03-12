
import Link from "next/link";
import { useState } from "react";
import { ChevronDown } from "lucide-react";
import ProductsMegaMenu from "./ProductsMegaMenu";
import CategoriesMegaMenu from "./categoriesDropdown/CategoriesMegaMenu";
import TopDealsMegaMenu from "./topDealsDropdown/TopDealsMegaMenu";

const NavLinks = () => {
    const [hoveredLink, setHoveredLink] = useState<string | null>(null);

    const links = [
        { name: "Home", href: "/" },
        { name: "Shop", href: "/shop", hasDropdown: true },
        { name: "Categories", href: "/categories", label: "SALE", labelColor: "bg-green-100 text-green-600", hasDropdown: true },
        { name: "Products", href: "/products", label: "HOT", labelColor: "bg-red-100 text-red-600", hasDropdown: true },
        { name: "Top deals", href: "/top-deals", hasDropdown: true },
    ];

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

