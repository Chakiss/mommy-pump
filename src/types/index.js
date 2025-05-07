/**
 * MommyPump Data Types
 * Types defined according to BRD data models
 */

/**
 * User type from Firebase Auth
 */
export const USER_ROLES = {
  CUSTOMER: 'customer',
  ADMIN: 'admin',
};

/**
 * Product related types
 */
export const PRODUCT_STATUS = {
  AVAILABLE: 'available',
  UNAVAILABLE: 'unavailable',
  RENTED: 'rented',
};

/**
 * Booking status types
 */
export const BOOKING_STATUS = {
  PENDING: 'pending',       // รอตรวจสอบ
  CONFIRMED: 'confirmed',   // ยืนยันแล้ว
  DELIVERED: 'delivered',   // ส่งมอบแล้ว
  RETURNED: 'returned',     // คืนแล้ว
  CANCELLED: 'cancelled',   // ยกเลิก
};

/**
 * Review rating range
 */
export const RATING_RANGE = [1, 2, 3, 4, 5];