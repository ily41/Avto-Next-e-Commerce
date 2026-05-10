"use client";

import React, { useState, useRef, useEffect } from "react";
import { fullUrl } from "@/lib/api/url-utils";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface ProductGalleryProps {
  images: { id: string; url: string | undefined }[];
  primaryUrl: string;
}

export default function ProductGallery({ images, primaryUrl }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  
  // Find initial index of primary image
  useEffect(() => {
    const initialIndex = images.findIndex(img => img.url === primaryUrl);
    if (initialIndex !== -1) setActiveIndex(initialIndex);
  }, [primaryUrl, images]);

  const scrollToImage = (index: number) => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const targetScroll = index * container.clientWidth;
      container.scrollTo({ left: targetScroll, behavior: "smooth" });
      setActiveIndex(index);
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const container = scrollRef.current;
      const index = Math.round(container.scrollLeft / container.clientWidth);
      if (index !== activeIndex) {
        setActiveIndex(index);
      }
    }
  };

  const scrollPrev = () => scrollToImage(Math.max(0, activeIndex - 1));
  const scrollNext = () => scrollToImage(Math.min(images.length - 1, activeIndex + 1));

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 relative">
      {/* Main Image Slider Area — This determines the height of the parent */}
      <div className="flex-1 order-1 md:order-2 relative group min-w-0 md:ml-[104px] lg:ml-[124px]">
        {/* Navigation Arrows (Visible on Hover/Touch) */}
        <button 
          onClick={scrollPrev}
          disabled={activeIndex === 0}
          className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
            activeIndex === 0 ? "opacity-0 scale-90 pointer-events-none" : "hover:bg-black group-hover:opacity-100 lg:opacity-0"
          }`}
        >
          <IconChevronLeft size={20} />
        </button>
        
        <button 
          onClick={scrollNext}
          disabled={activeIndex === images.length - 1}
          className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-blue-600 text-white shadow-lg flex items-center justify-center transition-all duration-300 ${
            activeIndex === images.length - 1 ? "opacity-0 scale-90 pointer-events-none" : "hover:bg-black group-hover:opacity-100 lg:opacity-0"
          }`}
        >
          <IconChevronRight size={20} />
        </button>

        {/* The Slider Container */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar aspect-square bg-[#fcfcfc] rounded-2xl border border-gray-100 shadow-inner overflow-hidden"
        >
          {images.map((img, idx) => (
            <div 
              key={img.id} 
              className="min-w-full h-full flex items-center justify-center snap-center p-8 md:p-12"
            >
              <img
                src={fullUrl(img.url || "")}
                className="w-full h-full object-contain select-none"
                alt={`məhsul şəkli ${idx + 1}`}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Progress Dots / Slider Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => scrollToImage(idx)}
              className={`h-1.5 transition-all duration-300 rounded-full ${
                activeIndex === idx ? "w-8 bg-blue-600" : "w-1.5 bg-gray-300"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnails (Vertical on MD+, Horizontal on Mobile) — Absolute on desktop to match main image height */}
      <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 no-scrollbar overflow-x-auto md:overflow-y-auto h-[100px] md:h-full md:absolute md:left-0 md:top-0 md:bottom-0 md:w-[80px] lg:w-[100px] min-h-0 min-w-0">
        {images.map((img, idx) => (
          
          <button
            key={img.id}
            onClick={() => scrollToImage(idx)}
            className={`w-16 h-16 md:w-full  aspect-square rounded-xl border-2 transition-all flex-shrink-0 p-2 flex items-center justify-center bg-white ${
              activeIndex === idx 
                ? "border-white-200 shadow-md scale-105 ring-4 ring-white-50" 
                : "border-gray-100 hover:border-white-200"
            }`}
          >
            <img 
              src={fullUrl(img.url || "")} 
              className="max-h-full max-w-full object-contain" 
              alt={`şəkil ${idx + 1}`} 
            />
          </button>
        ))}
      </div>
    </div>
  );
}
