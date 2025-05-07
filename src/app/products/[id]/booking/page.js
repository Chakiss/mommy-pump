'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '../../../../hooks/useAuth';
import { getProductById } from '../../../../services/productService';
import { createBooking } from '../../../../services/bookingService';
import { uploadImage } from '../../../../lib/cloudinary';
import { getCloudinaryUrl } from '../../../../lib/cloudinary';

// Sample data for mockup/demo purposes - in production this would come from Firebase
const mockProduct = {
  id: "pump1",
  name: "Spectra S1 Plus",
  brandId: "spectra",
  typeId: "electric",
  rentalPrice: 1500,
  depositAmount: 6000,
  featuredImage: "products/spectra-s1-plus",
  imageUrls: ["products/spectra-s1-plus-1"],
  description: "เครื่องปั๊มนมไฟฟ้าแบบคู่ พร้อมแบตเตอรี่ในตัว ปั๊มได้ทั้งในและนอกบ้าน",
  rentalOptions: [
    { id: 1, duration: 1, unit: "เดือน", price: 1500 },
    { id: 2, duration: 3, unit: "เดือน", price: 4200, discount: 300 },
    { id: 3, duration: 6, unit: "เดือน", price: 7800, discount: 1200 }
  ]
};

export default function BookingPage({ params }) {
  const { id } = params;
  const router = useRouter();
  const searchParams = useSearchParams();
  const rentalOptionId = parseInt(searchParams.get('rental') || '1');
  
  const [step, setStep] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedRental, setSelectedRental] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    district: '',
    province: '',
    postalCode: '',
    lineId: '',
    startDate: '',
    notes: ''
  });
  const [receipt, setReceipt] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState('');
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingId, setBookingId] = useState('');

  const { user, customer, isCustomerLoading } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!user && !isCustomerLoading) {
      router.push(`/login?redirect=/products/${id}/booking&rental=${rentalOptionId}`);
    }
  }, [user, isCustomerLoading, router, id, rentalOptionId]);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // In production, uncomment this to fetch from Firestore
        // const data = await getProductById(id);
        // if (data) {
        //   setProduct(data);
        //   const option = data.rentalOptions.find(o => o.id === rentalOptionId) || data.rentalOptions[0];
        //   setSelectedRental(option);
        // }
        
        // For demo, we'll just use the mock data
        setTimeout(() => {
          setProduct(mockProduct);
          const option = mockProduct.rentalOptions.find(o => o.id === rentalOptionId) || mockProduct.rentalOptions[0];
          setSelectedRental(option);
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching product:", error);
        setLoading(false);
        setError('ไม่สามารถโหลดข้อมูลสินค้าได้ กรุณาลองใหม่อีกครั้ง');
      }
    };
    
    fetchProduct();
  }, [id, rentalOptionId]);

  // Pre-fill form with customer data if available
  useEffect(() => {
    if (customer) {
      setFormData(prev => ({
        ...prev,
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        district: customer.district || '',
        province: customer.province || '',
        postalCode: customer.postalCode || '',
        lineId: customer.lineId || ''
      }));
    }
  }, [customer]);

  // Set default start date (tomorrow)
  useEffect(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const formattedDate = tomorrow.toISOString().split('T')[0];
    
    setFormData(prev => ({
      ...prev,
      startDate: formattedDate
    }));
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle receipt file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('ขนาดไฟล์ต้องไม่เกิน 5MB');
        return;
      }
      
      setReceipt(file);
      setReceiptPreview(URL.createObjectURL(file));
    }
  };

  // Calculate end date based on start date and rental period
  const calculateEndDate = () => {
    if (!formData.startDate || !selectedRental) return '';
    
    const startDate = new Date(formData.startDate);
    const endDate = new Date(startDate);
    
    endDate.setMonth(endDate.getMonth() + selectedRental.duration);
    
    return endDate.toISOString().split('T')[0];
  };
  
  // Handle step navigation
  const nextStep = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  
  const prevStep = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  // Handle booking submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!receipt) {
      setError('กรุณาอัปโหลดสลิปการชำระเงิน');
      return;
    }
    
    if (!formData.startDate) {
      setError('กรุณาเลือกวันที่ต้องการรับสินค้า');
      return;
    }
    
    try {
      setUploadingReceipt(true);
      
      // Upload the receipt to Cloudinary
      const receiptData = await uploadImage(receipt, 'receipts');
      
      // Prepare booking data
      const bookingData = {
        customerId: customer?.id || user.uid,
        productId: product.id,
        startDate: new Date(formData.startDate),
        endDate: new Date(calculateEndDate()),
        rentalOptionId: selectedRental.id,
        rentalDuration: selectedRental.duration,
        totalAmount: selectedRental.price + product.depositAmount,
        receiptUrl: receiptData.publicId,
        address: `${formData.address}, ${formData.district}, ${formData.province}, ${formData.postalCode}`,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerEmail: formData.email,
        customerLineId: formData.lineId,
        notes: formData.notes
      };
      
      // Create booking in Firestore
      // In production, use the real Firestore service
      // const bookingId = await createBooking(bookingData);
      
      // For demo, simulate success
      setTimeout(() => {
        setUploadingReceipt(false);
        setBookingSuccess(true);
        setBookingId('BOOK' + Math.floor(100000 + Math.random() * 900000)); // Mock ID
        nextStep();
      }, 1500);
      
    } catch (error) {
      console.error("Error creating booking:", error);
      setError('เกิดข้อผิดพลาดในการสร้างคำสั่งจอง กรุณาลองใหม่อีกครั้ง');
      setUploadingReceipt(false);
    }
  };
  
  if (loading || isCustomerLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900">ไม่พบสินค้า</h2>
        <p className="mt-2 text-gray-600">สินค้าที่คุณกำลังจองอาจถูกลบไปแล้วหรือไม่มีอยู่ในระบบ</p>
        <Link href="/products" className="mt-6 inline-block bg-blue-600 text-white px-4 py-2 rounded-md">
          กลับไปหน้าสินค้าทั้งหมด
        </Link>
      </div>
    );
  }
  
  return (
    <div className="max-w-3xl mx-auto">
      {/* Booking Steps */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {[1, 2, 3].map((stepNum) => (
            <div
              key={stepNum}
              className={`flex flex-col items-center ${
                stepNum < step ? 'text-blue-600' : stepNum === step ? 'text-blue-600' : 'text-gray-400'
              }`}
            >
              <div
                className={`w-10 h-10 flex items-center justify-center rounded-full mb-2 ${
                  stepNum < step
                    ? 'bg-blue-600 text-white'
                    : stepNum === step
                    ? 'border-2 border-blue-600 text-blue-600'
                    : 'border-2 border-gray-300 text-gray-400'
                }`}
              >
                {stepNum < step ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  stepNum
                )}
              </div>
              <span className="text-sm font-medium">
                {stepNum === 1 ? 'ข้อมูลการจัดส่ง' : stepNum === 2 ? 'การชำระเงิน' : 'เสร็จสิ้น'}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-4 h-1 bg-gray-200 relative">
          <div
            className="absolute top-0 left-0 h-full bg-blue-600"
            style={{ width: `${((step - 1) / 2) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {/* Step 1: Delivery Information */}
        {step === 1 && (
          <div className="p-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">ข้อมูลการจัดส่ง</h1>
              <p className="text-gray-600">กรุณากรอกข้อมูลให้ครบถ้วนเพื่อการจัดส่งที่รวดเร็ว</p>
            </div>
            
            <form>
              {/* Product Summary */}
              <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="relative h-20 w-20 rounded-md overflow-hidden mr-4">
                    <Image
                      src={getCloudinaryUrl(product.featuredImage, { width: 80, height: 80 })}
                      alt={product.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{product.name}</h3>
                    <div className="text-sm text-gray-600 mt-1">
                      <span>{selectedRental.duration} {selectedRental.unit}</span>
                      <span className="mx-2">•</span>
                      <span className="font-medium text-blue-600">฿{selectedRental.price.toLocaleString()}</span>
                      <span className="mx-1">+</span>
                      <span className="text-gray-600">มัดจำ ฿{product.depositAmount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    ชื่อ-นามสกุล <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    เบอร์โทรศัพท์ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    อีเมล
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                
                {/* Line ID */}
                <div>
                  <label htmlFor="lineId" className="block text-sm font-medium text-gray-700 mb-1">
                    LINE ID (ถ้ามี)
                  </label>
                  <input
                    type="text"
                    id="lineId"
                    name="lineId"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.lineId}
                    onChange={handleChange}
                  />
                </div>
              </div>
              
              {/* Address */}
              <div className="mb-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                  ที่อยู่ <span className="text-red-600">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.address}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {/* District */}
                <div>
                  <label htmlFor="district" className="block text-sm font-medium text-gray-700 mb-1">
                    เขต/อำเภอ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="district"
                    name="district"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.district}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Province */}
                <div>
                  <label htmlFor="province" className="block text-sm font-medium text-gray-700 mb-1">
                    จังหวัด <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="province"
                    name="province"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.province}
                    onChange={handleChange}
                    required
                  />
                </div>
                
                {/* Postal Code */}
                <div>
                  <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                    รหัสไปรษณีย์ <span className="text-red-600">*</span>
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.postalCode}
                    onChange={handleChange}
                    maxLength={5}
                    required
                  />
                </div>
              </div>
              
              {/* Rental Date */}
              <div className="mb-6">
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                  วันที่ต้องการรับสินค้า <span className="text-red-600">*</span>
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="date"
                      id="startDate"
                      name="startDate"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      min={new Date().toISOString().split('T')[0]}
                      value={formData.startDate}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div>
                    <input
                      type="date"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-100 text-gray-600"
                      value={calculateEndDate()}
                      disabled
                    />
                  </div>
                </div>
                <p className="mt-1 text-sm text-gray-600">
                  ระยะเวลาเช่า {selectedRental.duration} {selectedRental.unit} (รวมวันส่งคืนสินค้า)
                </p>
              </div>
              
              {/* Notes */}
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  หมายเหตุ (ถ้ามี)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="เช่น เวลาที่สะดวกให้ส่งของ, คำแนะนำเพิ่มเติม"
                ></textarea>
              </div>
              
              <div className="flex justify-between mt-8">
                <Link href={`/products/${id}`} className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                  กลับไป
                </Link>
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  ไปชำระเงิน
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Step 2: Payment */}
        {step === 2 && (
          <div className="p-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h1 className="text-2xl font-bold text-gray-900 mb-1">การชำระเงิน</h1>
              <p className="text-gray-600">โอนเงินและอัปโหลดสลิปเพื่อยืนยันการจอง</p>
            </div>
            
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">รายละเอียดการชำระเงิน</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Payment Amount */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">ยอดชำระทั้งหมด</h3>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่าเช่า ({selectedRental.duration} {selectedRental.unit})</span>
                      <span>฿{selectedRental.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ค่ามัดจำ (รับคืนเมื่อส่งคืนสินค้า)</span>
                      <span>฿{product.depositAmount.toLocaleString()}</span>
                    </div>
                  </div>
                  
                  <div className="border-t border-gray-300 pt-2">
                    <div className="flex justify-between text-lg font-bold">
                      <span>รวมทั้งสิ้น</span>
                      <span className="text-blue-600">฿{(selectedRental.price + product.depositAmount).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
                
                {/* Bank Account */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="font-medium text-gray-700 mb-2">ช่องทางการชำระเงิน</h3>
                  
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold">SCB</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">ธนาคารไทยพาณิชย์</p>
                      <p className="text-gray-600 text-sm">123-4-56789-0</p>
                      <p className="text-gray-600 text-sm">บริษัท มัมมี่ปั๊ม จำกัด</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-md flex items-center justify-center mr-3">
                      <span className="text-blue-600 font-bold">ธ</span>
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium">พร้อมเพย์</p>
                      <p className="text-gray-600 text-sm">0-1234-56789-0</p>
                      <p className="text-gray-600 text-sm">บริษัท มัมมี่ปั๊ม จำกัด</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <form onSubmit={handleSubmit}>
              {/* Receipt Upload */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">อัปโหลดสลิป</h2>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center">
                  {receiptPreview ? (
                    <div className="relative w-full max-w-md">
                      <img
                        src={receiptPreview}
                        alt="สลิปการโอนเงิน"
                        className="w-full h-auto rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          setReceipt(null);
                          setReceiptPreview('');
                        }}
                        className="absolute top-2 right-2 bg-white rounded-full p-2 shadow"
                      >
                        <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ) : (
                    <>
                      <svg className="w-12 h-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1}
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                      <p className="text-gray-600 mb-2">คลิกเพื่ออัปโหลดสลิปการโอนเงิน</p>
                      <p className="text-sm text-gray-500 mb-4">PNG, JPG หรือ GIF (ขนาดไฟล์สูงสุด 5MB)</p>
                      <label className="bg-white border border-gray-300 rounded-md py-2 px-4 text-sm text-gray-700 font-medium cursor-pointer hover:bg-gray-50">
                        เลือกรูปภาพ
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                      </label>
                    </>
                  )}
                </div>
              </div>
              
              {/* Error message */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  onClick={prevStep}
                  className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  กลับไป
                </button>
                <button
                  type="submit"
                  disabled={uploadingReceipt}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {uploadingReceipt ? 'กำลังสร้างคำสั่งจอง...' : 'ยืนยันการจอง'}
                </button>
              </div>
            </form>
          </div>
        )}
        
        {/* Step 3: Success */}
        {step === 3 && (
          <div className="p-6 text-center">
            <div className="mb-6">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">จองสำเร็จแล้ว!</h1>
              <p className="text-gray-600">
                คำสั่งจองของคุณได้รับการยืนยันแล้ว เราจะติดต่อกลับโดยเร็วที่สุด
              </p>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6 mb-6 inline-block">
              <p className="text-gray-700 mb-1">รหัสคำสั่งจอง</p>
              <p className="text-xl font-bold text-blue-600">{bookingId}</p>
            </div>
            
            <div className="mb-8 max-w-md mx-auto">
              <h3 className="font-semibold text-left mb-2">ขั้นตอนต่อไป</h3>
              <ul className="text-left text-gray-700 space-y-2">
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">1.</span>
                  <span>ทีมงานของเราจะตรวจสอบการชำระเงินและยืนยันการจองภายใน 24 ชั่วโมง</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">2.</span>
                  <span>เราจะติดต่อคุณผ่านทางโทรศัพท์หรือ LINE เพื่อยืนยันวันเวลาในการจัดส่ง</span>
                </li>
                <li className="flex items-start">
                  <span className="text-blue-600 mr-2">3.</span>
                  <span>ตรวจสอบสถานะการจองได้ที่หน้า "คำสั่งจองของฉัน" ในบัญชีของคุณ</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <Link href="/account/bookings" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                ดูคำสั่งจองของฉัน
              </Link>
              <Link href="/" className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-50">
                กลับไปหน้าหลัก
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}