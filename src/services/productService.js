import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  query, 
  where,
  orderBy,
  limit,
  addDoc,
  updateDoc,
  deleteDoc
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { PRODUCT_STATUS } from '../types';

/**
 * Get all products
 */
export const getAllProducts = async () => {
  try {
    const productsRef = collection(db, 'products');
    const snapshot = await getDocs(productsRef);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    const productDoc = await getDoc(productRef);
    
    if (!productDoc.exists()) {
      return null;
    }
    
    return {
      id: productDoc.id,
      ...productDoc.data()
    };
  } catch (error) {
    console.error(`Error fetching product with id ${productId}:`, error);
    throw error;
  }
};

/**
 * Get products by type
 */
export const getProductsByType = async (typeId) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('typeId', '==', typeId),
      where('status', '==', PRODUCT_STATUS.AVAILABLE)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching products with type ${typeId}:`, error);
    throw error;
  }
};

/**
 * Get products by brand
 */
export const getProductsByBrand = async (brandId) => {
  try {
    const q = query(
      collection(db, 'products'),
      where('brandId', '==', brandId),
      where('status', '==', PRODUCT_STATUS.AVAILABLE)
    );
    
    const snapshot = await getDocs(q);
    
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error(`Error fetching products with brand ${brandId}:`, error);
    throw error;
  }
};

/**
 * Create a new product (admin only)
 */
export const createProduct = async (productData) => {
  try {
    const productsRef = collection(db, 'products');
    const docRef = await addDoc(productsRef, {
      ...productData,
      status: PRODUCT_STATUS.AVAILABLE,
      createdAt: new Date()
    });
    
    return docRef.id;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

/**
 * Update a product (admin only)
 */
export const updateProduct = async (productId, productData) => {
  try {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, {
      ...productData,
      updatedAt: new Date()
    });
    
    return true;
  } catch (error) {
    console.error(`Error updating product with id ${productId}:`, error);
    throw error;
  }
};

/**
 * Delete a product (admin only)
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
    
    return true;
  } catch (error) {
    console.error(`Error deleting product with id ${productId}:`, error);
    throw error;
  }
};