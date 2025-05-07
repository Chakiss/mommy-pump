import Image from "next/image";
import Link from "next/link";
import ProductCard from "../components/ProductCard";

/**
 * Sample data for mockup/demo purposes
 * Will be replaced with real data from Firestore
 */
const featuredProducts = [
  {
    id: "pump1",
    name: "Spectra S1 Plus",
    brandId: "spectra",
    rentalPrice: 1500,
    depositAmount: 6000,
    featuredImage: "products/spectra-s1-plus",
    imageUrls: ["products/spectra-s1-plus"],
  },
  {
    id: "pump2",
    name: "Medela Symphony",
    brandId: "medela",
    rentalPrice: 2200,
    depositAmount: 9000,
    featuredImage: "products/medela-symphony",
    imageUrls: ["products/medela-symphony"],
  },
  {
    id: "pump3",
    name: "Elvie Stride",
    brandId: "elvie",
    rentalPrice: 1800,
    depositAmount: 7500,
    featuredImage: "products/elvie-stride",
    imageUrls: ["products/elvie-stride"],
  },
];

/**
 * Homepage component
 */
export default function Home() {
  return (
    <div className="space-y-16 font-['Sarabun','Poppins',sans-serif] text-[#37474F]">
      {/* Hero Section */}
      <section className="relative bg-[#F0FAFA] rounded-3xl overflow-hidden shadow-sm">
        <div className="max-w-7xl mx-auto py-20 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 md:pr-12 mb-10 md:mb-0">
            <h1 className="text-4xl font-bold text-[#37474F] mb-6">
              เช่าเครื่องปั๊มนมคุณภาพดี
              <br />
              ส่งถึงบ้าน
            </h1>
            <p className="text-lg text-[#78909C] mb-8">
              บริการเช่าเครื่องปั๊มนมสำหรับคุณแม่มือใหม่ ด้วยอุปกรณ์คุณภาพสูง ฆ่าเชื้อปลอดภัย พร้อมคำแนะนำจากผู้เชี่ยวชาญ
            </p>
            <Link
              href="/products"
              className="inline-block bg-[#A5D6A7] hover:bg-opacity-90 text-[#37474F] font-semibold py-3 px-8 rounded-full transition duration-300 shadow-sm"
            >
              ดูเครื่องปั๊มนมทั้งหมด
            </Link>
          </div>
          <div className="md:w-1/2 relative">
            <div className="relative h-72 md:h-96 w-full">
              <Image
                src="/hero-image.jpg"
                alt="คุณแม่กับเด็กทารก"
                layout="fill"
                objectFit="cover"
                className="rounded-2xl shadow-sm"
                priority
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#37474F] mb-10 text-center">
            เครื่องปั๊มนมยอดนิยม
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              href="/products"
              className="inline-block border border-[#B3E5FC] text-[#37474F] bg-[#F0FAFA] hover:bg-[#B3E5FC] hover:bg-opacity-20 font-semibold py-3 px-10 rounded-full transition duration-300 shadow-sm"
            >
              ดูเครื่องปั๊มนมทั้งหมด
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-[#F0FAFA] py-20 rounded-3xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#37474F] mb-14">
            วิธีการเช่า
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#C8E6C9] border-opacity-50">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#B3E5FC] bg-opacity-40 text-[#37474F] text-xl font-bold mb-6">
                1
              </div>
              <h3 className="text-xl font-bold mb-4">เลือกเครื่องปั๊มนม</h3>
              <p className="text-[#78909C]">
                เลือกเครื่องปั๊มนมที่เหมาะกับความต้องการของคุณ
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#C8E6C9] border-opacity-50">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#B3E5FC] bg-opacity-40 text-[#37474F] text-xl font-bold mb-6">
                2
              </div>
              <h3 className="text-xl font-bold mb-4">กรอกข้อมูลและชำระเงิน</h3>
              <p className="text-[#78909C]">
                กรอกข้อมูลส่วนตัวและอัปโหลดสลิปการชำระเงิน
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm text-center border border-[#C8E6C9] border-opacity-50">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-[#B3E5FC] bg-opacity-40 text-[#37474F] text-xl font-bold mb-6">
                3
              </div>
              <h3 className="text-xl font-bold mb-4">รับเครื่องปั๊มนมที่บ้าน</h3>
              <p className="text-[#78909C]">
                เราจัดส่งอุปกรณ์พร้อมคำแนะนำถึงบ้านคุณ
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-[#37474F] mb-14">
            คุณแม่พูดถึงเรา
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {/* Testimonial 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#C8E6C9] border-opacity-30">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-[#B3E5FC] bg-opacity-20 mr-4">
                  <Image
                    src="/avatar1.jpg"
                    alt="รีวิวจากคุณแม่"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#37474F]">คุณแม่นิดา</p>
                  <div className="flex text-[#A5D6A7]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-[#78909C]">
                "เครื่องปั๊มนมคุณภาพดีมาก ใช้งานง่าย เสียงเงียบ ทีมงานให้คำแนะนำดี ส่งเร็วมาก พอดีกับช่วงลูกเกิด"
              </p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#C8E6C9] border-opacity-30">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-[#B3E5FC] bg-opacity-20 mr-4">
                  <Image
                    src="/avatar2.jpg"
                    alt="รีวิวจากคุณแม่"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#37474F]">คุณแม่พลอย</p>
                  <div className="flex text-[#A5D6A7]">
                    {"★".repeat(5)}
                  </div>
                </div>
              </div>
              <p className="text-[#78909C]">
                "เช่าเครื่อง Spectra ได้ของใหม่มาเลย ทำความสะอาดดี ไม่มีกลิ่น คุ้มค่ามากกว่าซื้อเอง แนะนำเลยค่ะ"
              </p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-[#C8E6C9] border-opacity-30">
              <div className="flex items-center mb-6">
                <div className="h-14 w-14 rounded-full overflow-hidden bg-[#B3E5FC] bg-opacity-20 mr-4">
                  <Image
                    src="/avatar3.jpg"
                    alt="รีวิวจากคุณแม่"
                    width={56}
                    height={56}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="font-semibold text-[#37474F]">คุณแม่แอน</p>
                  <div className="flex">
                    <span className="text-[#A5D6A7]">{"★".repeat(4)}</span>
                    <span className="text-gray-300">{"☆".repeat(1)}</span>
                  </div>
                </div>
              </div>
              <p className="text-[#78909C]">
                "บริการดีมาก มีปัญหาโทรถามได้ตลอด เครื่องสะอาด จัดส่งตรงเวลา ถ้ามีตารางการเช่าให้ดูก่อนจะดีมาก"
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#B3E5FC] bg-opacity-40 py-20 rounded-3xl text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-[#37474F] mb-6">
            เริ่มต้นเช่าเครื่องปั๊มนมกับเราได้แล้ววันนี้
          </h2>
          <p className="text-xl text-[#78909C] mb-10">
            มั่นใจในคุณภาพ สะอาด ปลอดภัย และบริการที่ใส่ใจทุกรายละเอียด
          </p>
          <Link
            href="/products"
            className="inline-block bg-[#A5D6A7] text-[#37474F] font-bold py-4 px-10 rounded-full hover:bg-opacity-90 transition duration-300 shadow-sm"
          >
            เลือกเครื่องปั๊มนมเลย
          </Link>
        </div>
      </section>
    </div>
  );
}
