
import { ParkingSlot, Booking, Complaint, PricingRule, Discount, ReportData } from '../types';

// Mock Parking Slots
export const mockParkingSlots: ParkingSlot[] = [
  { id: '1', name: 'A1', section: 'A', type: 'standard', isOccupied: true, isActive: true },
  { id: '2', name: 'A2', section: 'A', type: 'standard', isOccupied: false, isActive: true },
  { id: '3', name: 'A3', section: 'A', type: 'compact', isOccupied: false, isActive: true },
  { id: '4', name: 'B1', section: 'B', type: 'handicapped', isOccupied: true, isActive: true },
  { id: '5', name: 'B2', section: 'B', type: 'electric', isOccupied: false, isActive: true },
  { id: '6', name: 'B3', section: 'B', type: 'standard', isOccupied: false, isActive: false },
  { id: '7', name: 'C1', section: 'C', type: 'compact', isOccupied: true, isActive: true },
  { id: '8', name: 'C2', section: 'C', type: 'standard', isOccupied: false, isActive: true },
];

// Mock Bookings
export const mockBookings: Booking[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    customerPhone: '555-1234',
    vehiclePlate: 'ABC123',
    slotId: '1',
    slotName: 'A1',
    startTime: '2023-05-05T10:00:00',
    endTime: '2023-05-05T12:00:00',
    status: 'active',
    totalAmount: 25.00,
    paymentStatus: 'paid',
    createdAt: '2023-05-04T15:30:00',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    customerPhone: '555-5678',
    vehiclePlate: 'XYZ789',
    slotId: '4',
    slotName: 'B1',
    startTime: '2023-05-06T09:00:00',
    endTime: '2023-05-06T14:00:00',
    status: 'pending',
    totalAmount: 35.00,
    paymentStatus: 'unpaid',
    createdAt: '2023-05-05T08:15:00',
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    customerPhone: '555-9012',
    vehiclePlate: 'DEF456',
    slotId: '7',
    slotName: 'C1',
    startTime: '2023-05-04T13:00:00',
    endTime: '2023-05-04T15:00:00',
    status: 'completed',
    totalAmount: 15.00,
    paymentStatus: 'paid',
    createdAt: '2023-05-03T10:45:00',
  },
];

// Mock Complaints
export const mockComplaints: Complaint[] = [
  {
    id: '1',
    customerName: 'John Doe',
    customerEmail: 'john@example.com',
    bookingId: '1',
    subject: 'Slot not cleaned',
    description: 'The parking slot was dirty when I arrived.',
    status: 'resolved',
    priority: 'medium',
    response: 'We apologize for the inconvenience. We have notified our cleaning staff.',
    createdAt: '2023-05-05T13:00:00',
    resolvedAt: '2023-05-05T14:30:00',
  },
  {
    id: '2',
    customerName: 'Jane Smith',
    customerEmail: 'jane@example.com',
    bookingId: '2',
    subject: 'Double booking',
    description: 'Someone else was in my reserved parking slot.',
    status: 'in-progress',
    priority: 'high',
    createdAt: '2023-05-06T10:00:00',
  },
  {
    id: '3',
    customerName: 'Bob Johnson',
    customerEmail: 'bob@example.com',
    subject: 'App not working',
    description: 'I cannot make a booking through the mobile app.',
    status: 'pending',
    priority: 'low',
    createdAt: '2023-05-07T09:15:00',
  },
];

// Mock Pricing Rules
export const mockPricingRules: PricingRule[] = [
  {
    id: '1',
    name: 'Standard Weekday',
    slotType: 'standard',
    timeStart: '08:00',
    timeEnd: '18:00',
    daysApplicable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    basePrice: 5.00,
    hourlyRate: 2.50,
    isActive: true,
  },
  {
    id: '2',
    name: 'Standard Weekend',
    slotType: 'standard',
    timeStart: '08:00',
    timeEnd: '18:00',
    daysApplicable: ['Saturday', 'Sunday'],
    basePrice: 7.00,
    hourlyRate: 3.50,
    isActive: true,
  },
  {
    id: '3',
    name: 'Electric Charging',
    slotType: 'electric',
    timeStart: '00:00',
    timeEnd: '23:59',
    daysApplicable: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    basePrice: 8.00,
    hourlyRate: 4.00,
    isActive: true,
  },
];

// Mock Discounts
export const mockDiscounts: Discount[] = [
  {
    id: '1',
    code: 'WELCOME20',
    name: 'New User Discount',
    description: '20% off for new users',
    discountType: 'percentage',
    discountValue: 20,
    validFrom: '2023-05-01',
    validUntil: '2023-06-30',
    isActive: true,
    usageLimit: 100,
    currentUsage: 45,
  },
  {
    id: '2',
    code: 'FLASH10',
    name: 'Flash Sale',
    description: '$10 off for bookings over 3 hours',
    discountType: 'fixed',
    discountValue: 10,
    minBookingHours: 3,
    validFrom: '2023-05-10',
    validUntil: '2023-05-15',
    isActive: true,
    currentUsage: 12,
  },
  {
    id: '3',
    code: 'WEEKEND25',
    name: 'Weekend Special',
    description: '25% off on weekend bookings',
    discountType: 'percentage',
    discountValue: 25,
    validFrom: '2023-05-01',
    validUntil: '2023-12-31',
    isActive: false,
    currentUsage: 0,
  },
];

// Mock Report Data
export const mockReportData: ReportData = {
  dailyRevenue: [150, 175, 120, 200, 180, 250, 210],
  weeklyOccupancy: [65, 70, 55, 80, 85, 90, 75],
  monthlyRevenue: 5250,
  popularSlots: [
    { name: 'A1', bookings: 45 },
    { name: 'B1', bookings: 38 },
    { name: 'C1', bookings: 32 },
    { name: 'A2', bookings: 28 },
    { name: 'B2', bookings: 25 },
  ],
  bookingsOverTime: [
    { date: '2023-05-01', count: 12 },
    { date: '2023-05-02', count: 15 },
    { date: '2023-05-03', count: 10 },
    { date: '2023-05-04', count: 18 },
    { date: '2023-05-05', count: 20 },
    { date: '2023-05-06', count: 25 },
    { date: '2023-05-07', count: 22 },
  ],
  slotUtilization: [
    { name: 'Section A', utilization: 75 },
    { name: 'Section B', utilization: 60 },
    { name: 'Section C', utilization: 80 },
  ],
};
