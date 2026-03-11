"use client";

import Image from "next/image";
import { Banner } from "@/lib/store/banners/apislice";
import { CSSProperties } from "react";
import { API_BASE_URL } from "@/lib/store/api";

interface BannerItemProps {
    banner: Banner;
}

const BannerItem = ({ banner }: BannerItemProps) => {
    const {
        title,
        description,
        buttonText,
        buttonVisible,
        imageUrl,
        mobileImageUrl,
        titlePositionX = 0,
        titlePositionY = 0,
        titleFontSize = 24,
        titleColor = "#000",
        titleAlign = "left",
        descriptionPositionX = 0,
        descriptionPositionY = 0,
        descriptionFontSize = 16,
        descriptionColor = "#333",
        buttonPositionX = 0,
        buttonPositionY = 0,
        buttonColor = "#3b82f6",
        buttonTextColor = "#fff",
        buttonBorderRadius = 8,
    } = banner;

    // Function to scale font size responsively
    const getResponsiveStyle = (baseSize: number): string => {
        // Base size is desktop, scale down for smaller screens using clamp
        const minSize = Math.max(baseSize * 0.6, 12); // Don't go below 12px or 60% of original
        return `clamp(${minSize}px, ${baseSize * 0.08}vw + ${baseSize * 0.5}px, ${baseSize}px)`;
    };

    return (
        <div className="relative w-full h-full overflow-hidden rounded-2xl bg-gray-50 group min-h-[280px] cursor-pointer">
            {/* Background Image */}
            <div className="absolute inset-0 w-full h-full">
                {/* Mobile Image */}
                {mobileImageUrl && (
                    <div className="block sm:hidden absolute inset-0 w-full h-full">
                        <Image
                            src={`${API_BASE_URL}${mobileImageUrl}`}
                            alt={title || "Banner Mobile"}
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                            priority
                            sizes="(max-width: 640px) 100vw, 50vw"
                        />
                    </div>
                )}
                {/* Desktop Image */}
                <div className={`${mobileImageUrl ? "hidden sm:block" : "block"} absolute inset-0 w-full h-full`}>
                    <Image
                        src={`${API_BASE_URL}${imageUrl}` || "/placeholder-banner.jpg"}
                        alt={title || "Banner Desktop"}
                        fill
                        className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        priority
                        sizes="(max-width: 1024px) 100vw, 80vw"
                    />
                </div>
            </div>

            {/* Content Overlay */}
            <div className="absolute inset-0 p-6 md:p-12 pointer-events-none">
                {title && (
                    <h2
                        className="absolute font-bold leading-tight"
                        style={{
                            left: `${titlePositionX}%`,
                            top: `${titlePositionY}%`,
                            fontSize: getResponsiveStyle(titleFontSize),
                            color: titleColor || "#000",
                            textAlign: (titleAlign as any) || "left",
                            maxWidth: "80%",
                        }}
                    >
                        {title}
                    </h2>
                )}

                {description && (
                    <p
                        className="absolute font-medium opacity-90"
                        style={{
                            left: `${descriptionPositionX}%`,
                            top: `${descriptionPositionY}%`,
                            fontSize: getResponsiveStyle(descriptionFontSize),
                            color: descriptionColor || "#333",
                            maxWidth: "70%",
                        }}
                    >
                        {description}
                    </p>
                )}

                {buttonVisible && buttonText && (
                    <button
                        className="absolute pointer-events-auto transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center"
                        style={{
                            left: `${buttonPositionX}%`,
                            top: `${buttonPositionY}%`,
                            backgroundColor: buttonColor || "#3b82f6",
                            color: buttonTextColor || "#fff",
                            borderRadius: `${buttonBorderRadius}px`,
                            padding: "10px 24px",
                            fontSize: "clamp(12px, 1.5vw, 14px)",
                            fontWeight: "600",
                        }}
                    >
                        {buttonText}
                    </button>
                )}
            </div>
        </div>
    );
};

export default BannerItem;
