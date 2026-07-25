export interface Service {
  id: number;
  name: string;
  description: string;
  duration_minutes: number;
  price: number;
  is_active: boolean;
}

export interface Booking {
  id: number;
  service_id: number;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  appointment_date: string;
  appointment_time: string;
  status: "pending" | "confirmed" | "cancelled";
  note: string | null;
  created_at: string;
}

export interface BookingCreatePayload {
  service_id: number;
  date: string;
  time: string;
  customer_name: string;
  customer_phone: string;
  customer_email?: string | null;
  note?: string | null;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}
