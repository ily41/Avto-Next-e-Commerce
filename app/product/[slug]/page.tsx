import ProductDetailsClient from "@/components/products/ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  console.log("slug", slug)
  return <ProductDetailsClient slug={slug} />;
}
