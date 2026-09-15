"use client";

import { useRouter } from "next/navigation";
import { createProduct } from "@/lib/api/products";
import { ProductForm } from "@/components/products/product-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function NewProductPage() {
  const router = useRouter();

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">Nouveau produit</h1>
      </div>

      <ProductForm
        onSubmit={async (data) => {
          await createProduct(data);
          router.push("/products");
        }}
      />
    </div>
  );
}