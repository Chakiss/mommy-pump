'use client';

import { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth as useAuthContext } from '../context/AuthContext';
import { getCustomerByUserId, createCustomer } from '../services/customerService';

/**
 * Custom hook for authentication functionality
 * Extends the basic auth context with customer data and routing
 */
export function useAuth() {
  const auth = useAuthContext();
  const router = useRouter();
  const [customer, setCustomer] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch customer data when the user is logged in
  useEffect(() => {
    const fetchCustomerData = async () => {
      if (auth.user && !auth.loading) {
        setIsLoading(true);
        try {
          // Try to get existing customer profile
          const customerData = await getCustomerByUserId(auth.user.uid);
          
          if (customerData) {
            setCustomer(customerData);
          } else {
            // Create new customer profile if it doesn't exist
            const defaultCustomerData = {
              userId: auth.user.uid,
              name: auth.user.displayName || '',
              email: auth.user.email || '',
              phoneNumber: auth.user.phoneNumber || '',
              photoURL: auth.user.photoURL || null
            };
            
            const customerId = await createCustomer(defaultCustomerData);
            const newCustomerData = await getCustomerByUserId(auth.user.uid);
            setCustomer(newCustomerData);
          }
        } catch (error) {
          console.error("Error fetching customer data:", error);
        }
        
        setIsLoading(false);
      } else if (!auth.user && !auth.loading) {
        setCustomer(null);
        setIsLoading(false);
      }
    };
    
    fetchCustomerData();
  }, [auth.user, auth.loading]);
  
  /**
   * Require authentication for protected pages
   */
  const requireAuth = (redirectUrl = '/login') => {
    // If user is not authenticated and not loading, redirect to login
    if (!auth.user && !auth.loading && !isLoading) {
      router.push(redirectUrl);
      return false;
    }
    
    return true;
  };
  
  /**
   * Check if the current user is an admin
   */
  const isAdmin = () => {
    // This is a simplified check - in a real app, you'd check custom claims or roles in Firestore
    // For Firebase, you can set custom claims via Firebase Admin SDK
    return auth.user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  };
  
  /**
   * Redirect already authenticated users
   */
  const redirectIfAuthenticated = (redirectUrl = '/') => {
    if (auth.user && !auth.loading && !isLoading) {
      router.push(redirectUrl);
      return true;
    }
    
    return false;
  };

  return {
    ...auth,
    customer,
    isCustomerLoading: isLoading,
    requireAuth,
    redirectIfAuthenticated,
    isAdmin
  };
}