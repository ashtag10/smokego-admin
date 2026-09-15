"use client";

import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { formatPrice } from "@/lib/utils/format";
import { Pencil, Trash2, Package } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface ProductTableProps {
  products: Product[];
  onDelete?: (id: string) => void;
}

export function ProductTable({ products, onDelete }: ProductTableProps) {
  return (
    <Table>
      <TableHead>
        <TableHeader>Image</TableHeader>
        <TableHeader>Nom</TableHeader>
        <TableHeader>Catégorie</TableHeader>
        <TableHeader>Prix</TableHeader>
        <TableHeader>Stock</TableHeader>
        <TableHeader>Statut</TableHeader>
        <TableHeader className="text-right">Actions</TableHeader>
      </TableHead>
      <TableBody>
        {products.map((product) => (
          <TableRow key={product.id}>
            <TableCell>
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  width={48}
                  height={48}
                  className="rounded-lg object-cover"
                />
              ) : (
                <div className="h-12 w-12 rounded-lg bg-smoke-dark flex items-center justify-center">
                  <Package className="h-5 w-5 text-smoke-muted" />
                </div>
              )}
            </TableCell>
            <TableCell>
              <div>
                <p className="font-medium text-smoke-white">{product.name}</p>
                <p className="text-xs text-smoke-muted">{product.brand}</p>
              </div>
            </TableCell>
            <TableCell>
              <Badge variant="default">{product.category}</Badge>
            </TableCell>
            <TableCell>
              <p className="text-smoke-white">{formatPrice(parseFloat(product.price))}</p>
              {product.promoPrice && (
                <p className="text-xs text-smoke-gold">
                  Promo: {formatPrice(parseFloat(product.promoPrice))}
                </p>
              )}
            </TableCell>
            <TableCell>
              <span className={product.stock < 5 ? "text-smoke-red-light" : "text-smoke-white"}>
                {product.stock}
              </span>
            </TableCell>
            <TableCell>
              <Badge variant={product.isActive ? "success" : "danger"}>
                {product.isActive ? "Actif" : "Inactif"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-2">
                <Link
                  href={`/products/${product.id}`}
                  className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                >
                  <Pencil className="h-4 w-4" />
                </Link>
                {onDelete && (
                  <button
                    onClick={() => onDelete(product.id)}
                    className="p-2 text-smoke-muted hover:text-smoke-red transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}