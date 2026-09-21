"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getOrders, assignDriver, updateOrderStatus } from "@/lib/api/orders";
import { Order } from "@/types/order";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableHead, TableBody, TableRow, TableHeader, TableCell } from "@/components/ui/table";
import { Modal } from "@/components/ui/modal";
import { OrderStatusBadge } from "@/components/orders/order-status-badge";
import { formatPrice, formatDateShort } from "@/lib/utils/format";
import { Eye, Truck, RotateCcw } from "lucide-react";

const STATUS_OPTIONS = ["PENDING", "ACCEPTED", "PREPARING", "PICKED_UP", "IN_TRANSIT", "DELIVERED", "CANCELLED"];

export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    loadOrders();
  }, [statusFilter]);

    async function loadOrders() {
    setLoading(true);
    try {
      const res: any = await getOrders({ status: statusFilter || undefined, limit: 100 }); 
      const items = res.orders ?? res.data ?? (Array.isArray(res) ? res : []);
      setOrders(Array.isArray(items) ? items : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleStatusChange() {
    if (!selectedOrder || !newStatus) return;
    try {
      await updateOrderStatus(selectedOrder.id, newStatus);
      setOrders((prev) =>
        prev.map((o) => (o.id === selectedOrder.id ? { ...o, orderStatus: newStatus as any } : o))
      );
      setSelectedOrder(null);
      setNewStatus("");
    } catch (err) {
      alert("Erreur lors du changement de statut");
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
        <h1 className="text-2xl font-bold text-smoke-white">Commandes</h1>
        <div className="flex gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-smoke-card border border-smoke-border rounded-lg px-4 py-2 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50"
          >
            <option value="">Tous les statuts</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
          <Button variant="secondary" size="sm" onClick={loadOrders}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Table>
        <TableHead>
          <TableHeader>N°</TableHeader>
          <TableHeader>Client</TableHeader>
          <TableHeader>Total</TableHeader>
          <TableHeader>Paiement</TableHeader>
          <TableHeader>Statut</TableHeader>
          <TableHeader>Date</TableHeader>
          <TableHeader className="text-right">Actions</TableHeader>
        </TableHead>
        <TableBody>
          {(orders ?? []).map((order) => (
            <TableRow key={order.id}>
              <TableCell className="font-mono text-xs text-smoke-muted">
                {order.id?.slice(0, 8)}...
              </TableCell>
              <TableCell>
                <div>
                  <p className="text-smoke-white text-sm">{order.user?.name ?? '—'}</p>
                  <p className="text-xs text-smoke-muted">{order.user?.phone ?? '—'}</p>
                </div>
              </TableCell>
              <TableCell>
                <p className="text-smoke-white font-medium">{formatPrice(parseFloat(order.totalAmount ?? 0))}</p>
                <p className="text-xs text-smoke-muted">+ livraison {formatPrice(parseFloat(order.deliveryFee ?? 0))}</p>
              </TableCell>
              <TableCell>
                <Badge variant={order.paymentStatus === "SUCCESS" ? "success" : order.paymentStatus === "FAILED" ? "danger" : "warning"}>
                  {order.paymentStatus}
                </Badge>
              </TableCell>
              <TableCell>
                <OrderStatusBadge status={order.orderStatus} />
              </TableCell>
              <TableCell className="text-smoke-muted text-xs">
                {formatDateShort(order.createdAt)}
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-2">
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setNewStatus(order.orderStatus);
                    }}
                    className="p-2 text-smoke-muted hover:text-smoke-gold transition-colors"
                  >
                    <Truck className="h-4 w-4" />
                  </button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Modal
        isOpen={!!selectedOrder}
        onClose={() => {
          setSelectedOrder(null);
          setNewStatus("");
        }}
        title={`Commande #${selectedOrder?.id?.slice(0, 8)}`}
        size="sm"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-smoke-white mb-1.5">Nouveau statut</label>
            <select
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              className="w-full bg-smoke-card border border-smoke-border rounded-lg px-4 py-2.5 text-sm text-smoke-white focus:outline-none focus:border-smoke-gold/50"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 justify-end">
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedOrder(null);
                setNewStatus("");
              }}
            >
              Annuler
            </Button>
            <Button onClick={handleStatusChange}>Valider</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}