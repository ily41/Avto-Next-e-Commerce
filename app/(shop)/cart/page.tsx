import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { CartClient } from "@/components/cart/CartClient";

export default function CartPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4 text-center">
          <Breadcrumb className="justify-center mb-4 flex">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-balck">Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-3xl font-bold text-gray-900">Cart</h1>
        </div>
      </div>

      {/* Cart Content */}
      <div className="container mx-auto px-4 py-12">
        <CartClient />
      </div>
    </div>
  );
}
