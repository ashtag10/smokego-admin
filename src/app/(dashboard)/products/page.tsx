"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getProducts, deleteProduct } from "@/lib/api/products";
import { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { formatPrice } from "@/lib/utils/format";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import Image from "next/image";

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

   const loadProducts = useCallback(async () => {
    try {
      const res: any = await getProducts({ limit: 100 }); 
      const items = res.products ?? res.data ?? (Array.isArray(res) ? res : []);
      setProducts(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  async function handleDelete() {
    if (!deleteId) return;
    try {
      await deleteProduct(deleteId);
      setProducts((prev) => prev.filter((p) => p.id !== deleteId));
      setDeleteId(null);
    } catch (err) {
      alert("Erreur lors de la suppression");
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-smoke-white">Produits</h1>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Nouveau produit
          </Button>
        </Link>
      </div>

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
          {(products ?? []).map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                {(product.images ?? [])[0] ? (
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
                <div>
                  <p className="text-smoke-white">{formatPrice(parseFloat(product.price))}</p>
                  {product.promoPrice && (
                    <p className="text-xs text-smoke-gold">
                      Promo: {formatPrice(parseFloat(product.promoPrice))}
                    </p>
                  )}
                </div>
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
                  <button
                    onClick={() => router.push(`/products/${product.id}`)}
                    className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setDeleteId(product.id)}
                    className="p-2 text-smoke-muted hover:text-smoke-red transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        title="Confirmer la suppression"
        size="sm"
      >
        <p className="text-smoke-muted mb-6">
          Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
        </p>
        <div className="flex gap-3 justify-end">
          <Button variant="ghost" onClick={() => setDeleteId(null)}>
            Annuler
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Supprimer
          </Button>
        </div>
      </Modal>
    </div>
  );
}