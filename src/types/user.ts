import { Role, AdminRole } from "./common";

export interface User {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  role: Role;
  adminRole?: AdminRole;
  avatarUrl: string | null;
  isActive: boolean;
  isVip: boolean;
  vipSince: string | null;
  loyaltyPoints: number;
  createdAt: string;
}

export interface Address {
  id: string;
  name: string;
  recipientName: string;
  phone: string;
  city: string;
  district: string;
  detailedAddress: string;
  gpsLat?: number;
  gpsLng?: number;
  isDefault: boolean;
}