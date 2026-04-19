"use client"

import Link from "next/link";
import { DataTable } from "@/components/data-table/data-tables";
import { createColumns } from "@/components/data-table/data-table-factory";
import { useMemo, useState, useEffect } from "react";
import { useDeleteProductMutation, type Product, useFilterProductsQuery, useCreateProductWithImageMutation, useUpdateProductWithImageMutation } from "@/lib/store/products/apislice";
import { useUploadPrimaryImageMutation, useUploadDetailImagesMutation, useDeleteProductImageMutation } from "@/lib/store/products/editApis/apislice";
import { useGetProductByIdQuery } from "@/lib/store/productDetails/apislice";
import { useGetCategoriesQuery, type Category } from "@/lib/store/categories/apislice";
import { useSearchBrandsAdminQuery } from "@/lib/store/brands/apislice";
import { toast } from "sonner";
import { useSearchParams } from "next/navigation";
import { DynamicAddPopup, type FieldConfig } from "@/components/addEditElement/DynamicAddPopup";
import { DynamicEditPopup } from "@/components/addEditElement/DynamicEditPopup";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { FormLabel } from "@/components/ui/form";
import { Plus, ImageIcon, Trash2 } from "lucide-react";
import * as z from "zod";

export default function ProductsPage() {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10,
    });

    const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);
    const [selectedBrandSlugs, setSelectedBrandSlugs] = useState<string[]>([]);
    const [searchTerm, setSearchTerm] = useState("");

    const searchParams = useSearchParams();
    const editId = searchParams.get("edit");

    const { data: categoriesData } = useGetCategoriesQuery();

    const flatCategories = useMemo(() => {
        if (!categoriesData) return [];
        const flatList: Category[] = [];
        const flatten = (cats: Category[]) => {
            cats.forEach(cat => {
                flatList.push(cat);
                if (cat.subCategories && cat.subCategories.length > 0) {
                    flatten(cat.subCategories);
                }
            });
        };
        flatten(categoriesData);
        return flatList;
    }, [categoriesData]);

    const { data: brandsData } = useSearchBrandsAdminQuery({ page: 1, pageSize: 100 });

    const filterRequestBody = useMemo(() => {
        return {
            categoryIds: selectedCategoryIds.length > 0 ? selectedCategoryIds : undefined,
            brandSlug: selectedBrandSlugs.length > 0 ? selectedBrandSlugs[0] : undefined,
            searchTerm: searchTerm || undefined,
            page: pageIndex + 1,
            pageSize: pageSize,
        };
    }, [selectedCategoryIds, selectedBrandSlugs, searchTerm, pageIndex, pageSize]);

    const { data: filteredData, isLoading, error } = useFilterProductsQuery(filterRequestBody);

    const [createProduct, { isLoading: isCreating }] = useCreateProductWithImageMutation();
    const [updateProduct, { isLoading: isUpdating }] = useUpdateProductWithImageMutation();
    const [uploadPrimary, { isLoading: isUploadingPrimary }] = useUploadPrimaryImageMutation();
    const [uploadDetails, { isLoading: isUploadingDetails }] = useUploadDetailImagesMutation();
    const [deleteDetailImage, { isLoading: isDeletingImage }] = useDeleteProductImageMutation();

    const [deleteProduct] = useDeleteProductMutation();
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    useEffect(() => {
        if (editId) {
            setEditingProductId(editId);
        }
    }, [editId]);

    const { data: productDetails, isLoading: isFetchingDetails } = useGetProductByIdQuery(editingProductId!, { skip: !editingProductId });
    console.log(productDetails)
    const productSchema = z.object({
        name: z.string().min(2, "Ad tələb olunur").refine((val) => !val.startsWith("#"), "Məhsul adı '#' ilə başlaya bilməz"),
        sku: z.string(),
        shortDescription: z.string().nullish(),
        description: z.string(),
        categoryId: z.string(),
        brandId: z.string().min(1, "Brend tələb olunur"),
        price: z.coerce.number(),
        discountedPrice: z.coerce.number().nullish(),
        stockQuantity: z.number(),
        weightKg: z.coerce.number(),
        isHotDeal: z.boolean(),
        isActive: z.boolean(),
        imageFile: z.any().optional(),
        detailImageFiles: z.any().optional()
    });



    const productFields: FieldConfig[] = [
        { name: "name", label: "Məhsulun Adı", type: "text", placeholder: "məsələn: T-Shirt" },
        { name: "sku", label: "SKU", type: "text", placeholder: "TSH-001" },
        { name: "shortDescription", label: "Qısa Təsvir", type: "text" },
        { name: "description", label: "Tam Təsvir", type: "textarea" },
        {
            name: "categoryId",
            label: "Kateqoriya",
            type: "combobox",
            placeholder: "Kateqoriya Seçin",
            options: flatCategories.map(cat => ({ label: cat.name, value: cat.id }))
        },
        {
            name: "brandId",
            label: "Brend",
            type: "select",
            placeholder: "Brend Seçin",
            options: brandsData?.items?.map(brand => ({ label: brand.name, value: brand.id })) || []
        },
        { name: "price", label: "Qiymət", type: "number" },
        { name: "discountedPrice", label: "Endirimli Qiymət", type: "number" },
        { name: "stockQuantity", label: "Stok Miqdarı", type: "number" },
        { name: "weightKg", label: "Çəki (kq)", type: "number" },
        { name: "isHotDeal", label: "İsti Təklif", type: "switch" },
        { name: "isActive", label: "Aktivdir", type: "switch" },
        { name: "imageFile", label: "Əsas Şəkil", type: "file" },
        {
            name: "existingDetailImages",
            label: "Mövcud Detal Şəkilləri",
            type: "custom",
            renderCustom: () => {
                if (!productDetails?.images?.length) return null;
                const detailImages = productDetails.images.filter(img => img.imageUrl !== productDetails.imageUrl);
                if (!detailImages.length) return null;
                return (
                    <div className="space-y-4">
                        <FormLabel className="text-sm font-bold flex items-center gap-2">
                            <ImageIcon className="h-4 w-4" /> Mövcud Detal Şəkilləri
                        </FormLabel>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
                            {detailImages.map((img) => (
                                <div key={img.id} className="group relative aspect-square border-2 border-border/50 rounded-2xl overflow-hidden hover:border-primary/50 transition-all shadow-sm">
                                    <img src={`https://avtoo027-001-site1.ntempurl.com${img.imageUrl}`} alt="Detal" className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    type="button"
                                                    variant="destructive"
                                                    size="icon"
                                                    className="h-8 w-8 rounded-full"
                                                    disabled={isDeletingImage}
                                                >
                                                    <Trash2 size={14} />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Şəkli silmək istədiyinizə əminsiniz?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Bu əməliyyat geri qaytarıla bilməz. Şəkil daimi olaraq silinəcəkdir.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Ləğv et</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                                                        onClick={async () => {
                                                            try {
                                                                await deleteDetailImage(img.id).unwrap();
                                                                toast.success("Şəkil uğurla silindi");
                                                            } catch (err) {
                                                                toast.error("Şəkil silinə bilmədi");
                                                            }
                                                        }}
                                                    >
                                                        Sil
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            }
        },
        { name: "detailImageFiles", label: "Yeni Detal Şəkilləri Əlavə Et", type: "file-multiple" }
    ];

    const productColumns = useMemo(() => createColumns<Product>([

        {
            key: "primaryImageUrl",
            label: "Şəkil",
            render: (value) => {
                return (
                    <div className="h-10 w-10 flex items-center justify-center overflow-hidden rounded border bg-slate-50">
                        {value ? (
                            <img
                                src={`https://avtoo027-001-site1.ntempurl.com${value}`}
                                alt="Product"
                                className="object-contain h-full w-full"
                            />
                        ) : (
                            <span className="text-[10px] text-gray-400">Şəkil yoxdur</span>
                        )}
                    </div>
                )
            }
        },
        { key: "name", label: "Ad", sortable: true },
        { key: "sku", label: "SKU", sortable: true },
        { key: "categoryName", label: "Kateqoriya" },
        { key: "brandName", label: "Brend" },
        {
            key: "price",
            label: "Qiymət",
            sortable: true,
            render: (value) => `${value} AZN`
        },
        {
            key: "stockQuantity",
            label: "Stok",
            sortable: true
        },
        {
            key: "weightKg",
            label: "Çəki (kq)",
            sortable: true,
            render: (value) => `${value} kq`
        },
        {
            key: "id",
            label: "Təfərrüatlar",
            render: (value) => {
                return (
                    <Link href={`/dashboard/products/${value}`}>
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-3/5 h-6 !mx-auto"
                        >
                            <Plus size={14} />
                        </Button>
                    </Link>
                )
            }
        }
    ],
        async (item) => {
            try {
                await deleteProduct(item.id).unwrap();
                toast.success(`"${item.name}" məhsulu uğurla silindi.`);
            } catch (err) {
                toast.error("Məhsul silinə bilmədi. Yenidən cəhd edin.");
            }
        },
        (item) => {
            setEditingProductId(item.id);
        }), [deleteProduct]);

    if (isLoading) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Məhsullar</h1>
                <div className="flex flex-1 items-center justify-center min-h-[400px]">
                    <div className="flex flex-col items-center gap-2">
                        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                        <p className="text-muted-foreground animate-pulse">Məhsullar yüklənir...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Məhsullar</h1>
                <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-6 text-destructive">
                    <p className="font-semibold">Məhsullar Yüklənilə Bilmədi</p>
                    <p className="text-sm opacity-90">Serverdən məlumat alınması mümkün olmadı. Birlaşmanızı yoxlayın və ya bir az sonra yenidən cəhd edin.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6 px-6 md:px-10">
            <div className="flex justify-between items-center">
                <h1 className="text-base md:text-xl lg:text-2xl font-bold">Məhsullar</h1>
                <DynamicAddPopup
                    title="Məhsul Əlavə Et"
                    triggerText="Məhsul Əlavə Et"
                    schema={productSchema}
                    defaultValues={{
                        name: "", sku: "", shortDescription: "", description: "",
                        categoryId: "", brandId: "", price: 0, discountedPrice: 0,
                        stockQuantity: 0, weightKg: 0, isHotDeal: false, isActive: true, imageFile: null, detailImageFiles: []
                    }}
                    fields={productFields}
                    isLoading={isCreating}
                    onSubmit={async (values) => {
                        if (!values.imageFile) {
                            toast.error("Əsas şəkil tələb olunur");
                            return;
                        }
                        await createProduct({
                            ...values,
                            discountedPrice: values.discountedPrice || values.price,
                            shortDescription: values.shortDescription || "",
                            primaryImageUrl: values.imageFile,
                            detailImageFiles: values.detailImageFiles || [],
                        }).unwrap();
                        toast.success("Məhsul yaradıldı!");
                    }}
                />
            </div>

            <DataTable
                columns={productColumns}
                data={filteredData?.products || []}
                pageCount={filteredData?.totalPages || 0}
                manualPagination={true}
                pagination={{ pageIndex, pageSize }}
                onPaginationChange={setPagination}
                filterColumn="name"
                filterMode="server"
                onFilterChange={(value) => {
                    setSearchTerm(value);
                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                }}
                onFacetedFilterChange={(column, values) => {
                    if (column === "categoryId" || column === "categoryName") {
                        setSelectedCategoryIds(values);
                    } else if (column === "brandName") {
                        setSelectedBrandSlugs(values);
                    }
                    setPagination(prev => ({ ...prev, pageIndex: 0 }));
                }}
                facetedFilters={[
                    {
                        column: "categoryName",
                        title: "Kateqoriya",
                        options: flatCategories.map((cat) => ({
                            label: cat.name,
                            value: cat.id,
                        })),
                    },
                    {
                        column: "brandName",
                        title: "Brend",
                        options: brandsData?.items?.map((brand) => ({
                            label: brand.name,
                            value: brand.slug,
                        })) || [],
                    }
                ]}
            />
            <DynamicEditPopup
                key={editingProductId ?? "edit-popup"}
                open={!!editingProductId}
                onOpenChange={(open) => !open && setEditingProductId(null)}
                title={productDetails?.name ? `Məhsulu Düzəlt: ${productDetails.name}` : "Məhsulu Düzəlt"}
                isFetching={isFetchingDetails}
                isLoading={isUpdating || isUploadingPrimary || isUploadingDetails}
                schema={productSchema}
                defaultValues={productDetails ? {
                    ...productDetails,
                    weightKg: productDetails.weightKg ?? 0,
                    imageFile: undefined,
                    detailImageFiles: []
                } : undefined}
                initialPreviews={{
                    imageFile: productDetails?.imageUrl ? `https://avtoo027-001-site1.ntempurl.com${productDetails.imageUrl}` : ""
                }}
                fields={productFields}
                onSubmit={async (values) => {
                    if (!productDetails) return;

                    // We trigger the main update and any image uploads in parallel
                    // This fixes the 10+ second delay caused by sequential awaiting.
                    const updatePromise = updateProduct({
                        ...values,
                        id: productDetails.id,
                        discountedPrice: values.discountedPrice || values.price,
                        shortDescription: values.shortDescription || "",
                        primaryImageUrl: null,
                        detailImageFiles: [],
                    }).unwrap();

                    const uploads = [];
                    if (values.imageFile instanceof File) {
                        uploads.push(uploadPrimary({ id: productDetails.id, imageFile: values.imageFile }).unwrap());
                    }
                    if (values.detailImageFiles && values.detailImageFiles.length > 0) {
                        uploads.push(uploadDetails({ id: productDetails.id, imageFiles: values.detailImageFiles }).unwrap());
                    }

                    await Promise.all([updatePromise, ...uploads]);

                    toast.success("Məhsul yenilendi!");
                }}
            />
        </div>
    );
}
