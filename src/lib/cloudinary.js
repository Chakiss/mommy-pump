/**
 * Cloudinary integration for MommyPump
 * Handles image uploads for products, receipts, and reviews
 */

/**
 * Generate a Cloudinary upload signature
 * This should be called from a secure backend function in production
 */
export const generateUploadSignature = (folder, publicId = null) => {
  // This is a simplified version - in production, this should be called from a secure backend
  // to prevent exposing your Cloudinary API secret
  const timestamp = Math.round(new Date().getTime() / 1000);
  
  return {
    timestamp,
    signature: 'GENERATED_SIGNATURE_HERE', // This should come from server
    apiKey: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
    folder
  };
};

/**
 * Get Cloudinary URL for an image with transformations
 */
export const getCloudinaryUrl = (publicId, options = {}) => {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto'
  } = options;
  
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  let transformations = `f_${format},q_${quality}`;
  
  if (width) transformations += `,w_${width}`;
  if (height) transformations += `,h_${height}`;
  if (width || height) transformations += `,c_${crop}`;
  
  return `https://res.cloudinary.com/${cloudName}/image/upload/${transformations}/${publicId}`;
};

/**
 * Upload an image to Cloudinary
 * This uses the frontend SDK which requires a pre-signed signature from the backend
 */
export const uploadImage = async (file, folder = 'products', onProgress = null) => {
  // This is a simplified example - in production use the Cloudinary SDK
  // or implement a more secure approach
  try {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', folder);
    
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData
      }
    );
    
    const data = await response.json();
    
    if (data.error) {
      throw new Error(data.error.message);
    }
    
    return {
      publicId: data.public_id,
      url: data.secure_url,
      format: data.format,
      width: data.width,
      height: data.height
    };
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    throw error;
  }
};