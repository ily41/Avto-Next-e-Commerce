"use client";

import React, { useState } from "react";
import { fullUrl } from "@/lib/api/url-utils";

interface ProductGalleryProps {
  images: { id: string; url: string | undefined }[];
  primaryUrl: string;
}

export default function ProductGallery({ images, primaryUrl }: ProductGalleryProps) {
  const [activeImage, setActiveImage] = useState<string>(primaryUrl || "");
  const [zoomPos, setZoomPos] = useState({ x: 0, y: 0, lensX: 0, lensY: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.pageX - left - window.scrollX) / width) * 100;
    const y = ((e.pageY - top - window.scrollY) / height) * 100;

    // Lens position (limiting to stay inside the image)
    const lensSize = 40; // in percent of parent width (approx)
    const lensX = Math.max(0, Math.min(100 - lensSize, x - lensSize / 2));
    const lensY = Math.max(0, Math.min(100 - lensSize, y - lensSize / 2));

    setZoomPos({ x, y, lensX, lensY });
  };

  return (
    <div className="w-full flex flex-col md:flex-row gap-4 relative">
      {/* Thumbnails */}
      <div className="flex flex-row md:flex-col gap-3 order-2 md:order-1 no-scrollbar overflow-x-auto">
        {images.map((img) => (
          <button
            key={img.id}
            onClick={() => setActiveImage(img.url || "")}
            className={`w-16 h-16 md:w-20 md:h-20 rounded-lg border-2 transition-all overflow-hidden bg-gray-50 flex-shrink-0 p-2 flex items-center justify-center ${activeImage === img.url ? "border-blue-600 shadow-md" : "border-transparent hover:border-blue-200"}`}
          >
            <img src={fullUrl(img.url || "")} className="max-h-full max-w-full object-contain" alt="kiçik şəkil" />
          </button>
        ))}
      </div>

      {/* Main image with Lens Zoom */}
      <div className="flex-1 order-1 md:order-2 relative h-fit group">
        <div
          className="relative overflow-hidden cursor-crosshair aspect-square bg-[#fcfcfc] flex items-center justify-center rounded-xl border border-gray-100"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <img
            src={fullUrl(activeImage)}
            className="max-h-full max-w-full object-contain p-8 md:p-12 transition-transform duration-500"
            alt="məhsulun əsas şəkli"
          />

          {/* Magnifier Lens UI */}
          {showZoom && (
            <div
              className="absolute border border-gray-300 pointer-events-none bg-white/30 backdrop-blur-[1px] hidden lg:flex items-center justify-center z-10"
              style={{
                width: '40%',
                height: '40%',
                left: `${zoomPos.lensX}%`,
                top: `${zoomPos.lensY}%`,
              }}
            >
              <div className="w-4 h-4 text-gray-800 opacity-50">+</div>
            </div>
          )}
        </div>

        {/* Zoom Window Panel */}
        {showZoom && (
          <div
            className="absolute left-[105%] top-0 w-[500px] h-[500px] z-[100] border-2 border-gray-100 bg-white rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.12)] hidden lg:block overflow-hidden"
            style={{
              backgroundImage: `url(${fullUrl(activeImage)})`,
              backgroundPosition: `${zoomPos.x}% ${zoomPos.y}%`,
              backgroundSize: '250%',
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>
    </div>
  );
}
