import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  addDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BOOKING_STATUS } from '../types';

/**
 * Create a new booking
 */
export const createBooking = async (bookingData) => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const newBookingData = {
      ...bookingData,
      status: BOOKING_STATUS.PENDING,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(bookingsRef, newBookingData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating booking:", error);
    throw error;
  }
};

/**
 * Get booking by ID
 */
export const getBookingById = async (bookingId) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    const bookingDoc = await getDoc(bookingRef);
    
    if (!bookingDoc.exists()) {
      return null;
    }
    
    return {
      id: bookingDoc.id,
      ...bookingDoc.data()
    };
  } catch (error) {
    console.error(`Error fetching booking with id ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Get bookings by customer ID
 */
export const getCustomerBookings = async (customerId) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('customerId', '==', customerId),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching bookings for customer ${customerId}:`, error);
    throw error;
  }
};

/**
 * Update booking status
 */
export const updateBookingStatus = async (bookingId, status, notes = null) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    const updateData = {
      status,
      updatedAt: Timestamp.now()
    };
    
    if (notes) {
      updateData.notes = notes;
    }
    
    await updateDoc(bookingRef, updateData);
    
    return true;
  } catch (error) {
    console.error(`Error updating booking status for booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Update booking receipt URL
 */
export const updateBookingReceiptUrl = async (bookingId, receiptUrl) => {
  try {
    const bookingRef = doc(db, 'bookings', bookingId);
    
    await updateDoc(bookingRef, {
      receiptUrl,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating receipt URL for booking ${bookingId}:`, error);
    throw error;
  }
};

/**
 * Get all bookings (admin only)
 */
export const getAllBookings = async () => {
  try {
    const bookingsRef = collection(db, 'bookings');
    const q = query(bookingsRef, orderBy('createdAt', 'desc'));
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    throw error;
  }
};

/**
 * Get bookings by status (admin only)
 */
export const getBookingsByStatus = async (status) => {
  try {
    const q = query(
      collection(db, 'bookings'),
      where('status', '==', status),
      orderBy('createdAt', 'desc')
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching bookings with status ${status}:`, error);
    throw error;
  }
};