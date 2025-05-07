'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '../../hooks/useAuth';
import { RecaptchaVerifier } from 'firebase/auth';
import { auth } from '../../lib/firebase';

export default function LoginPage() {
  const { user, signInWithGoogle, signInWithPhone, redirectIfAuthenticated } = useAuth();
  const [loginMethod, setLoginMethod] = useState('google'); // 'google' or 'phone'
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState(1); // 1: select method, 2: enter OTP (for phone)
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/account';
  
  // Check if already authenticated
  useEffect(() => {
    if (user) {
      router.push(redirectUrl);
    }
  }, [user, router, redirectUrl]);
  
  // Setup reCAPTCHA verifier
  useEffect(() => {
    if (loginMethod === 'phone' && !window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'normal',
          'callback': () => {
            // reCAPTCHA solved, enable sign-in button
            setError('');
          },
          'expired-callback': () => {
            setError('reCAPTCHA has expired. Please solve it again.');
          }
        });
      } catch (error) {
        console.error("Error setting up reCAPTCHA:", error);
      }
    }
  }, [loginMethod]);
  
  // Handle Google sign in
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      await signInWithGoogle();
      // Authentication will be handled by the auth context
      // and user will be redirected via the useEffect
    } catch (error) {
      setError('การเข้าสู่ระบบด้วย Google ล้มเหลว กรุณาลองอีกครั้ง');
      console.error("Google sign-in error:", error);
      setLoading(false);
    }
  };
  
  // Handle phone number submission
  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    // Format phone number (add +66 prefix)
    let formattedPhone = phoneNumber;
    if (phoneNumber.startsWith('0')) {
      formattedPhone = '+66' + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith('+')) {
      formattedPhone = '+66' + phoneNumber;
    }
    
    try {
      const verifier = window.recaptchaVerifier;
      const confirmationResult = await signInWithPhone(formattedPhone, verifier);
      setVerificationId(confirmationResult.verificationId);
      setStep(2);
    } catch (error) {
      setError('ไม่สามารถส่ง OTP ได้ กรุณาตรวจสอบเบอร์โทรศัพท์และลองใหม่');
      console.error("Phone sign-in error:", error);
    }
    
    setLoading(false);
  };
  
  // Handle OTP verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      // Verify OTP code
      await confirmationResult.confirm(otp);
      // Authentication will be handled by the auth context
      // and user will be redirected via the useEffect
    } catch (error) {
      setError('รหัส OTP ไม่ถูกต้องหรือหมดอายุ กรุณาลองใหม่');
      console.error("OTP verification error:", error);
      setLoading(false);
    }
  };
  
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-center mb-6">เข้าสู่ระบบ</h1>
        
        {/* Login method selection */}
        {step === 1 && (
          <div>
            <div className="flex border-b border-gray-200">
              <button
                className={`flex-1 py-3 font-medium text-center ${
                  loginMethod === 'google'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setLoginMethod('google')}
              >
                Google
              </button>
              <button
                className={`flex-1 py-3 font-medium text-center ${
                  loginMethod === 'phone'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
                onClick={() => setLoginMethod('phone')}
              >
                เบอร์โทรศัพท์
              </button>
            </div>
            
            <div className="mt-6">
              {/* Google login */}
              {loginMethod === 'google' && (
                <button
                  className="w-full flex items-center justify-center bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                >
                  <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  เข้าสู่ระบบด้วย Google
                </button>
              )}
              
              {/* Phone login */}
              {loginMethod === 'phone' && (
                <form onSubmit={handlePhoneSubmit}>
                  <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                      เบอร์โทรศัพท์
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      placeholder="08X-XXX-XXXX"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value.replace(/[^\d]/g, ''))}
                      required
                    />
                    <p className="text-sm text-gray-500 mt-1">เราจะส่งรหัส OTP ไปยังเบอร์นี้</p>
                  </div>
                  
                  {/* reCAPTCHA container */}
                  <div id="recaptcha-container" className="mb-4"></div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                    disabled={loading || !phoneNumber}
                  >
                    {loading ? 'กำลังส่งรหัส...' : 'ส่งรหัส OTP'}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
        
        {/* OTP verification step */}
        {step === 2 && (
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <p className="text-center text-gray-600 mb-4">
                เราได้ส่งรหัส OTP ไปยังเบอร์ {phoneNumber}
              </p>
              
              <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1">
                รหัส OTP
              </label>
              <input
                type="text"
                id="otp"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="XXXXXX"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/[^\d]/g, ''))}
                maxLength={6}
                required
              />
            </div>
            
            <button
              type="submit"
              className="w-full bg-blue-600 text-white rounded-lg px-4 py-3 font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              disabled={loading || otp.length !== 6}
            >
              {loading ? 'กำลังตรวจสอบ...' : 'ยืนยัน'}
            </button>
            
            <div className="mt-4 text-center">
              <button
                type="button"
                className="text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setStep(1)}
              >
                กลับไปหน้าเลือกวิธีเข้าสู่ระบบ
              </button>
            </div>
          </form>
        )}
        
        {/* Error message */}
        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md">
            {error}
          </div>
        )}
        
        {/* Privacy policy notice */}
        <p className="mt-6 text-xs text-center text-gray-500">
          การเข้าสู่ระบบ หมายถึงคุณยอมรับ{' '}
          <Link href="/terms" className="text-blue-600 hover:text-blue-800">
            เงื่อนไขการใช้งาน
          </Link>{' '}
          และ{' '}
          <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800">
            นโยบายความเป็นส่วนตัว
          </Link>{' '}
          ของเรา
        </p>
      </div>
    </div>
  );
}