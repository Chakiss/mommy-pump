'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { getCloudinaryUrl } from '../lib/cloudinary';

/**
 * ProductCard component to display product information
 */
export default function ProductCard({ product }) {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  if (!product) return null;

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition duration-300 border border-[#C8E6C9] border-opacity-30">
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square">
          <div className={`absolute inset-0 bg-[#F0FAFA] flex items-center justify-center ${isImageLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <div className="w-8 h-8 border-t-2 border-b-2 border-[#B3E5FC] rounded-full animate-spin"></div>
          </div>
          
          {product.featuredImage ? (
            <Image
              src={getCloudinaryUrl(product.featuredImage, { width: 400, height: 400 })}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-opacity duration-300 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
              onLoadingComplete={() => setIsImageLoaded(true)}
            />
          ) : (
            <div className="absolute inset-0 bg-[#F0FAFA] flex items-center justify-center">
              <span className="text-[#78909C]">ไม่มีรูปภาพ</span>
            </div>
          )}
        </div>
        
        <div className="p-6 font-['Sarabun','Poppins',sans-serif]">
          <h3 className="text-lg font-semibold text-[#37474F] mb-1">{product.name}</h3>
          <p className="text-[#78909C] text-sm mb-2 line-clamp-2">{product.description}</p>
          
          <div className="flex items-center justify-between mt-auto">
            <div>
              <p className="text-[#37474F] font-bold">฿{product.rentalPrice.toLocaleString()}/เดือน</p>
              {product.depositAmount > 0 && (
                <p className="text-xs text-[#78909C]">มัดจำ ฿{product.depositAmount.toLocaleString()}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <span className="text-[#A5D6A7]">★</span>
              <span className="text-sm text-[#37474F]">4.5</span>
              <span className="text-xs text-[#78909C]">(12)</span>
            </div>
          </div>
          
          <div className="mt-4 flex justify-between items-center">
            <div className="flex flex-wrap gap-1">
              {product.typeId && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#B3E5FC] bg-opacity-30 text-[#37474F]">
                  {product.typeId === 'electric' && 'ไฟฟ้า'}
                  {product.typeId === 'hospital' && 'โรงพยาบาล'}
                  {product.typeId === 'portable' && 'พกพา'}
                  {product.typeId === 'wearable' && 'สวมใส่'}
                  {product.typeId === 'manual' && 'ใช้มือ'}
                </span>
              )}
              
              {product.brandId && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#F0FAFA] text-[#37474F]">
                  {product.brandId}
                </span>
              )}
            </div>
            
            <button className="text-[#A5D6A7] hover:text-[#37474F] text-sm font-medium transition duration-300">
              ดูรายละเอียด
            </button>
          </div>
        </div>
      </Link>
    </div>
  );
}