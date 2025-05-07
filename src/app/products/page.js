'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProductCard from '../../components/ProductCard';
import { getAllProducts } from '../../services/productService';

/**
 * Sample data for mockup/demo purposes
 * Will be replaced with real data from Firestore
 */
const mockProducts = [
  {
    id: "pump1",
    name: "Spectra S1 Plus",
    brandId: "spectra",
    typeId: "electric",
    rentalPrice: 1500,
    depositAmount: 6000,
    featuredImage: "products/spectra-s1-plus",
    imageUrls: ["products/spectra-s1-plus"],
    description: "เครื่องปั๊มนมไฟฟ้าแบบคู่ พร้อมแบตเตอรี่ในตัว ปั๊มได้ทั้งในและนอกบ้าน"
  },
  {
    id: "pump2",
    name: "Medela Symphony",
    brandId: "medela",
    typeId: "hospital",
    rentalPrice: 2200,
    depositAmount: 9000,
    featuredImage: "products/medela-symphony",
    imageUrls: ["products/medela-symphony"],
    description: "เครื่องปั๊มนมระดับโรงพยาบาล กระตุ้นการสร้างน้ำนมได้ดีเยี่ยม เหมาะกับคุณแม่ที่มีปัญหาน้ำนมน้อย"
  },
  {
    id: "pump3",
    name: "Elvie Stride",
    brandId: "elvie",
    typeId: "wearable",
    rentalPrice: 1800,
    depositAmount: 7500,
    featuredImage: "products/elvie-stride",
    imageUrls: ["products/elvie-stride"],
    description: "เครื่องปั๊มนมแบบสวมใส่ ไร้สาย ไม่มีสายรบกวน ปั๊มนมได้อย่างอิสระ ไร้การมองเห็น"
  },
  {
    id: "pump4",
    name: "Spectra S9 Plus",
    brandId: "spectra",
    typeId: "portable",
    rentalPrice: 1200,
    depositAmount: 5000,
    featuredImage: "products/spectra-s9-plus",
    imageUrls: ["products/spectra-s9-plus"],
    description: "เครื่องปั๊มนมไฟฟ้าขนาดเล็ก พกพาง่าย น้ำหนักเบา เหมาะสำหรับคุณแม่ที่ต้องเดินทาง"
  },
  {
    id: "pump5",
    name: "Medela Freestyle Flex",
    brandId: "medela",
    typeId: "portable",
    rentalPrice: 1600,
    depositAmount: 6500,
    featuredImage: "products/medela-freestyle",
    imageUrls: ["products/medela-freestyle"],
    description: "เครื่องปั๊มนมไฟฟ้าแบบพกพา น้ำหนักเบา ชาร์จไฟได้ เชื่อมต่อกับแอพมือถือได้"
  },
  {
    id: "pump6",
    name: "Haakaa Silicone Breast Pump",
    brandId: "haakaa",
    typeId: "manual",
    rentalPrice: 300,
    depositAmount: 1200,
    featuredImage: "products/haakaa",
    imageUrls: ["products/haakaa"],
    description: "ที่ปั๊มนมซิลิโคนแบบพกพา ใช้แรงดูดอัตโนมัติ ไม่ต้องใช้ไฟฟ้า สะดวกพกพา"
  }
];

/**
 * Mock brands data
 */
const mockBrands = [
  { id: "all", name: "ทั้งหมด" },
  { id: "spectra", name: "Spectra" },
  { id: "medela", name: "Medela" },
  { id: "elvie", name: "Elvie" },
  { id: "haakaa", name: "Haakaa" }
];

/**
 * Mock product types
 */
const mockTypes = [
  { id: "all", name: "ทั้งหมด" },
  { id: "electric", name: "ไฟฟ้าธรรมดา" },
  { id: "hospital", name: "ระดับโรงพยาบาล" },
  { id: "portable", name: "พกพาได้" },
  { id: "wearable", name: "แบบสวมใส่" },
  { id: "manual", name: "ปั๊มด้วยมือ" }
];

export default function ProductsPage() {
  const [products, setProducts] = useState(mockProducts);
  const [loading, setLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedType, setSelectedType] = useState("all");
  const [sortOrder, setSortOrder] = useState("popularity");

  // In a real app, fetch products from Firestore
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // In production, uncomment this to fetch from Firestore
        // const data = await getAllProducts();
        // setProducts(data);
        
        // For demo, we'll just use the mock data
        // But simulate a loading state
        setTimeout(() => {
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on selected brand and type
  const filteredProducts = products.filter(product => {
    const matchesBrand = selectedBrand === "all" || product.brandId === selectedBrand;
    const matchesType = selectedType === "all" || product.typeId === selectedType;
    return matchesBrand && matchesType;
  });

  // Sort products based on selected sort order
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOrder) {
      case "price-low":
        return a.rentalPrice - b.rentalPrice;
      case "price-high":
        return b.rentalPrice - a.rentalPrice;
      case "popularity":
      default:
        // For demo purposes, we'll just use the default order
        return 0;
    }
  });

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">เครื่องปั๊มนมให้เช่า</h1>
        <p className="text-lg text-gray-600">
          เลือกเครื่องปั๊มนมคุณภาพดีที่เหมาะสมกับความต้องการของคุณแม่
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Brand Filter */}
          <div>
            <label htmlFor="brand" className="block text-sm font-medium text-gray-700 mb-1">
              แบรนด์
            </label>
            <select
              id="brand"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {mockBrands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.name}
                </option>
              ))}
            </select>
          </div>

          {/* Type Filter */}
          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
              ประเภทเครื่องปั๊มนม
            </label>
            <select
              id="type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              {mockTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label htmlFor="sort" className="block text-sm font-medium text-gray-700 mb-1">
              เรียงตาม
            </label>
            <select
              id="sort"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="popularity">ยอดนิยม</option>
              <option value="price-low">ราคา: ต่ำ-สูง</option>
              <option value="price-high">ราคา: สูง-ต่ำ</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : sortedProducts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {sortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">ไม่พบสินค้าที่คุณกำลังค้นหา</h3>
          <p className="text-gray-600">
            โปรดลองเปลี่ยนตัวกรองการค้นหาของคุณเพื่อดูผลลัพธ์เพิ่มเติม
          </p>
        </div>
      )}
    </div>
  );
}