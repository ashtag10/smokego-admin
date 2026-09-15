export interface Driver {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  avatarUrl: string | null;
  zones: string[];
  isActive: boolean;
  totalDeliveries: number;
  averageDeliveryTime: number;
  cancellationRate: number;
  rating: number;
  createdAt: string;
}

export interface Delivery {
  id: string;
  orderId: string;
  driverId: string | null;
  driverName: string | null;
  status: string;
  zone: string;
  statusHistory: { status: string; at: string }[];
  createdAt: string;
}