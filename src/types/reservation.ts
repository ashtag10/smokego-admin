import { ReservationStatus } from "./common";

export interface Table {
  id: string;
  name: string;
  capacity: number;
  isActive: boolean;
}

export interface Reservation {
  id: string;
  userId: string;
  userName: string;        
  userPhone: string;      
  user?: {                
    name: string;
    phone: string;
  };
  date: string;
  time: string;
  peopleCount: number;
  tableId: string | null;
  tableName: string | null;
  message: string | null;
  status: ReservationStatus;
  qrCodeToken: string | null;
  checkedInAt: string | null;
  createdAt: string;
}