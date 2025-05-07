'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getProductById } from '../../../services/productService';
import { useAuth } from '../../../hooks/useAuth';
import { getCloudinaryUrl } from '../../../lib/cloudinary';

// Sample data for mockup/demo purposes
const mockProduct = {
  id: "pump1",
  name: "Spectra S1 Plus",
  brandId: "spectra",
  typeId: "electric",
  rentalPrice: 1500,
  depositAmount: 6000,
  featuredImage: "products/spectra-s1-plus",
  imageUrls: ["products/spectra-s1-plus-1", "products/spectra-s1-plus-2", "products/spectra-s1-plus-3"],
  description: "เครื่องปั๊มนมไฟฟ้าแบบคู่ พร้อมแบตเตอรี่ในตัว ปั๊มได้ทั้งในและนอกบ้าน",
  fullDescription: `
    <p>เครื่องปั๊มนม Spectra S1 Plus เป็นเครื่องปั๊มนมไฟฟ้าระบบปิด (Closed System) แบบคู่ ที่มีแบตเตอรี่ในตัว ช่วยให้คุณแม่สามารถปั๊มนมได้ทุกที่ ไม่ว่าจะอยู่ในบ้านหรือนอกบ้าน</p>
    <p>คุณสมบัติเด่น:</p>
    <ul>
      <li>ระบบปิดที่ไม่ให้นมและอากาศเข้าสู่มอเตอร์ ป้องกันการปนเปื้อนของเชื้อแบคทีเรีย</li>
      <li>น้ำหนักเบาเพียง 1 กิโลกรัม พกพาสะดวก</li>
      <li>มีแบตเตอรี่ในตัว ชาร์จเต็มแล้วใช้งานได้ประมาณ 3 ชั่วโมง</li>
      <li>ปรับแรงดูดได้ 12 ระดับ สูงสุด 300 mmHg</li>
      <li>มีโหมดนวดกระตุ้น (Massage Mode) และโหมดปั๊มนม (Expression Mode)</li>
      <li>หน้าจอ LED แสดงระดับแรงดูด โหมดการทำงาน และเวลา</li>
      <li>ทำงานเงียบ ประมาณ 45 dB ไม่รบกวนการนอนของลูกน้อย</li>
    </ul>
    <p>อุปกรณ์ที่มาพร้อมกับการเช่า:</p>
    <ul>
      <li>ตัวเครื่องปั๊มนม Spectra S1 Plus</li>
      <li>สายไฟและอะแดปเตอร์</li>
      <li>ขวดนม 2 ขวด</li>
      <li>กรวยปั๊มนม (Flange) ขนาด 24 mm และ 28 mm</li>
      <li>สายยาง ฝาปิด และอะไหล่อื่นๆ ครบชุด</li>
      <li>กระเป๋าสำหรับใส่เครื่องปั๊มนมและอุปกรณ์</li>
      <li>คู่มือการใช้งานภาษาไทย</li>
    </ul>
  `,
  features: [
    "ระบบปิด (Closed System)",
    "แบตเตอรี่ในตัว",
    "พกพาสะดวก",
    "ปั๊มได้พร้อมกัน 2 ข้าง",
    "ปรับแรงดูดได้ 12 ระดับ",
    "มีหน้าจอ LED",
    "เสียงเงียบ",
    "มีโหมดนวด และโหมดปั๊ม"
  ],
  specifications: {
    brand: "Spectra",
    model: "S1 Plus",
    type: "ไฟฟ้าแบบคู่",
    warranty: "1 ปี",
    weight: "1 กิโลกรัม",
    dimensions: "20 x 15 x 14 ซม.",
    power: "AC/DC (แบตเตอรี่ในตัว)",
    suctionLevels: "12 ระดับ",
    maxSuction: "300 mmHg",
    noiseLevel: "45 dB"
  },
  rentalOptions: [
    { id: 1, duration: 1, unit: "เดือน", price: 1500 },
    { id: 2, duration: 3, unit: "เดือน", price: 4200, discount: 300 },
    { id: 3, duration: 6, unit: "เดือน", price: 7800, discount: 1200 }
  ],
  reviews: [
    {
      id: 1,
      customerName: "คุณแม่มะลิ",
      rating: 5,
      date: "15 มีนาคม 2025",
      comment: "เครื่องดีมาก ใช้งานง่าย เสียงเงียบ ลูกนอนข้างๆ ไม่ตื่น ปั๊มนมได้เยอะขึ้น แนะนำค่ะ!"
    },
    {
      id: 2,
      customerName: "คุณแม่กุ๊กไก่",
      rating: 4,
      date: "2 เมษายน 2025",
      comment: "ใช้งานสะดวก แบตอึดมาก ชาร์จครั้งเดียวใช้ได้ทั้งวัน แต่อยากให้มีถุงเก็บความเย็นมาด้วย"
    }
  ]
};

// Mock brand data
const mockBrand = {
  id: "spectra",
  name: "Spectra",
  logoUrl: "brands/spectra-logo"
};

