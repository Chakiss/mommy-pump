import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  updateDoc,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';

/**
 * Get customer by user ID (Firebase Auth)
 */
export const getCustomerByUserId = async (userId) => {
  try {
    const q = query(
      collection(db, 'customers'), 
      where('userId', '==', userId)
    );
    
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    // Should only have one customer per userId
    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data()
    };
  } catch (error) {
    console.error(`Error fetching customer with userId ${userId}:`, error);
    throw error;
  }
};

/**
 * Get customer by ID
 */
export const getCustomerById = async (customerId) => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    const customerDoc = await getDoc(customerRef);
    
    if (!customerDoc.exists()) {
      return null;
    }
    
    return {
      id: customerDoc.id,
      ...customerDoc.data()
    };
  } catch (error) {
    console.error(`Error fetching customer with id ${customerId}:`, error);
    throw error;
  }
};

/**
 * Create a new customer
 */
export const createCustomer = async (customerData) => {
  try {
    // Check if customer already exists with the same userId
    if (customerData.userId) {
      const existingCustomer = await getCustomerByUserId(customerData.userId);
      
      if (existingCustomer) {
        return existingCustomer.id;
      }
    }
    
    const customersRef = collection(db, 'customers');
    const newCustomerData = {
      ...customerData,
      createdAt: Timestamp.now()
    };
    
    const docRef = await addDoc(customersRef, newCustomerData);
    return docRef.id;
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

/**
 * Update customer information
 */
export const updateCustomer = async (customerId, customerData) => {
  try {
    const customerRef = doc(db, 'customers', customerId);
    
    await updateDoc(customerRef, {
      ...customerData,
      updatedAt: Timestamp.now()
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating customer with id ${customerId}:`, error);
    throw error;
  }
};

/**
 * Get all customers (admin only)
 */
export const getAllCustomers = async () => {
  try {
    const customersRef = collection(db, 'customers');
    const snapshot = await getDocs(customersRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching all customers:", error);
    throw error;
  }
};