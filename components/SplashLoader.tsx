"use client";

import React, { useState, useEffect } from "react";

export function SplashLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isExpanding, setIsExpanding] = useState(false);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    // Stage 1: Wait 1.5 seconds, then start expanding logo
    const expandTimer = setTimeout(() => {
      setIsExpanding(true);
    }, 1000);

    // Stage 2: Start fading out shortly after expansion starts
    const fadeTimer = setTimeout(() => {
      setIsFading(true);
    }, 1300);

    // Stage 3: Remove from DOM after transition completes
    const removeTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1800);

    return () => {
      clearTimeout(expandTimer);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center bg-white transition-opacity duration-1000 ease-in-out ${isFading ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
    >
      <div className="relative">
        <img
          src="/logos/logo3.svg"
          alt="Logo"
          className={`h-48 w-auto transition-transform duration-1000 cubic-bezier(0.4, 0, 0.2, 1) ${isExpanding ? "scale-[3]" : "scale-100"
            }`}
        />
      </div>
    </div>
  );
}
