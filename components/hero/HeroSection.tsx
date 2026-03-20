// Server Component — no "use client" directive
// Fetches all banners on the server and passes them to HeroClient.
// Static layout/skeleton is gone — banner HTML is present in the initial response.

import { fetchBanners } from "@/lib/api/server-fetchers";
import HeroClient from "./HeroClient";

const HeroSection = async () => {
  // Fetch all banners (types 0 and 2) in one server-side call
  const banners = await fetchBanners();

  return <HeroClient banners={banners} />;
};

export default HeroSection;
