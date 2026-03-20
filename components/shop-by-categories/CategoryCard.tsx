import Link from "next/link";
import { Category } from "@/lib/api/types";
import { fullUrl } from "@/lib/api/url-utils";

interface CategoryCardProps {
    category: Category;
}

const CategoryCard = ({ category }: CategoryCardProps) => {
    return (
        <Link
            href={`/category/${category.slug}`}
            className="flex flex-col items-center group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded-2xl"
            aria-label={`${category.name} kateqoriyasına bax`}
        >
            {/* Image box */}
            <div className="w-full aspect-square  rounded-2xl overflow-hidden flex items-center justify-center p-5 transition-shadow duration-300 group-hover:shadow-md">
                <div className="relative w-full h-full flex items-center justify-center">
                    <img
                        src={fullUrl(category.imageUrl)}
                        alt={category.name}
                        onError={(e) => (e.currentTarget.src = "/logos/logo3.svg")}
                        className="max-w-full max-h-full object-contain transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                    />
                </div>
            </div>

            {/* Label */}
            <div className="mt-3 text-center px-1">
                <p className="text-sm font-bold text-gray-900 group-hover:text-blue-600 transition-colors leading-snug">
                    {category.name}
                </p>
                <p className="text-xs text-gray-500 mt-0.5">
                    {category.productCount ?? category.subCategories?.length ?? 0} Məhsul
                </p>
            </div>
        </Link>
    );
};

export default CategoryCard;
