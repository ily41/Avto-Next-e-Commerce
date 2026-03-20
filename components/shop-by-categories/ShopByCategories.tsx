// Server Component — no "use client" directive
// All data fetching happens on the server; carousel interactivity is delegated
// to CategoryCarousel (Client Component).

import Link from "next/link";
import { fetchCategories } from "@/lib/api/server-fetchers";
import CategoryCarousel from "./CategoryCarousel";

const ShopByCategories = async () => {
  const allCategories = await fetchCategories();
  const activeCategories = allCategories.filter((c) => c.isActive);

  return (
    <section
      aria-labelledby="shop-by-categories-heading"
      className="w-full bg-white py-10"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Section header */}
        <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
          <h2
            id="shop-by-categories-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900"
          >
            Kateqoriyalar üzrə alış-veriş
          </h2>
          <Link
            href="/shop"
            className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            View All <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Carousel — client-side scroll/arrows only */}
        <CategoryCarousel categories={activeCategories} />
      </div>
    </section>
  );
};

export default ShopByCategories;
