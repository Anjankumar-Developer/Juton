'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, ArrowRight, AlertCircle, Building2, Lock, Mail, Phone, User, CheckCircle2 } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { validateRegistration } from '@/lib/auth';

export default function RegisterPage() {
  const router = useRouter();
  const { register, loginWithDemo, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    fullName: '',
    businessName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-level error on change
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleFillDemo = () => {
    setFormData({
      fullName: 'Ananya Sen',
      businessName: 'The Bengal Artisan Guild LLP',
      email: 'procurement@bengalartisan.in',
      mobile: '9830048821',
      password: 'demoPassword2026',
      confirmPassword: 'demoPassword2026',
    });
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    const validation = validateRegistration(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const result = await register(formData);
    if (result.success) {
      if (result.requiresEmailVerification) {
        setSuccessMessage(result.message || 'Registration successful. Please verify your email before signing in.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMessage('Registration successful! Redirecting to your trade account...');
      setTimeout(() => {
        router.push('/account');
      }, 1000);
    } else if (result.errors) {
      setErrors(result.errors);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12 sm:py-16">
      <Container size="sm">
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs text-[#68745A] font-sans uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-[#252720] transition-colors">
            Home
          </Link>
          <span>/</span>
          <span className="text-[#3D4935] font-semibold">B2B Trade Registration</span>
        </nav>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/40 text-xs font-sans text-[#3D4935] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-medium">Frontend Demonstration Mode</strong>
            Commercial registration is simulated using browser local storage. No real credentials are transmitted. Use your details or the 1-click demo button below.
          </div>
        </div>

        {/* Main Card */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Wholesale Access & Mill Orders
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal">
              Register Wholesale Account
            </h1>
            <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-md mx-auto leading-relaxed">
              Mandatory trade registration enables direct-from-Bengal mill quotations, tiered pricing locks, and GST tax credit invoicing.
            </p>
          </div>

          {/* Quick Demo Pre-fill Button */}
          <div className="mb-8 flex items-center justify-center">
            <button
              type="button"
              onClick={handleFillDemo}
              className="px-4 py-2 text-xs font-sans font-medium text-[#3D4935] bg-[#F7F5EF] hover:bg-[#E8DDCA] border border-[#A88B66]/40 transition-colors cursor-pointer flex items-center gap-2"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#68745A]" />
              <span>Fill Sample Corporate Details</span>
            </button>
          </div>

          {/* Success Message Banner */}
          {successMessage && (
            <div className="mb-6 p-4 bg-[#68745A]/15 border border-[#68745A] text-xs font-sans text-[#3D4935] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3D4935] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
              >
                Full Name <span className="text-red-700">*</span>
              </label>
              <div className="relative">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Vikramaditya Roy"
                  className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                    errors.fullName ? 'border-red-600 focus:border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                  }`}
                  aria-invalid={Boolean(errors.fullName)}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{errors.fullName}</span>
                </p>
              )}
            </div>

            {/* Business Name (Optional) */}
            <div>
              <label
                htmlFor="businessName"
                className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
              >
                Business / Company Name <span className="text-[#68745A] font-normal lowercase">(optional)</span>
              </label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                value={formData.businessName}
                onChange={handleChange}
                placeholder="e.g. Bengal Organic Grocers Pvt Ltd"
                className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none transition-colors"
              />
            </div>

            {/* Email & Mobile 2-column on tablet+ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                >
                  Corporate / Contact Email <span className="text-red-700">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="procurement@company.com"
                  className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                    errors.email ? 'border-red-600 focus:border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                  }`}
                  aria-invalid={Boolean(errors.email)}
                />
                {errors.email && (
                  <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.email}</span>
                  </p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label
                  htmlFor="mobile"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                >
                  Mobile Number (India) <span className="text-red-700">*</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  required
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile (e.g. 9830048821)"
                  className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                    errors.mobile ? 'border-red-600 focus:border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                  }`}
                  aria-invalid={Boolean(errors.mobile)}
                />
                {errors.mobile && (
                  <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.mobile}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Password & Confirm Password */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                >
                  Password <span className="text-red-700">*</span>
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Min 6 characters"
                  className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                    errors.password ? 'border-red-600 focus:border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                  }`}
                  aria-invalid={Boolean(errors.password)}
                />
                {errors.password && (
                  <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.password}</span>
                  </p>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                >
                  Confirm Password <span className="text-red-700">*</span>
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Re-enter password"
                  className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                    errors.confirmPassword
                      ? 'border-red-600 focus:border-red-600'
                      : 'border-[#E8DDCA] focus:border-[#3D4935]'
                  }`}
                  aria-invalid={Boolean(errors.confirmPassword)}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{errors.confirmPassword}</span>
                  </p>
                )}
              </div>
            </div>

            {/* Terms compliance notice */}
            <p className="text-[11px] text-[#68745A] font-sans leading-relaxed pt-1">
              By registering, you agree to JUTON’s Commercial Terms, Indian GST Invoicing Standards, and Sustainable Packaging Compliance standards.
            </p>

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full justify-center text-xs uppercase tracking-widest font-semibold"
              >
                {isSubmitting ? 'Creating Wholesale Account...' : 'Complete Trade Registration'}
              </Button>
            </div>
          </form>

          {/* Links to Login */}
          <div className="mt-8 pt-6 border-t border-[#E8DDCA] text-center space-y-2">
            <p className="text-xs font-sans text-[#252720]/75">
              Already have an established trade profile?{' '}
              <Link
                href="/login"
                className="font-semibold text-[#3D4935] hover:text-[#252720] underline underline-offset-2"
              >
                Sign In to Wholesale Portal
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
