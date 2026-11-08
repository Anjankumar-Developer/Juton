'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ShieldCheck, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { validateForgotPassword } from '@/lib/auth';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const validation = validateForgotPassword(email);
    if (!validation.valid) {
      setError(validation.error);
      setIsSubmitting(false);
      return;
    }

    if (!supabaseBrowser) {
      setTimeout(() => {
        setIsSubmitting(false);
        setIsSubmitted(true);
      }, 600);
      return;
    }

    const { error: resetError } = await supabaseBrowser.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/reset-password` : undefined,
    });

    setIsSubmitting(false);

    if (resetError) {
      setError(resetError.message || 'Unable to send a password reset link right now.');
      return;
    }

    setIsSubmitted(true);
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
          <Link href="/login" className="hover:text-[#252720] transition-colors">
            Login
          </Link>
          <span>/</span>
          <span className="text-[#3D4935] font-semibold">Password Recovery</span>
        </nav>

        {/* Demo Mode Notice Banner */}
        <div className="mb-6 p-4 bg-[#E8DDCA]/40 border border-[#A88B66]/40 text-xs font-sans text-[#3D4935] flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-[#68745A] flex-shrink-0 mt-0.5" />
          <div className="leading-relaxed">
            <strong className="block font-medium">Frontend Demonstration Mode</strong>
            Password recovery is simulated. In a production deployment with email integration, a time-limited cryptographically signed recovery token is dispatched.
          </div>
        </div>

        {/* Card */}
        <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-8 sm:p-12 shadow-xs">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Security & Credentials
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal">
              Reset Your Password
            </h1>
            <p className="text-xs sm:text-sm text-[#252720]/75 font-sans max-w-sm mx-auto leading-relaxed">
              Enter your corporate email address associated with your JUTON trade portal account.
            </p>
          </div>

          {isSubmitted ? (
            <div className="space-y-6 text-center py-4">
              <div className="w-14 h-14 bg-[#68745A]/15 text-[#3D4935] rounded-full flex items-center justify-center mx-auto border border-[#68745A]/30">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <div className="space-y-2">
                <h3 className="font-serif text-2xl text-[#252720]">Reset Link Simulated</h3>
                <p className="text-xs font-sans text-[#252720]/75 max-w-sm mx-auto leading-relaxed">
                  We simulated sending instructions to <strong className="text-[#252720]">{email}</strong>.
                  For this prototype, your account remains accessible anytime via the demo sign-in option.
                </p>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Button
                  variant="primary"
                  size="md"
                  as={Link}
                  href="/login"
                  className="text-xs uppercase tracking-widest font-semibold"
                >
                  Return to Sign In
                </Button>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setEmail('');
                  }}
                  className="px-4 py-2.5 text-xs uppercase tracking-widest font-semibold text-[#68745A] hover:text-[#252720] border border-[#E8DDCA] hover:bg-[#F7F5EF] transition-colors"
                >
                  Try Another Email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5"
                >
                  Registered Email Address <span className="text-red-700">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(null);
                  }}
                  placeholder="e.g. procurement@company.com"
                  className={`w-full px-3.5 py-2.5 bg-[#F7F5EF] border text-xs sm:text-sm font-sans text-[#252720] focus:outline-none transition-colors ${
                    error ? 'border-red-600 focus:border-red-600' : 'border-[#E8DDCA] focus:border-[#3D4935]'
                  }`}
                  aria-invalid={Boolean(error)}
                />
                {error && (
                  <p className="mt-1 text-[11px] font-sans text-red-700 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3 flex-shrink-0" />
                    <span>{error}</span>
                  </p>
                )}
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  disabled={isSubmitting}
                  className="w-full justify-center text-xs uppercase tracking-widest font-semibold"
                >
                  {isSubmitting ? 'Simulating Dispatch...' : 'Send Password Reset Link'}
                </Button>
              </div>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center gap-1.5 text-xs font-sans text-[#68745A] hover:text-[#252720] hover:underline"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Trade Portal Login</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
