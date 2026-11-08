'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle2, AlertCircle, ArrowLeft } from 'lucide-react';
import Container from '@/components/ui/Container';
import Button from '@/components/ui/Button';
import { supabaseBrowser } from '@/lib/supabase/client';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (!supabaseBrowser) {
      setIsComplete(true);
      return;
    }

    setIsSubmitting(true);
    const { error: updateError } = await supabaseBrowser.auth.updateUser({ password });
    setIsSubmitting(false);

    if (updateError) {
      setError(updateError.message || 'Password reset failed.');
      return;
    }

    setIsComplete(true);
  };

  return (
    <div className="bg-[#F7F5EF] min-h-screen py-12 sm:py-16">
      <Container size="sm">
        <nav className="flex items-center gap-2 text-xs text-[#68745A] font-sans uppercase tracking-widest mb-6">
          <Link href="/" className="hover:text-[#252720] transition-colors">Home</Link>
          <span>/</span>
          <Link href="/login" className="hover:text-[#252720] transition-colors">Login</Link>
          <span>/</span>
          <span className="text-[#3D4935] font-semibold">Reset Password</span>
        </nav>

        <div className="bg-white border border-[#E8DDCA] p-8 sm:p-12">
          <div className="text-center space-y-2 mb-8">
            <span className="text-[11px] uppercase tracking-widest text-[#A88B66] font-semibold block">Security</span>
            <h1 className="font-serif text-3xl sm:text-4xl text-[#252720] font-normal">Create New Password</h1>
          </div>

          {isComplete ? (
            <div className="space-y-6 text-center">
              <div className="w-16 h-16 bg-[#68745A]/15 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-[#3D4935]" />
              </div>
              <p className="text-sm text-[#252720]/75 font-sans">Your password has been updated successfully.</p>
              <Button as={Link} href="/login" variant="primary" size="md" className="mx-auto text-xs uppercase tracking-widest">
                Return to Sign In
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              <div>
                <label htmlFor="password" className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5">
                  New Password <span className="text-red-700">*</span>
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none"
                  placeholder="Enter a secure new password"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-xs uppercase tracking-wider font-semibold text-[#252720] font-sans mb-1.5">
                  Confirm New Password <span className="text-red-700">*</span>
                </label>
                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs sm:text-sm font-sans text-[#252720] focus:border-[#3D4935] focus:outline-none"
                  placeholder="Re-enter your new password"
                />
              </div>

              {error && (
                <p className="text-[11px] font-sans text-red-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3 flex-shrink-0" />
                  <span>{error}</span>
                </p>
              )}

              <div className="pt-2">
                <Button type="submit" variant="primary" size="lg" disabled={isSubmitting} className="w-full justify-center text-xs uppercase tracking-widest font-semibold">
                  {isSubmitting ? 'Updating Password...' : 'Update Password'}
                </Button>
              </div>

              <div className="text-center pt-2">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-sans text-[#68745A] hover:text-[#252720] hover:underline">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </div>
      </Container>
    </div>
  );
}
