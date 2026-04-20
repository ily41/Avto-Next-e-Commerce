"use client";

import * as React from "react";
import Image from "next/image";
import { Banner } from "@/lib/api/types";
import { fullUrl } from "@/lib/api/url-utils";

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
        buttonPaddingX = 24,
        buttonPaddingY = 10,
        buttonFontSize = 14,
    } = banner;

    // Function to scale font size responsively
    const getResponsiveStyle = (baseSize: number): string => {
        // Base size is desktop, scale down for smaller screens using clamp
        const minSize = Math.max(baseSize * 0.6, 12); // Don't go below 12px or 60% of original
        return `clamp(${minSize}px, ${baseSize * 0.08}vw + ${baseSize * 0.5}px, ${baseSize}px)`;
    };
    const desktopSrc = fullUrl(imageUrl);
    const mobileSrc = mobileImageUrl ? fullUrl(mobileImageUrl) : desktopSrc;
    const FALLBACK_IMAGE = "/logos/logo3.svg";

    const [src, setSrc] = React.useState(desktopSrc);
    const [mSrc, setMSrc] = React.useState(mobileSrc);

    const finalPaddingX = banner.buttonPaddingX ?? 24;
    const finalPaddingY = banner.buttonPaddingY ?? 10;
    const finalFontSize = banner.buttonFontSize ?? 14;

    return (
        <div className="relative w-full h-full overflow-hidden rounded-lg bg-gray-50 group cursor-pointer">
            <div className="absolute inset-0 w-full h-full">
                {/* Desktop image — hidden on small screens if a mobile version exists */}
                <Image
                    src={src}
                    alt={title || "Banner"}
                    fill
                    priority={variant === "main"}
                    sizes={
                        variant === "main"
                            ? "(max-width: 1024px) 100vw, 1100px"
                            : "(max-width: 768px) 100vw, (max-width: 1280px) 33vw, 360px"
                    }
                    className={`${src === FALLBACK_IMAGE ? "object-contain bg-white p-6 opacity-80" : "object-cover"} ${mSrc !== src ? "hidden sm:block" : ""}`}
                    onError={() => setSrc(FALLBACK_IMAGE)}
                    {...(variant === "main" ? { fetchPriority: "high" } : {})}
                />

                {/* Mobile image — only rendered when a separate mobile URL exists */}
                {mSrc !== src && (
                    <Image
                        src={mSrc}
                        alt={title || "Banner"}
                        fill
                        priority={variant === "main"}
                        sizes="100vw"
                        className={`${mSrc === FALLBACK_IMAGE ? "object-contain bg-white p-4 opacity-80" : "object-cover"} block sm:hidden`}
                        onError={() => setMSrc(FALLBACK_IMAGE)}
                    />
                )}
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
                        className="absolute pointer-events-auto transition-all duration-300 hover:opacity-90 active:scale-95 shadow-md flex items-center justify-center whitespace-nowrap"
                        style={{
                            left: `${buttonPositionX}%`,
                            top: `${buttonPositionY}%`,
                            backgroundColor: buttonColor || "#3b82f6",
                            color: buttonTextColor || "#fff",
                            borderRadius: `${buttonBorderRadius}px`,
                            padding: finalFontSize > 0
                                ? `${finalPaddingY / finalFontSize}em ${finalPaddingX / finalFontSize}em`
                                : `${finalPaddingY}px ${finalPaddingX}px`,
                            fontSize: getResponsiveStyle(finalFontSize),
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
