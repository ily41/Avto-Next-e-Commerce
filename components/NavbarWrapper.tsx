"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./avto-ui/navbar";

export function NavbarWrapper() {
  const pathname = usePathname();
  const isDashboardPath = pathname?.startsWith("/dashboard");

  if (isDashboardPath) {
    return null;
  }

  return <Navbar />;
}