export default function ProductPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedRentalOption, setSelectedRentalOption] = useState(1);
  const { user, requireAuth } = useAuth();
  const router = useRouter();
  
  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In production, uncomment this to fetch from Firestore
        // const data = await getProductById(id);
        // if (data) {
        //   setProduct(data);
        // }
        
        // For demo, we'll just use the mock data
        setTimeout(() => {
          setProduct(mockProduct);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  const handleBookNow = () => {
    // Check if user is authenticated
    if (!user) {
      // Redirect to login page with return URL
      router.push(`/login?redirect=/products/${id}/booking&rental=${selectedRentalOption}`);
      return;
    }
    
    // Redirect to booking page
    router.push(`/products/${id}/booking?rental=${selectedRentalOption}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">ไม่พบสินค้า</h2>
        <p className="mt-2 text-gray-600">สินค้าที่คุณกำลังค้นหาอาจถูกลบไปแล้วหรือไม่มีอยู่ในระบบ</p>
        <Link href="/products" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
          กลับไปหน้าสินค้าทั้งหมด
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-7xl mx-auto">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <ol className="flex text-sm">
          <li className="mr-2">
            <Link href="/" className="text-gray-500 hover:text-blue-600">หน้าหลัก</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="mr-2">
            <Link href="/products" className="text-gray-500 hover:text-blue-600">สินค้า</Link>
            <span className="mx-2 text-gray-400">/</span>
          </li>
          <li className="text-blue-600">{product.name}</li>
        </ol>
      </nav>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
          {/* Product Images */}
          <div>
            <div className="mb-4 relative h-80 sm:h-96 rounded-lg overflow-hidden">
              {product.imageUrls && product.imageUrls.length > 0 ? (
                <Image
                  src={getCloudinaryUrl(product.imageUrls[selectedImage], { width: 600, height: 600 })}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">ไม่มีรูปภาพ</span>
                </div>
              )}
            </div>
            
            {/* Thumbnail images */}
            {product.imageUrls && product.imageUrls.length > 1 && (
              <div className="flex space-x-4 overflow-x-auto pb-2">
                {product.imageUrls.map((imgUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`relative w-20 h-20 rounded-md overflow-hidden flex-shrink-0 ${
                      selectedImage === index ? 'ring-2 ring-blue-500' : 'ring-1 ring-gray-200'
                    }`}
                  >
                    <Image
                      src={getCloudinaryUrl(imgUrl, { width: 100, height: 100 })}
                      alt={`${product.name} - รูปที่ ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Product Info */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            <div className="flex items-center mb-4">
              <div className="flex mr-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`h-5 w-5 ${
                      star <= 4 ? 'text-yellow-400' : 'text-gray-200'
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 13.66l-5.521 2.917 1.057-6.154L1.024 6.224l6.168-.896L10 0l2.808 5.328 6.168.896-4.512 4.199 1.057 6.154L10 13.66z"
                      clipRule="evenodd"
                    />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">(4.2 คะแนน จาก 12 รีวิว)</span>
            </div>
            
            <p className="text-lg text-gray-700 mb-6">{product.description}</p>
            
            <div className="border-t border-gray-200 py-4">
              <h2 className="font-semibold text-lg mb-2">คุณสมบัติเด่น</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <svg className="h-5 w-5 text-blue-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="border-t border-gray-200 py-6">
              <h2 className="font-semibold text-lg mb-4">แผนเช่า</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                {product.rentalOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setSelectedRentalOption(option.id)}
                    className={`border rounded-lg p-4 text-center transition ${
                      selectedRentalOption === option.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-200'
                    }`}
                  >
                    <p className="font-semibold text-lg">
                      {option.duration} {option.unit}
                    </p>
                    <div className="mt-1">
                      {option.discount ? (
                        <>
                          <p className="text-sm text-gray-500 line-through">
                            ฿{(option.duration * product.rentalPrice).toLocaleString()}
                          </p>
                          <p className="text-blue-600 font-bold">
                            ฿{option.price.toLocaleString()}
                          </p>
                        </>
                      ) : (
                        <p className="text-blue-600 font-bold">
                          ฿{option.price.toLocaleString()}
                        </p>
                      )}
                    </div>
                  </button>
                ))}
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span>ค่ามัดจำ (รับคืนเมื่อส่งคืนสินค้า):</span>
                  <span className="font-semibold">฿{product.depositAmount.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-lg font-bold">
                  <span>ยอดรวมที่ต้องชำระ:</span>
                  <span className="text-blue-600">
                    ฿{(product.depositAmount + product.rentalOptions.find(o => o.id === selectedRentalOption).price).toLocaleString()}
                  </span>
                </div>
              </div>
              
              <button
                onClick={handleBookNow}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition font-semibold text-lg"
              >
                จองเลย
              </button>
            </div>
          </div>
        </div>
        
        {/* Product Details Tabs */}
        <div className="border-t border-gray-200">
          <div className="px-6 py-8">
            <h2 className="text-2xl font-bold mb-6">รายละเอียดสินค้า</h2>
            <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: product.fullDescription }} />
          </div>
          
          {/* Specifications */}
          <div className="px-6 py-8 border-t border-gray-200">
            <h2 className="text-2xl font-bold mb-6">ข้อมูลจำเพาะ</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div key={key} className="flex">
                  <span className="w-1/3 text-gray-500">{key.charAt(0).toUpperCase() + key.slice(1)}:</span>
                  <span className="w-2/3 font-medium">{value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Reviews */}
          <div className="px-6 py-8 border-t border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">รีวิวจากลูกค้า</h2>
              {user && (
                <button className="bg-gray-100 hover:bg-gray-200 text-gray-800 py-2 px-4 rounded-lg transition">
                  เขียนรีวิว
                </button>
              )}
            </div>
            
            {product.reviews && product.reviews.length > 0 ? (
              <div className="space-y-6">
                {product.reviews.map((review) => (
                  <div key={review.id} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center">
                        <div className="flex mr-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <svg
                              key={star}
                              className={`h-4 w-4 ${
                                star <= review.rating ? 'text-yellow-400' : 'text-gray-200'
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M10 13.66l-5.521 2.917 1.057-6.154L1.024 6.224l6.168-.896L10 0l2.808 5.328 6.168.896-4.512 4.199 1.057 6.154L10 13.66z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ))}
                        </div>
                        <span className="font-semibold">{review.customerName}</span>
                      </div>
                      <span className="text-sm text-gray-500">{review.date}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">ยังไม่มีรีวิวสำหรับสินค้านี้</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}