// Server Component — no "use client" directive
// Data is fetched on the server; responsive grid handled via CSS classes.

import { fetchBrands } from "@/lib/api/server-fetchers";
import { fullUrl } from "@/lib/api/url-utils";

const PopularBrands = async () => {
  // Fetch 8 brands server-side; CSS grid controls how many are visible per breakpoint
  const brands = await fetchBrands(1, 8);

  return (
    <section className="w-full bg-white py-10">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
        {/* Header */}
        <div className="mb-8 pb-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-[#1a1a1a]">Popular Brands</h2>
        </div>

        {/* Brands Grid — CSS responsive: 2 cols on mobile, 3 on tablet, 4 on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {brands.map((brand, i) => {
            let displayClass = "";
            // Always show first 4 items (Mobile: 4 items).
            // Items 4-5 show above md (md: 6 items).
            if (i >= 4 && i < 6) displayClass = "hidden md:flex";
            // Items 6-7 show above lg (lg+: 8 items).
            else if (i >= 6) displayClass = "hidden lg:flex";

            return (
              <div
                key={brand.id}
                className={`h-24 bg-[#F8F8F8] rounded-xl flex items-center justify-center p-6 grayscale hover:grayscale-0 transition-all duration-300 hover:shadow-md cursor-pointer group ${displayClass}`}
              >
                <img
                  src={fullUrl(brand.logoUrl)}
                  alt={brand.name}
                  className="max-h-full min-h-[90px] max-w-full object-contain opacity-70 group-hover:opacity-100 transition-opacity"
                />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PopularBrands;
