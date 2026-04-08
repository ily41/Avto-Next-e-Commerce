"use client";

import { usePathname } from "next/navigation";
import Footer from "./avto-ui/footer";

export function FooterWrapper() {
  const pathname = usePathname();
  const isDashboardPath = pathname?.startsWith("/dashboard");

  if (isDashboardPath) {
    return null;
  }

  return <Footer />;
}
