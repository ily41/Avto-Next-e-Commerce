// Server Component — no "use client" directive
// Fetches data on the server; passes pre-fetched products to the Client carousel.

import Link from "next/link";
import { fetchRecommendations } from "@/lib/api/server-fetchers";
import NewArrivalsCarousel from "./NewArrivalsCarousel";

const NewArrivals = async () => {
  const recommendations = await fetchRecommendations(12);
  const products = recommendations?.recentlyAdded ?? [];

  return (
    <section
      aria-labelledby="new-arrivals-heading"
      className="w-full bg-white py-10"
    >
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Section header — static, rendered in initial HTML */}
        <div className="flex items-center justify-between mb-2 pb-4 border-b border-gray-100">
          <h2
            id="new-arrivals-heading"
            className="text-xl sm:text-2xl font-bold text-gray-900"
          >
            Yeni Gələnlər
          </h2>
          <Link
            href="/shop"
            className="text-sm font-semibold text-gray-800 hover:text-blue-600 transition-colors flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 rounded"
          >
            Hamısına bax <span aria-hidden="true">→</span>
          </Link>
        </div>

        {/* Client Component handles scroll interactivity only */}
        <NewArrivalsCarousel products={products} />
      </div>
    </section>
  );
};

export default NewArrivals;
