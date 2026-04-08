import { ProductSpecifications } from "@/components/utils/product-specifications";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
    Package,
    Tag,
    Layers,
    Boxes,
    Clock,
    ArrowLeft,
    CheckCircle2,
    XCircle,
    CreditCard,
    Image as ImageIcon,
    ExternalLink,
    ChevronRight,
    Sparkles,
    ShieldCheck,
    Zap
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { notFound } from "next/navigation";

import { productDetailsApi } from "@/lib/store/productDetails/apislice";

const BASE_URL = "https://avtoo027-001-site1.ntempurl.com/api/v1";

// Using the same data-fetching logic as defined in store/productDetails/apislice.ts
async function getProduct(id: string) {
    try {
        const res = await fetch(`${BASE_URL}/Products/${id}`, {
            next: { tags: [`product-${id}`] },
            cache: 'no-store'
        });
        if (!res.ok) return null;
        return res.json();
    } catch (error) {
        console.error("Failed to fetch product:", error);
        return null;
    }
}

export default async function ProductDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const { id } = resolvedParams;
    const product = await getProduct(id);

    if (!product) {
        notFound();
    }

    const images = product.images || [];
    const primaryImage = product.imageUrl || product.primaryImageUrl;

    return (
        <div className="flex flex-col gap-8 py-8 px-4 md:px-10 max-w-7xl mx-auto min-h-screen bg-background text-foreground">
            {/* breadcrumbs-like navigation */}
            <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                <Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link>
                <ChevronRight className="h-3 w-3" />
                <Link href="/dashboard/products" className="hover:text-primary transition-colors">Products</Link>
                <ChevronRight className="h-3 w-3" />
                <span className="text-foreground/60 truncate max-w-[200px]">{product.name}</span>
            </div>

            {/* Hero / Header Section */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card p-8 rounded-[2rem] border border-border shadow-sm overflow-hidden relative group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform duration-1000">
                    <Zap className="h-40 w-40 text-primary" />
                </div>

                <div className="flex items-start md:items-center gap-6 relative z-10">
                    <Link href="/dashboard/products">
                        <Button variant="outline" size="icon" className="h-12 w-12 rounded-full border-border bg-background shadow-sm hover:bg-accent transition-all shrink-0">
                            <ArrowLeft className="h-6 w-6" />
                        </Button>
                    </Link>
                    <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-3">
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter">{product.name}</h1>
                            {product.isHotDeal && (
                                <Badge className="bg-orange-500 hover:bg-orange-600 dark:bg-orange-600 dark:hover:bg-orange-500 text-white border-none px-3 py-1 text-xs font-black rounded-full italic flex items-center gap-1">
                                    <Sparkles className="h-3 w-3" /> HOT DEAL
                                </Badge>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-medium text-muted-foreground">
                            <span className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full"><Package className="h-4 w-4 text-primary" /> <span className="text-foreground/70">SKU:</span> {product.sku}</span>
                            <span className="flex items-center gap-2 bg-accent/50 px-3 py-1 rounded-full"><Tag className="h-4 w-4 text-primary" /> <span className="text-foreground/70">ID:</span> <span className="font-mono text-xs">{product.id.substring(0, 18)}...</span></span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 relative z-10">
                    <Badge className={`px-4 py-1.5 text-xs font-bold rounded-full border-none shadow-sm ${product.isActive ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"}`}>
                        {product.isActive ? (
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" /> LIVE STATUS</span>
                        ) : (
                            <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-red-500" /> INACTIVE</span>
                        )}
                    </Badge>
                    <Button variant="default" className="rounded-full px-6" asChild>
                        <Link href={`/dashboard/products?edit=${id}`}>Modify Product</Link>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Gallery Section - images must be at most 40% (lg:col-span-4 is 33.3%) */}
                <div className="lg:col-span-4 space-y-6 lg:sticky lg:top-24">
                    <Card className="overflow-hidden border-none shadow-2xl bg-card rounded-[2.5rem] group/main-img">
                        <CardContent className="p-4">
                            <div className="aspect-[4/5] relative flex items-center justify-center rounded-[2rem] overflow-hidden bg-accent/20 transition-transform duration-500 group-hover/main-img:scale-[1.02]">
                                {primaryImage ? (
                                    <img
                                        src={primaryImage.startsWith('http') ? primaryImage : `https://avtoo027-001-site1.ntempurl.com${primaryImage}`}
                                        alt={product.name}
                                        className="object-contain w-full h-full drop-shadow-2xl p-4"
                                    />
                                ) : (
                                    <div className="flex flex-col items-center text-muted-foreground opacity-20">
                                        <ImageIcon className="h-24 w-24 mb-4" />
                                        <span className="text-lg font-bold">MISSING ASSET</span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-4 px-2">
                            {images.map((img: any, idx: number) => (
                                <div key={idx} className="aspect-square rounded-2xl border border-border bg-card overflow-hidden hover:border-primary/50 hover:scale-105 transition-all cursor-pointer shadow-sm">
                                    <img
                                        src={img.imageUrl.startsWith('http') ? img.imageUrl : `https://avtoo027-001-site1.ntempurl.com${img.imageUrl}`}
                                        alt={`Detail ${idx}`}
                                        className="object-cover w-full h-full"
                                    />
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Details Section */}
                <div className="lg:col-span-8 space-y-8">
                    {/* Pricing & Stock Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-primary/5 dark:bg-primary/10 p-8 rounded-[2rem] border border-primary/10 shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 text-primary/5 group-hover:scale-110 transition-transform duration-700">
                                <CreditCard className="h-40 w-40" />
                            </div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Valuation Summary</span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black tracking-tighter text-foreground">{product.discountedPrice || product.price} <span className="text-xl">AZN</span></span>
                                        {product.discountedPrice > 0 && product.discountedPrice < product.price && (
                                            <span className="text-xl text-muted-foreground/50 line-through font-bold">{product.price}</span>
                                        )}
                                    </div>
                                </div>
                                {product.discountedPrice > 0 && product.discountedPrice < product.price && (
                                    <Badge className="mt-6 bg-primary text-primary-foreground hover:bg-primary border-none text-[10px] font-black rounded-full px-4 py-1 self-start">
                                        -{Math.round((1 - (product.discountedPrice / product.price)) * 100)}% DISCOUNT APPLIED
                                    </Badge>
                                )}
                            </div>
                        </div>

                        <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm relative overflow-hidden group">
                            <div className="absolute -right-6 -bottom-6 text-muted-foreground/5 group-hover:scale-110 transition-transform duration-700">
                                <Boxes className="h-40 w-40" />
                            </div>
                            <div className="relative z-10 flex flex-col justify-between h-full">
                                <div className="space-y-4">
                                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">Inventory Management</span>
                                    <div className="flex items-baseline gap-3">
                                        <span className="text-5xl font-black tracking-tighter text-foreground">{product.stockQuantity}</span>
                                        <span className="text-muted-foreground font-black text-lg">UNITS</span>
                                    </div>
                                </div>
                                <div className="mt-6">
                                    {product.stockQuantity > 10 ? (
                                        <Badge className="bg-green-500/10 text-green-600 dark:text-green-400 border-none hover:bg-green-500/15 text-[10px] font-black rounded-full px-4 py-1">
                                            <ShieldCheck className="h-3 w-3 mr-2 inline" /> STOCK SECURE
                                        </Badge>
                                    ) : product.stockQuantity > 0 ? (
                                        <Badge className="bg-orange-500/10 text-orange-600 dark:text-orange-400 border-none hover:bg-orange-500/15 text-[10px] font-black rounded-full px-4 py-1">
                                            CRITICAL STOCK
                                        </Badge>
                                    ) : (
                                        <Badge className="bg-destructive/10 text-destructive border-none hover:bg-destructive/15 text-[10px] font-black rounded-full px-4 py-1">
                                            <XCircle className="h-3 w-3 mr-2 inline" /> REPLENISHMENT REQUIRED
                                        </Badge>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Classification Tags */}
                    <div className="bg-accent/30 p-8 rounded-[2rem] border border-border/50">
                        <div className="flex items-center justify-between mb-8">
                            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em]">Taxonomy & Metadata</span>
                            <Layers className="h-4 w-4 text-primary opacity-50" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Primary Vertical</span>
                                <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm group/tag transition-all hover:border-primary/30">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="font-bold text-sm">{product.categoryName}</span>
                                    <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover/tag:opacity-50 transition-opacity" />
                                </div>
                            </div>
                            {product.brandName && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Manufacturer Entity</span>
                                    <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm group/tag transition-all hover:border-orange-500/30">
                                        <div className="h-2 w-2 rounded-full bg-orange-500" />
                                        <span className="font-bold text-sm">{product.brandName}</span>
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover/tag:opacity-50 transition-opacity" />
                                    </div>
                                </div>
                            )}
                            {product.subCategoryName && (
                                <div className="space-y-2">
                                    <span className="text-[10px] font-bold text-muted-foreground/60 uppercase">Sub Classification</span>
                                    <div className="flex items-center gap-3 bg-card p-3 rounded-2xl border border-border shadow-sm group/tag transition-all hover:border-blue-500/30">
                                        <div className="h-2 w-2 rounded-full bg-blue-500" />
                                        <span className="font-bold text-sm">{product.subCategoryName}</span>
                                        <ExternalLink className="h-3 w-3 ml-auto opacity-0 group-hover/tag:opacity-50 transition-opacity" />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Narrative Content */}
                    <div className="space-y-6">
                        {product.shortDescription && (
                            <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm transition-all hover:shadow-xl hover:border-border/80">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-[2px] w-12 bg-primary rounded-full" />
                                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Executive Summary</h3>
                                </div>
                                <p className="text-foreground/80 leading-relaxed text-base font-bold italic border-l-4 border-accent pl-6">{product.shortDescription}</p>
                            </div>
                        )}

                        {product.description && (
                            <div className="bg-card p-8 rounded-[2rem] border border-border shadow-sm transition-all hover:shadow-xl hover:border-border/80">
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="h-[2px] w-12 bg-primary/40 rounded-full" />
                                    <h3 className="text-[10px] font-black uppercase text-muted-foreground tracking-[0.2em]">Full Specifications Narrative</h3>
                                </div>
                                <div className="text-foreground/70 leading-relaxed text-sm prose dark:prose-invert max-w-none 
                                prose-headings:font-black prose-headings:tracking-tighter prose-strong:text-foreground prose-strong:font-black 
                                prose-p:mb-6 prose-ul:list-disc prose-ul:pl-6"
                                    dangerouslySetInnerHTML={{ __html: product.description }}>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Timestamping */}
                    <div className="flex items-center justify-between px-8 py-4 bg-accent/20 rounded-2xl border border-border/50 text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <Clock className="h-3.5 w-3.5" />
                            <span>Synchronized: {new Date(product.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {product.slug && <span className="font-mono opacity-50">/{product.slug}</span>}
                    </div>
                </div>
            </div>

            <Separator className="my-12 opacity-5" />

            {/* Specifications Management Section */}
            <div id="specifications" className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-500 fill-mode-both">
                <ProductSpecifications productId={id} />
            </div>

            <div className="py-12 flex justify-center">
                <p className="text-[10px] font-black text-muted-foreground/30 uppercase tracking-[0.5em]">Avto Next E-Commerce Intelligence Dashboard</p>
            </div>
        </div>
    );
}
