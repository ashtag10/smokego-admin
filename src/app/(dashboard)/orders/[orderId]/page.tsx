"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { getOrder } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatPrice, formatDate } from "@/lib/utils/format";
import { ArrowLeft, MapPin, Phone, User, Package, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function OrderDetailPage() {
  const params = useParams();
  const orderId = params.orderId as string;
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrder(orderId)
      .then(setOrder)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [orderId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin h-8 w-8 border-2 border-smoke-gold border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!order) {
    return <p className="text-smoke-muted">Commande introuvable</p>;
  }

  const totalAmount = Number(order.totalAmount) || 0;
  const deliveryFee = Number(order.deliveryFee) || 0;
  const subtotal = totalAmount - deliveryFee;

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/orders">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </Link>
        <h1 className="text-2xl font-bold text-smoke-white">
          Commande #{order.id.slice(0, 8).toUpperCase()}
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Client */}
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-smoke-white">Client</h2>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="h-4 w-4 text-smoke-gold" />
              <span className="text-smoke-white">{order.user?.name ?? "—"}</span>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="h-4 w-4 text-smoke-gold" />
              <span className="text-smoke-white">{order.user?.phone ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Statut */}
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-smoke-white">Statut</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-smoke-muted text-sm">Commande</span>
              <OrderStatusBadge status={order.orderStatus} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-smoke-muted text-sm">Paiement</span>
              <Badge
                variant={
                  order.paymentStatus === "SUCCESS"
                    ? "success"
                    : order.paymentStatus === "FAILED"
                    ? "danger"
                    : "warning"
                }
              >
                {order.paymentStatus}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-smoke-muted text-sm">Méthode</span>
              <span className="text-smoke-white text-sm">{order.paymentMethod ?? "—"}</span>
            </div>
          </div>
        </div>

        {/* Livraison */}
        <div className="bg-smoke-card border border-smoke-border rounded-xl p-6 space-y-4">
          <h2 className="text-lg font-semibold text-smoke-white">Livraison</h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <MapPin className="h-4 w-4 text-smoke-gold mt-0.5" />
              <div>
                <p className="text-smoke-white text-sm">
                  {order.deliveryAddress?.city ?? "—"}
                  {order.deliveryAddress?.district ? `, ${order.deliveryAddress.district}` : ""}
                </p>
                <p className="text-smoke-muted text-xs">
                  {order.deliveryAddress?.detailedAddress ?? ""}
                </p>
              </div>
            </div>

            {order.delivery?.driver?.name && (
              <div className="flex items-center gap-3">
                <Truck className="h-4 w-4 text-smoke-gold" />
                <span className="text-smoke-white text-sm">{order.delivery.driver.name}</span>
              </div>
            )}

            {order.delivery?.status === "DELIVERED" && order.delivery?.updatedAt && (
              <p className="text-smoke-muted text-sm">
                Livrée le : <span className="text-smoke-white">{formatDate(order.delivery.updatedAt)}</span>
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Articles */}
      <div className="bg-smoke-card border border-smoke-border rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-smoke-border">
          <h2 className="text-lg font-semibold text-smoke-white">Articles</h2>
        </div>
        <div className="divide-y divide-smoke-border">
          {order.items?.map((item) => {
            const productName = item.product?.name ?? item.variant?.name ?? "Produit";
            const productImage = item.product?.images?.[0] ?? item.variant?.imageUrl ?? null;

            return (
              <div key={item.id} className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  {productImage ? (
                    <Image
                      src={productImage}
                      alt={productName}
                      width={48}
                      height={48}
                      className="rounded-lg object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-lg bg-smoke-dark flex items-center justify-center">
                      <Package className="h-5 w-5 text-smoke-muted" />
                    </div>
                  )}
                  <div>
                    <p className="text-smoke-white font-medium">{productName}</p>
                    <p className="text-sm text-smoke-muted">x{item.quantity}</p>
                  </div>
                </div>
                <p className="text-smoke-white font-medium">
                  {formatPrice((Number(item.unitPrice) || 0) * item.quantity)}
                </p>
              </div>
            );
          })}
        </div>
        <div className="px-6 py-4 bg-smoke-dark/50 flex items-center justify-between">
          <span className="text-smoke-muted">Sous-total</span>
          <span className="text-smoke-white font-medium">{formatPrice(subtotal)}</span>
        </div>
        <div className="px-6 py-3 flex items-center justify-between">
          <span className="text-smoke-muted">Livraison</span>
          <span className="text-smoke-white">{formatPrice(deliveryFee)}</span>
        </div>
        <div className="px-6 py-4 border-t border-smoke-border flex items-center justify-between">
          <span className="text-lg font-semibold text-smoke-white">Total</span>
          <span className="text-xl font-bold text-smoke-gold">{formatPrice(totalAmount)}</span>
        </div>
      </div>

      <div className="text-sm text-smoke-muted">
        Créée le {formatDate(order.createdAt)}
      </div>
    </div>
  );
}