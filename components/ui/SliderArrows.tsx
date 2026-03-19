"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface SliderArrowsProps {
    onPrev: () => void;
    onNext: () => void;
    canPrev: boolean;
    canNext: boolean;
    variant?: "default" | "blue";
    top?: string; // custom top position
    className?: string; // custom container class
}

const SliderArrows = ({
    onPrev,
    onNext,
    canPrev,
    canNext,
    variant = "blue",
    top = "50%",
    className = ""
}: SliderArrowsProps) => {
    const baseClasses = "absolute -translate-y-1/2 z-20 w-8 h-8 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 opacity-0 group-hover/slider:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2";

    const colorClasses = variant === "blue"
        ? "bg-blue-600 text-white hover:bg-gray-900 focus:ring-blue-600"
        : "bg-white text-gray-900 hover:bg-blue-600 hover:text-white border border-gray-100 focus:ring-gray-900";

    return (
        <div className={`contents ${className}`}>
            {/* Left arrow */}
            <button
                aria-label="Previous slide"
                onClick={onPrev}
                disabled={!canPrev}
                style={{ top }}
                className={`${baseClasses} ${colorClasses} left-0 -translate-x-5 ${!canPrev ? "!opacity-0 pointer-events-none" : ""}`}
            >
                <ChevronLeft size={20} />
            </button>

            {/* Right arrow */}
            <button
                aria-label="Next slide"
                onClick={onNext}
                disabled={!canNext}
                style={{ top }}
                className={`${baseClasses} ${colorClasses} right-0 translate-x-5 ${!canNext ? "!opacity-0 pointer-events-none" : ""}`}
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );
};

export default SliderArrows;
