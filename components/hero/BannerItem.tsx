"use client";

import Image from "next/image";
import { Banner } from "@/lib/store/banners/apislice";
import { fullUrl } from "@/lib/utils";

interface BannerItemProps {
    banner: Banner;
    variant?: "main" | "secondary";
}

const BannerItem = ({ banner, variant = "main" }: BannerItemProps) => {
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
    const finalSrc = fullUrl((mobileImageUrl && typeof window !== 'undefined' && window.innerWidth < 640)
        ? mobileImageUrl
        : imageUrl);

    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-50 group cursor-pointer">
            <div className="absolute inset-0 w-full h-full">
            <Image
                src={finalSrc} 
                alt={title || "Banner"}
                fill
                priority={variant === "main"}
                sizes={
                    variant === "main"
                        ? "(max-width: 1024px) 100vw, 1100px" 
                        : "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px" 
                }
                className="object-cover"
                {...(variant === "main" ? { fetchPriority: "high" } : {})}
            />

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
