"use client";

import * as React from "react";
import Link from "next/link";
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
        titleVisible = true,
        description,
        descriptionVisible = true,
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

    // Function to scale font size responsively based on user-defined breakpoints
    const getResponsiveStyle = (baseSize: number): string => {
        // baseSize is the desktop version from backend
        // If it's a secondary banner (subbanner), we decrease the base size slightly from the start
        const adjustedBase = variant === "secondary" ? baseSize * 0.8 : baseSize;
        
        // Reduction rules:
        // Tablet/Desktop: baseSize
        // Under 700px (Tablet-ish): baseSize - 4px (e.g. 19 -> 15)
        // Under 600px: baseSize - 5px (e.g. 19 -> 14)
        // Under 500px: baseSize - 6px (e.g. 19 -> 13)
        // Under 400px: baseSize - 7px (e.g. 19 -> 12)
        
        return `calc(${adjustedBase}px - var(--banner-font-reduction, 0px))`;
    };
    const desktopSrc = fullUrl(imageUrl);
    const mobileSrc = mobileImageUrl ? fullUrl(mobileImageUrl) : desktopSrc;
    const FALLBACK_IMAGE = "/logos/logo3.svg";

    const [src, setSrc] = React.useState(desktopSrc);
    const [mSrc, setMSrc] = React.useState(mobileSrc);

    const finalPaddingX = banner.buttonPaddingX ?? 24;
    const finalPaddingY = banner.buttonPaddingY ?? 10;
    const finalFontSize = banner.buttonFontSize ?? 14;

    const objectFitClass = "object-cover";

    const BannerContent = (
        <div className="relative w-full h-full overflow-hidden rounded-lg group cursor-pointer bg-gray-50">
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
                    className={`${src === FALLBACK_IMAGE ? "object-contain bg-white p-6 opacity-80" : `${objectFitClass} object-center`} ${mSrc !== src ? "hidden sm:block" : ""}`}
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
                        className={`${mSrc === FALLBACK_IMAGE ? "object-contain bg-white p-4 opacity-80" : `${objectFitClass} object-center`} block sm:hidden`}
                        onError={() => setMSrc(FALLBACK_IMAGE)}
                    />
                )}
            </div>

            {/* Content Overlay */}
            <div className={`absolute inset-0 pointer-events-none ${variant === "main" ? "p-6 md:p-12" : "p-4 md:p-6"}`}>
                {titleVisible && title && (
                    <h2
                        className="absolute font-bold leading-tight"
                        style={{
                            left: `${titlePositionX}%`,
                            top: `${titlePositionY}%`,
                            fontSize: getResponsiveStyle(titleFontSize),
                            color: titleColor || "#000",
                            textAlign: (titleAlign as any) || "left",
                            maxWidth: "85%",
                        }}
                    >
                        {title}
                    </h2>
                )}

                {descriptionVisible && description && (
                    <p
                        className="absolute font-medium opacity-90 leading-snug"
                        style={{
                            left: `${descriptionPositionX}%`,
                            top: `${descriptionPositionY}%`,
                            fontSize: getResponsiveStyle(descriptionFontSize),
                            color: descriptionColor || "#333",
                            maxWidth: "80%",
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

    if (banner.linkUrl) {
        return (
            <Link href={banner.linkUrl} className="block w-full h-full">
                {BannerContent}
            </Link>
        );
    }

    return BannerContent;
};

export default BannerItem;
