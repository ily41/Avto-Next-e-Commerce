"use client";

import { useState, useEffect } from "react";
import Cookies from "js-cookie";

export function useAuth() {
  const [isAuth, setIsAuth] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Check for token on mount and when cookie might change
    const checkAuth = () => {
      const token = Cookies.get("token") || (typeof window !== "undefined" ? localStorage.getItem("token") : null);
      setIsAuth(!!token);
      setIsLoading(false);
    };

    checkAuth();

    // Listen for custom auth change events
    window.addEventListener("auth-change", checkAuth);

    // Optional: Add an interval or event listener if needed to detect cookie changes
    // Since js-cookie doesn't have a listener, we can poll or rely on component re-renders
    const interval = setInterval(checkAuth, 1000);

    return () => {
      window.removeEventListener("auth-change", checkAuth);
      clearInterval(interval);
    };
  }, []);

  return { isAuth, isLoading };
}
