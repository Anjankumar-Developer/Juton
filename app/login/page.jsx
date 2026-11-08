'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ShieldCheck, UserCheck, AlertCircle, CheckCircle2, Lock, Mail, ArrowRight } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { useAuth } from '@/context/AuthContext';
import { validateLogin } from '@/lib/auth';

export default function LoginPage() {
  const router = useRouter();
  const { login, loginWithDemo, isAuthenticated } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleQuickDemoLogin = () => {
    loginWithDemo();
    setSuccessMessage('Logged in as Demo Corporate Buyer (Vikramaditya Roy). Redirecting...');
    setTimeout(() => {
      router.push('/account');
    }, 800);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMessage(null);

    const validation = validateLogin(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const result = await login(formData);
    if (result.success) {
      const redirectPath = result.user?.role === 'admin' ? '/admin' : '/account';
      setSuccessMessage('Sign in successful. Redirecting to your trade portal...');
      setTimeout(() => {
        router.push(redirectPath);
      }, 800);
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
          <span className="text-[#3D4935] font-semibold">Trade Portal Login</span>
        </nav>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/40 text-xs font-sans text-[#3D4935] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-medium">Frontend Demonstration Mode</strong>
            Authentication states are simulated locally in browser memory. You can enter any valid email/password combination or click the 1-click Demo Account button below.
          </div>
        </div>

        {/* Main Login Card */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Wholesale Client Access
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal">
              Sign In to JUTON
            </h1>
            <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-sm mx-auto leading-relaxed">
              Access your corporate quotes, pan-India dispatch schedules, and factory price matrices.
            </p>
          </div>

          {/* 1-Click Demo Login Button for Evaluators */}
          <div className="mb-8 p-4 bg-[#F7F5EF] border border-[#E8DDCA] flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <span className="text-xs font-semibold text-[#252720] font-sans block">
                Testing this prototype?
              </span>
              <span className="text-[11px] text-[#68745A] font-sans block">
                Instant login as verified buyer (Bengal Organic Grocers)
              </span>
            </div>
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="px-4 py-2 bg-[#3D4935] text-white hover:bg-[#252720] text-xs font-sans font-medium uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
            >
              <UserCheck className="w-3.5 h-3.5 text-[#E8DDCA]" />
              <span>1-Click Demo Sign In</span>
            </button>
          </div>

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-[#68745A]/15 border border-[#68745A] text-xs font-sans text-[#3D4935] flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-[#3D4935] flex-shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5" noValidate>
            {/* Email Address */}
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

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans"
                >
                  Password <span className="text-red-700">*</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-[11px] font-sans text-[#68745A] hover:text-[#252720] hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your account password"
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

            {/* Submit Button */}
            <div className="pt-2">
              <Button
                type="submit"
                variant="primary"
                size="lg"
                disabled={isSubmitting}
                className="w-full justify-center text-xs uppercase tracking-widest font-semibold"
              >
                {isSubmitting ? 'Verifying Credentials...' : 'Sign In to Trade Account'}
              </Button>
            </div>
          </form>

          {/* Links to Register */}
          <div className="mt-8 pt-6 border-t border-[#E8DDCA] text-center space-y-2">
            <p className="text-xs font-sans text-[#252720]/75">
              New wholesale buyer or retail partner?{' '}
              <Link
                href="/register"
                className="font-semibold text-[#3D4935] hover:text-[#252720] underline underline-offset-2"
              >
                Create B2B Wholesale Account
              </Link>
            </p>
          </div>
        </div>
      </Container>
    </div>
  );
}
