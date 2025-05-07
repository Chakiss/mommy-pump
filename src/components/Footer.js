'use client';

import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-[#F0FAFA] border-t border-[#C8E6C9] border-opacity-30 font-['Sarabun','Poppins',sans-serif]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-[#37474F] font-bold text-xl">MommyPump</h3>
            <p className="mt-4 text-sm text-[#78909C]">
              บริการเช่าเครื่องปั๊มนมคุณภาพสูงสำหรับคุณแม่มือใหม่ สะอาด ปลอดภัย และใช้งานง่าย
            </p>
          </div>
          
          {/* Quick Links */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#78909C] tracking-wider uppercase">
              เมนูหลัก
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  หน้าแรก
                </Link>
              </li>
              <li>
                <Link href="/products" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  สินค้า
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  วิธีการเช่า
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  คำถามที่พบบ่อย
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Support */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#78909C] tracking-wider uppercase">
              ช่วยเหลือ
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link href="/contact" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  ติดต่อเรา
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  เงื่อนไขการใช้งาน
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="text-base text-[#78909C] hover:text-[#37474F] transition duration-300">
                  นโยบายความเป็นส่วนตัว
                </Link>
              </li>
            </ul>
          </div>
          
          {/* Contact */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-[#78909C] tracking-wider uppercase">
              ติดต่อเรา
            </h3>
            <ul className="mt-4 space-y-2">
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#A5D6A7]" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                </div>
                <span className="ml-3 text-base text-[#78909C]">
                  123 ถนนสุขุมวิท, กรุงเทพฯ 10110
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#A5D6A7]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                  </svg>
                </div>
                <span className="ml-3 text-base text-[#78909C]">
                  088-123-4567
                </span>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-[#A5D6A7]" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                <span className="ml-3 text-base text-[#78909C]">
                  contact@mommypump.com
                </span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Social Media Links */}
        <div className="mt-8 border-t border-[#C8E6C9] border-opacity-30 pt-8 md:flex md:items-center md:justify-between">
          <div className="flex space-x-6 md:order-2">
            {/* Facebook */}
            <a href="#" className="text-[#78909C] hover:text-[#B3E5FC] transition duration-300">
              <span className="sr-only">Facebook</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
              </svg>
            </a>
            
            {/* Instagram */}
            <a href="#" className="text-[#78909C] hover:text-[#B3E5FC] transition duration-300">
              <span className="sr-only">Instagram</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
            
            {/* LINE */}
            <a href="#" className="text-[#78909C] hover:text-[#B3E5FC] transition duration-300">
              <span className="sr-only">LINE</span>
              <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19.952,12.997c0-4.415-4.377-8.001-9.752-8.001c-5.376,0-9.752,3.586-9.752,8.001c0,4.026,3.549,7.397,8.345,7.934c0.324,0.07,0.764,0.212,0.874,0.489c0.1,0.25,0.065,0.644,0.032,0.901c0,0-0.117,0.705-0.143,0.853c-0.044,0.254-0.199,0.995,0.871,0.542c1.076-0.455,5.794-3.409,7.902-5.835l0,0C19.370,16.182,19.952,14.658,19.952,12.997z M8.752,15.481h-1.5c-0.208,0-0.377-0.173-0.377-0.384V11.19c0-0.212,0.169-0.384,0.377-0.384c0.208,0,0.376,0.171,0.376,0.384v3.149h1.124c0.208,0,0.377,0.17,0.377,0.381C9.128,15.308,8.96,15.481,8.752,15.481z M10.876,15.097c0,0.212-0.169,0.384-0.377,0.384c-0.207,0-0.377-0.173-0.377-0.384V11.19c0-0.212,0.17-0.384,0.377-0.384c0.208,0,0.377,0.171,0.377,0.384V15.097z M15.874,15.097c0,0.164-0.101,0.313-0.256,0.367c-0.039,0.014-0.08,0.021-0.121,0.021c-0.119,0-0.23-0.056-0.302-0.151l-1.571-2.155v1.917c0,0.212-0.169,0.384-0.377,0.384c-0.207,0-0.377-0.173-0.377-0.384V11.19c0-0.164,0.101-0.313,0.257-0.366c0.038-0.015,0.079-0.021,0.121-0.021c0.118,0,0.229,0.056,0.301,0.15l1.57,2.155V11.19c0-0.212,0.169-0.384,0.377-0.384c0.208,0,0.377,0.171,0.377,0.384V15.097z M17.428,12.417h-1.124V15.1c0,0.212-0.169,0.384-0.377,0.384c-0.208,0-0.377-0.173-0.377-0.384V11.19c0-0.107,0.043-0.206,0.112-0.278c0.071-0.071,0.168-0.106,0.265-0.106h1.5c0.208,0,0.377,0.171,0.377,0.384C17.805,12.246,17.636,12.417,17.428,12.417z"/>
              </svg>
            </a>
          </div>
          <p className="mt-8 text-base text-[#78909C] md:mt-0 md:order-1">
            &copy; {currentYear} MommyPump. สงวนลิขสิทธิ์.
          </p>
        </div>
      </div>
    </footer>
  );
}