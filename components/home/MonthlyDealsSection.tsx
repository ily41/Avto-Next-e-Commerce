// Server Component — no "use client" directive
// Fetches monthly deals data on the server at build/ISR time and passes
// the result down to MonthlyDealsClient (Client Component).

import { fetchRecommendations } from "@/lib/api/server-fetchers";
import MonthlyDealsClient from "./MonthlyDealsClient";

const MonthlyDealsSection = async () => {
  const recommendations = await fetchRecommendations(12);

  const hotDeals = recommendations?.hotDeals ?? [];
  const featuredItems =
    (recommendations?.recentlyAdded ?? []).length > 0
      ? (recommendations?.recentlyAdded ?? [])
      : (recommendations?.basedOnCategory ?? []);

  return (
    <section className="w-full bg-white py-14">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-0">
        <MonthlyDealsClient hotDeals={hotDeals} featuredItems={featuredItems} />
      </div>
    </section>
  );
};

export default MonthlyDealsSection;
