import { OrderStatus, PaymentStatus, PaymentMethod, DeliveryStatus } from "./common";
import { Address } from "./user";

export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: string;
  product?: {
    name: string;
    images: string[];
  };
  variant?: {
    name: string;
    imageUrl?: string;
  };
}

export interface Delivery {
  id: string;
  status: DeliveryStatus;
  zone?: string;
  driver?: {
    id: string;
    name: string;
    phone: string;
  };
  statusHistory?: { status: DeliveryStatus; at: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  userName: string;
  userPhone: string;
  user?: {
    name: string;
    phone: string;
  };
  totalAmount: string;
  deliveryFee: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  deliveryAddress: Address;
  items: OrderItem[];
  driverId?: string;
  driverName?: string;
  delivery?: Delivery;
  createdAt: string;
  updatedAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  method: PaymentMethod;
  transactionId: string;
  status: PaymentStatus;
  amount: string;
  createdAt: string;
}