import { Badge } from "@/components/ui/badge";
import { OrderStatus } from "@/types/common";

interface OrderStatusBadgeProps {
  status: OrderStatus;
}

export function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  const variants: Record<OrderStatus, "default" | "success" | "warning" | "danger" | "info"> = {
    PENDING: "warning",
    ACCEPTED: "info",
    PREPARING: "info",
    PICKED_UP: "info",
    IN_TRANSIT: "default",
    DELIVERED: "success",
    CANCELLED: "danger",
  };

  const labels: Record<OrderStatus, string> = {
    PENDING: "En attente",
    ACCEPTED: "Acceptée",
    PREPARING: "En préparation",
    PICKED_UP: "Récupérée",
    IN_TRANSIT: "En route",
    DELIVERED: "Livrée",
    CANCELLED: "Annulée",
  };

  return <Badge variant={variants[status]}>{labels[status] ?? status}</Badge>;
}