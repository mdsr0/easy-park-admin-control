
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin';
}

export interface ParkingSlot {
  id: string;
  name: string;
  section: string;
  type: 'standard' | 'compact' | 'handicapped' | 'electric';
  isOccupied: boolean;
  isActive: boolean;
}

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  vehiclePlate: string;
  slotId: string;
  slotName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  totalAmount: number;
  paymentStatus: 'paid' | 'unpaid';
  createdAt: string;
}

export interface Complaint {
  id: string;
  customerName: string;
  customerEmail: string;
  bookingId?: string;
  subject: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  response?: string;
  createdAt: string;
  resolvedAt?: string;
}

export interface PricingRule {
  id: string;
  name: string;
  slotType: 'standard' | 'compact' | 'handicapped' | 'electric' | 'all';
  timeStart: string; // HH:MM format
  timeEnd: string; // HH:MM format
  daysApplicable: string[]; // ['Monday', 'Tuesday', etc]
  basePrice: number;
  hourlyRate: number;
  isActive: boolean;
}

export interface Discount {
  id: string;
  code: string;
  name: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minBookingHours?: number;
  validFrom: string;
  validUntil: string;
  isActive: boolean;
  usageLimit?: number;
  currentUsage: number;
}

export interface ReportData {
  dailyRevenue: number[];
  weeklyOccupancy: number[];
  monthlyRevenue: number;
  popularSlots: { name: string; bookings: number }[];
  bookingsOverTime: { date: string; count: number }[];
  slotUtilization: { name: string; utilization: number }[];
}
