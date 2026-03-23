import ProductDetailsClient from "@/components/products/ProductDetailsClient";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ProductDetailsClient slug={slug} />;
}
