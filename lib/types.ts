// Tipos exactos sincronizados 1:1 con el esquema SQL de Supabase (001_initial_schema_tienda_unas.sql)

export type UserRoleType = "superadmin" | "admin" | "customer";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserRoleRecord {
  id: string;
  user_id: string;
  role: UserRoleType;
  created_at: string;
}

export interface BusinessSettings {
  id: string;
  business_name: string;
  description: string;
  phone: string;
  whatsapp: string;
  email: string;
  address: string;
  maps_url: string;
  created_at: string;
  updated_at: string;
}

export interface ServiceCategory {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export interface NailService {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_path: string;
  is_active: boolean;
  includes?: string[];
  badge?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  profile_id: string | null;
  full_name: string;
  email: string;
  phone: string;
  created_at: string;
  updated_at: string;
}

export interface BusinessHour {
  id: string;
  weekday: number; // 0 = Domingo, 1 = Lunes ... 6 = Sábado
  weekday_label: string;
  opens_at: string | null;
  closes_at: string | null;
  is_closed: boolean;
}

export interface AvailabilityException {
  id: string;
  starts_at: string;
  ends_at: string;
  reason: string;
  created_by: string | null;
}

export type AppointmentStatus =
  | "pending_payment"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface Appointment {
  id: string;
  customer_id: string;
  service_id: string | null;
  starts_at: string;
  ends_at: string;
  status: AppointmentStatus;
  service_name_snapshot: string;
  price_snapshot: number;
  deposit_required: number; // 50% de anticipo
  notes: string | null;
  created_at: string;
}

export interface CourseCategory {
  id: string;
  name: string;
  description: string;
  sort_order: number;
  is_active: boolean;
}

export type CourseModality = "Presencial" | "Online" | "Híbrido";

export interface NailCourse {
  id: string;
  category_id: string;
  name: string;
  description: string;
  price: number;
  modality: CourseModality;
  image_path: string;
  is_active: boolean;
  duration_hours: number;
  level: string;
  syllabus: string[];
  includes_kit: boolean;
  created_at: string;
  updated_at: string;
}

export type CourseSessionStatus = "open" | "full" | "cancelled";

export interface CourseSession {
  id: string;
  course_id: string;
  starts_at: string;
  ends_at: string;
  capacity: number;
  enrolled_count: number;
  status: CourseSessionStatus;
  location: string;
}

export type EnrollmentStatus =
  | "pending"
  | "confirmed"
  | "cancelled"
  | "completed";

export interface CourseEnrollment {
  id: string;
  course_session_id: string;
  customer_id: string;
  status: EnrollmentStatus;
  price_snapshot: number;
  created_at: string;
}

export type PaymentType = "deposit" | "remaining" | "full" | "refund";
export type PaymentStatus = "pending" | "approved" | "failed" | "refunded";

export interface PaymentRecord {
  id: string;
  appointment_id: string | null;
  enrollment_id: string | null;
  amount: number;
  currency: string;
  payment_type: PaymentType;
  status: PaymentStatus;
  provider: string;
  provider_reference: string;
  created_at: string;
  paid_at: string | null;
}

export interface MediaItem {
  id: string;
  storage_path: string;
  alt_text: string;
  caption: string;
  media_type: "image" | "video";
  style_tag: string;
  created_by: string | null;
  created_at: string;
}

export interface GalleryItem {
  id: string;
  media_id: string;
  sort_order: number;
  is_published: boolean;
}
