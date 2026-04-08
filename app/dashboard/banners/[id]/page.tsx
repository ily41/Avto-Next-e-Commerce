"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useGetBannerByIdQuery, useUpdateBannerMutation } from "@/lib/store/banners/apislice";
import { DndContext, useDraggable, DragEndEvent, Modifier } from "@dnd-kit/core";
import { restrictToParentElement } from "@dnd-kit/modifiers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

function DraggableItem({ id, x, y, children }: { id: string; x: number; y: number; children: React.ReactNode }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id,
    });

    const style = {
        position: "absolute" as const,
        left: `${x}px`,
        top: `${y}px`,
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        zIndex: transform ? 50 : 10,
        cursor: "grab",
    };

    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className="hover:ring-2 hover:ring-primary/50 rounded-md p-1 border border-transparent hover:border-dashed hover:border-primary transition-colors">
            {children}
        </div>
    );
}

export default function BannerDesignPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const { data: banner, isLoading } = useGetBannerByIdQuery(id);
    console.log(banner)
    const [updateBanner, { isLoading: isUpdating }] = useUpdateBannerMutation();
    const containerRef = useRef<HTMLDivElement>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    const [positions, setPositions] = useState({
        title: { x: 0, y: 0 },
        description: { x: 0, y: 0 },
        button: { x: 0, y: 0 },
    });

    const [styles, setStyles] = useState({
        titleFontSize: 24,
        titleColor: "#ffffff",
        titleAlign: "left",
        descriptionFontSize: 16,
        descriptionColor: "#ffffff",
        buttonColor: "#000000",
        buttonTextColor: "#ffffff",
        buttonBorderRadius: 4,
        buttonPaddingX: 24,
        buttonPaddingY: 8,
        buttonFontSize: 14,
    });

    useEffect(() => {
        if (banner && containerRef.current && !isInitialized) {
            const containerWidth = containerRef.current.offsetWidth;
            const containerHeight = containerRef.current.offsetHeight;

            if (containerWidth > 0) {
                setPositions({
                    title: {
                        x: (banner.titlePositionX !== undefined ? (banner.titlePositionX / 100) * containerWidth : 20),
                        y: (banner.titlePositionY !== undefined ? (banner.titlePositionY / 100) * containerHeight : 20)
                    },
                    description: {
                        x: (banner.descriptionPositionX !== undefined ? (banner.descriptionPositionX / 100) * containerWidth : 20),
                        y: (banner.descriptionPositionY !== undefined ? (banner.descriptionPositionY / 100) * containerHeight : 80)
                    },
                    button: {
                        x: (banner.buttonPositionX !== undefined ? (banner.buttonPositionX / 100) * containerWidth : 20),
                        y: (banner.buttonPositionY !== undefined ? (banner.buttonPositionY / 100) * containerHeight : 140)
                    },
                });
                setStyles({
                    titleFontSize: banner.titleFontSize || 24,
                    titleColor: banner.titleColor || "#ffffff",
                    titleAlign: banner.titleAlign || "left",
                    descriptionFontSize: banner.descriptionFontSize || 16,
                    descriptionColor: banner.descriptionColor || "#ffffff",
                    buttonColor: banner.buttonColor || "#000000",
                    buttonTextColor: banner.buttonTextColor || "#ffffff",
                    buttonBorderRadius: banner.buttonBorderRadius || 4,
                    buttonPaddingX: banner.buttonPaddingX || 24,
                    buttonPaddingY: banner.buttonPaddingY || 8,
                    buttonFontSize: banner.buttonFontSize || 14,
                });
                setIsInitialized(true);
            }
        }
    }, [banner, isInitialized]);

    const snapModifier: Modifier = ({ transform, active }) => {
        if (!active || !transform) return transform;

        const SNAP_THRESHOLD = 10;
        const activeId = active.id as keyof typeof positions;
        const startX = positions[activeId]?.x || 0;
        const startY = positions[activeId]?.y || 0;

        const currentX = startX + transform.x;
        const currentY = startY + transform.y;

        let newTransformX = transform.x;
        let newTransformY = transform.y;

        Object.keys(positions).forEach((key) => {
            if (key === activeId) return;
            const target = positions[key as keyof typeof positions];

            // Snap X (Left borders align)
            if (Math.abs(currentX - target.x) < SNAP_THRESHOLD) {
                newTransformX = target.x - startX;
            }
            // Snap Y (Top borders align)
            if (Math.abs(currentY - target.y) < SNAP_THRESHOLD) {
                newTransformY = target.y - startY;
            }
        });

        return {
            ...transform,
            x: newTransformX,
            y: newTransformY,
        };
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, delta } = event;
        if (!delta.x && !delta.y) return;
        const id = active.id as string;

        setPositions((prev) => ({
            ...prev,
            [id]: {
                x: Math.max(0, prev[id as keyof typeof prev].x + delta.x),
                y: Math.max(0, prev[id as keyof typeof prev].y + delta.y),
            },
        }));
    };

    const handleSave = async () => {
        if (!banner || !containerRef.current) return;

        const containerWidth = containerRef.current.offsetWidth;
        const containerHeight = containerRef.current.offsetHeight;

        try {
            await updateBanner({
                id: banner.id,
                data: {
                    ...banner,
                    titlePositionX: Math.round((positions.title.x / containerWidth) * 100),
                    titlePositionY: Math.round((positions.title.y / containerHeight) * 100),
                    titleFontSize: styles.titleFontSize,
                    titleColor: styles.titleColor,
                    titleAlign: styles.titleAlign,
                    descriptionPositionX: Math.round((positions.description.x / containerWidth) * 100),
                    descriptionPositionY: Math.round((positions.description.y / containerHeight) * 100),
                    descriptionFontSize: styles.descriptionFontSize,
                    descriptionColor: styles.descriptionColor,
                    buttonPositionX: Math.round((positions.button.x / containerWidth) * 100),
                    buttonPositionY: Math.round((positions.button.y / containerHeight) * 100),
                    buttonColor: styles.buttonColor,
                    buttonTextColor: styles.buttonTextColor,
                    buttonBorderRadius: styles.buttonBorderRadius,
                    buttonPaddingX: styles.buttonPaddingX,
                    buttonPaddingY: styles.buttonPaddingY,
                    buttonFontSize: styles.buttonFontSize,
                },
            }).unwrap();
            toast.success("Banner aesthetics updated successfully!");
        } catch (err) {
            toast.error("Failed to update banner.");
        }
    };

    if (isLoading || !banner) {
        return (
            <div className="flex items-center justify-center p-20 h-full">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
        );
    }

    const bannerBackground = banner.imageUrl
        ? `url(https://avtoo027-001-site1.ntempurl.com${banner.imageUrl})`
        : "linear-gradient(135deg, #4f46e5, #0ea5e9)";

    return (
        <div className="flex flex-col gap-6 py-4 md:py-6 px-4 md:px-8 h-full overflow-y-auto">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" onClick={() => router.push("/dashboard/banners")}>
                        <ArrowLeft className="w-4 h-4" />
                    </Button>
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold">Manage Design: {banner.title || "Untitled"}</h1>
                        <p className="text-sm text-muted-foreground">Drag elements to position them, and tweak styles using the sidebar.</p>
                    </div>
                </div>
                <Button onClick={handleSave} disabled={isUpdating} className="gap-2">
                    {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Design
                </Button>
            </div>

            <div className="flex flex-col xl:flex-row gap-6 items-start h-full">
                {/* Visual Editor */}
                <div className="flex-1 w-full bg-slate-100 dark:bg-slate-900 rounded-2xl border p-4 shadow-inner flex flex-col items-center justify-start overflow-hidden min-h-[500px]">
                    <DndContext onDragEnd={handleDragEnd} modifiers={[restrictToParentElement, snapModifier]}>
                        <div
                            ref={containerRef}
                            className="relative w-full max-w-4xl aspect-[21/9] rounded-xl shadow-xl overflow-hidden"
                            style={{
                                backgroundImage: bannerBackground,
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        >
                            {/* Draggable Title */}
                            {banner.titleVisible && banner.title && (
                                <DraggableItem id="title" x={positions.title.x} y={positions.title.y}>
                                    <h2
                                        className="font-bold leading-tight drop-shadow-md select-none"
                                        style={{
                                            color: styles.titleColor,
                                            fontSize: `${styles.titleFontSize}px`,
                                            textAlign: styles.titleAlign as any,
                                            width: "max-content",
                                            maxWidth: "600px"
                                        }}
                                    >
                                        {banner.title}
                                    </h2>
                                </DraggableItem>
                            )}

                            {/* Draggable Description */}
                            {banner.descriptionVisible && banner.description && (
                                <DraggableItem id="description" x={positions.description.x} y={positions.description.y}>
                                    <p
                                        className="drop-shadow-sm select-none"
                                        style={{
                                            color: styles.descriptionColor,
                                            fontSize: `${styles.descriptionFontSize}px`,
                                            width: "max-content",
                                            maxWidth: "500px",
                                            whiteSpace: "pre-wrap"
                                        }}
                                    >
                                        {banner.description}
                                    </p>
                                </DraggableItem>
                            )}

                            {/* Draggable Button */}
                            {banner.buttonVisible && banner.buttonText && (
                                <DraggableItem id="button" x={positions.button.x} y={positions.button.y}>
                                    <button
                                        className="font-semibold shadow-md focus:outline-none select-none"
                                        style={{
                                            backgroundColor: styles.buttonColor,
                                            color: styles.buttonTextColor,
                                            borderRadius: `${styles.buttonBorderRadius}px`,
                                            padding: `${styles.buttonPaddingY}px ${styles.buttonPaddingX}px`,
                                            fontSize: `${styles.buttonFontSize}px`,
                                        }}
                                        onClick={(e) => e.preventDefault()}
                                    >
                                        {banner.buttonText}
                                    </button>
                                </DraggableItem>
                            )}
                        </div>
                    </DndContext>
                </div>

                {/* Properties Sidebar */}
                <div className="w-full xl:w-80 bg-card rounded-2xl border shadow-sm flex flex-col gap-6 p-6">
                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Title Styles</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={styles.titleColor} onChange={e => setStyles(s => ({ ...s, titleColor: e.target.value }))} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Alignment</Label>
                                <Select value={styles.titleAlign} onValueChange={v => setStyles(s => ({ ...s, titleAlign: v }))}>
                                    <SelectTrigger><SelectValue /></SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label>Font Size ({styles.titleFontSize}px)</Label>
                            <Slider value={[styles.titleFontSize]} min={12} max={72} step={1} onValueChange={(val) => setStyles(s => ({ ...s, titleFontSize: val[0] }))} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Description Styles</h3>
                        <div className="space-y-1">
                            <Label>Color</Label>
                            <div className="flex gap-2">
                                <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={styles.descriptionColor} onChange={e => setStyles(s => ({ ...s, descriptionColor: e.target.value }))} />
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label>Font Size ({styles.descriptionFontSize}px)</Label>
                            <Slider value={[styles.descriptionFontSize]} min={10} max={48} step={1} onValueChange={(val) => setStyles(s => ({ ...s, descriptionFontSize: val[0] }))} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="font-semibold text-lg border-b pb-2">Button Styles</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label>BG Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={styles.buttonColor} onChange={e => setStyles(s => ({ ...s, buttonColor: e.target.value }))} />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <Label>Text Color</Label>
                                <div className="flex gap-2">
                                    <Input type="color" className="w-10 h-10 p-1 cursor-pointer" value={styles.buttonTextColor} onChange={e => setStyles(s => ({ ...s, buttonTextColor: e.target.value }))} />
                                </div>
                            </div>
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label>Corner Radius ({styles.buttonBorderRadius}px)</Label>
                            <Slider value={[styles.buttonBorderRadius]} min={0} max={40} step={1} onValueChange={(val) => setStyles(s => ({ ...s, buttonBorderRadius: val[0] }))} />
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label>Font Size ({styles.buttonFontSize}px)</Label>
                            <Slider value={[styles.buttonFontSize]} min={10} max={48} step={1} onValueChange={(val) => setStyles(s => ({ ...s, buttonFontSize: val[0] }))} />
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label>Horizontal Padding ({styles.buttonPaddingX}px)</Label>
                            <Slider value={[styles.buttonPaddingX]} min={0} max={100} step={1} onValueChange={(val) => setStyles(s => ({ ...s, buttonPaddingX: val[0] }))} />
                        </div>
                        <div className="space-y-2 pt-2">
                            <Label>Vertical Padding ({styles.buttonPaddingY}px)</Label>
                            <Slider value={[styles.buttonPaddingY]} min={0} max={100} step={1} onValueChange={(val) => setStyles(s => ({ ...s, buttonPaddingY: val[0] }))} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
