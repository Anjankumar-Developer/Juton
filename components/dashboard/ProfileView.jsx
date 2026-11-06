'use client';

import { useState } from 'react';
import {
  User,
  Building2,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Edit2,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { validateProfileUpdate } from '@/lib/dashboard';

/**
 * Company Profile & Contact Credentials View
 */
export default function ProfileView({ user, onUpdateProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    businessName: user?.businessName || '',
    email: user?.email || '',
    mobile: user?.mobile || '',
  });
  const [errors, setErrors] = useState({});
  const [successNotice, setSuccessNotice] = useState(false);

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

  const handleSave = (e) => {
    e.preventDefault();
    const validation = validateProfileUpdate(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    onUpdateProfile(formData);
    setIsEditing(false);
    setSuccessNotice(true);
    setTimeout(() => setSuccessNotice(false), 3500);
  };

  return (
    <div className="space-y-8 font-sans">
      {/* Profile Header Card */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8DDCA] pb-6">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 bg-[#E8DDCA]/50 text-[#3D4935] flex items-center justify-center flex-shrink-0 border border-[#E8DDCA]">
              <Building2 className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-[#68745A]/15 text-[#3D4935] text-[10px] font-semibold uppercase tracking-wider">
                  Verified Direct-Mill Buyer
                </span>
                <span className="text-xs text-[#68745A]">
                  Client ID: {user?.id || 'usr_demo_001'}
                </span>
              </div>
              <h3 className="font-serif text-2xl sm:text-3xl text-[#252720]">
                {user?.businessName || 'Bengal Organic Grocers Private Limited'}
              </h3>
              <p className="text-xs text-[#68745A]">
                Primary Signatory: <strong className="text-[#3D4935]">{user?.fullName}</strong>
              </p>
            </div>
          </div>

          {!isEditing && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>Edit Profile</span>
            </Button>
          )}
        </div>

        {successNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Company profile credentials updated successfully.</span>
          </div>
        )}

        {isEditing ? (
          <form onSubmit={handleSave} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Authorized Signatory Full Name *
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.fullName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.fullName}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Registered Business / Enterprise Name *
                </label>
                <input
                  type="text"
                  name="businessName"
                  value={formData.businessName}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Corporate Work Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.email && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Mobile / WhatsApp Number (India) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.mobile && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>
                )}
              </div>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8DDCA]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-xs uppercase tracking-wider font-semibold"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                size="sm"
                type="submit"
                className="text-xs uppercase tracking-wider font-semibold"
              >
                Save Profile Changes
              </Button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                  Authorized Purchasing Officer
                </span>
                <span className="font-serif text-lg text-[#252720]">
                  {user?.fullName}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                  Corporate Work Email
                </span>
                <span className="text-xs font-semibold text-[#252720] flex items-center gap-1.5 pt-0.5">
                  <Mail className="w-3.5 h-3.5 text-[#68745A]" />
                  {user?.email}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                  Consignment Dispatch Mobile
                </span>
                <span className="text-xs font-semibold text-[#252720] flex items-center gap-1.5 pt-0.5">
                  <Phone className="w-3.5 h-3.5 text-[#68745A]" />
                  +91 {user?.mobile}
                </span>
              </div>
            </div>

            <div className="space-y-4 border-t md:border-t-0 md:border-l border-[#E8DDCA] pt-4 md:pt-0 md:pl-6">
              <div>
                <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                  Wholesale Procurement Tier
                </span>
                <span className="font-serif text-lg text-[#3D4935] font-medium">
                  Verified Tier-3 Mill Contract
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                  Account Registration Date
                </span>
                <span className="text-xs text-[#252720] flex items-center gap-1.5 pt-0.5">
                  <Calendar className="w-3.5 h-3.5 text-[#68745A]" />
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'February 2026'}
                </span>
              </div>

              <div>
                <span className="text-[10px] text-[#68745A] uppercase tracking-wider block">
                  Commercial Verification Status
                </span>
                <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1.5 pt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  GST Registered & ITC Verified
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
