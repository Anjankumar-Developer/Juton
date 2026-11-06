'use client';

import { useState } from 'react';
import {
  Lock,
  Bell,
  Receipt,
  RotateCcw,
  Download,
  LogOut,
  CheckCircle2,
  AlertCircle,
  ShieldAlert
} from 'lucide-react';
import Button from '@/components/ui/Button';
import {
  validatePasswordChange,
  serializeDashboardDataForApi
} from '@/lib/dashboard';

/**
 * Account Settings View
 * Includes security (password change), notifications, GST preferences, and demo session controls
 */
export default function AccountSettingsView({
  user,
  orders = [],
  savedAddresses = [],
  userSettings,
  onUpdateSettings,
  onResetDemoData,
  onLogout,
}) {
  // Password Change State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordSuccess, setPasswordSuccess] = useState(false);

  // Settings State
  const [notificationPrefs, setNotificationPrefs] = useState(
    userSettings?.notificationPreferences || {
      whatsappDispatch: true,
      emailInvoices: true,
      productionMilestones: true,
      annualLookbook: false,
    }
  );

  const [taxPrefs, setTaxPrefs] = useState(
    userSettings?.taxPreferences || {
      gstin: '19AAACB1234F1Z8',
      requiresInputTaxCredit: true,
      preferredCurrency: 'INR',
    }
  );

  const [settingsNotice, setSettingsNotice] = useState(null);

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const validation = validatePasswordChange(passwordForm);
    if (!validation.valid) {
      setPasswordErrors(validation.errors);
      return;
    }

    setPasswordErrors({});
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    setPasswordSuccess(true);
    setTimeout(() => setPasswordSuccess(false), 4000);
  };

  const handleToggleNotification = (key) => {
    const next = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(next);
    onUpdateSettings({ notificationPreferences: next });
    setSettingsNotice('Notification preferences updated.');
    setTimeout(() => setSettingsNotice(null), 3000);
  };

  const handleSaveTax = (e) => {
    e.preventDefault();
    onUpdateSettings({ taxPreferences: taxPrefs });
    setSettingsNotice('Tax & GST invoicing settings saved.');
    setTimeout(() => setSettingsNotice(null), 3000);
  };

  const handleExportData = () => {
    const data = serializeDashboardDataForApi(user, orders, savedAddresses, {
      notificationPreferences: notificationPrefs,
      taxPreferences: taxPrefs,
    });
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `juton-account-${user?.id || 'demo'}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 font-sans">
      {settingsNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{settingsNotice}</span>
        </div>
      )}

      {/* Security: Password Update */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E8DDCA] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Portal Authentication
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#252720]">Change Password</h3>
          </div>
          <Lock className="w-5 h-5 text-[#68745A]" />
        </div>

        {passwordSuccess && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
            <span>Portal password updated successfully.</span>
          </div>
        )}

        <form onSubmit={handlePasswordSubmit} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
              Current Password *
            </label>
            <input
              type="password"
              value={passwordForm.currentPassword}
              onChange={(e) =>
                setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
              }
              placeholder="••••••••"
              className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
            />
            {passwordErrors.currentPassword && (
              <p className="text-[11px] text-red-600 mt-1">
                {passwordErrors.currentPassword}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                New Password *
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                }
                placeholder="At least 8 characters"
                className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
              />
              {passwordErrors.newPassword && (
                <p className="text-[11px] text-red-600 mt-1">
                  {passwordErrors.newPassword}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) =>
                  setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                }
                placeholder="Re-enter password"
                className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-[11px] text-red-600 mt-1">
                  {passwordErrors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          <Button
            variant="primary"
            size="sm"
            type="submit"
            className="text-xs uppercase tracking-wider font-semibold"
          >
            Update Security Credentials
          </Button>
        </form>
      </div>

      {/* Notification Preferences */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E8DDCA] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Logistics & Alerts
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#252720]">
              Dispatch Notifications
            </h3>
          </div>
          <Bell className="w-5 h-5 text-[#68745A]" />
        </div>

        <div className="divide-y divide-[#E8DDCA]">
          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-[#252720] block">
                WhatsApp Dispatch & Tracking Updates
              </span>
              <span className="text-[11px] text-[#68745A]">
                Receive instant AWB tracking numbers and lorry consignment receipts via WhatsApp.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationPrefs.whatsappDispatch}
              onChange={() => handleToggleNotification('whatsappDispatch')}
              className="accent-[#3D4935] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-[#252720] block">
                Digital GST Tax Invoices via Email
              </span>
              <span className="text-[11px] text-[#68745A]">
                PDF invoices sent directly to your corporate accounting team upon mill dispatch.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationPrefs.emailInvoices}
              onChange={() => handleToggleNotification('emailInvoices')}
              className="accent-[#3D4935] w-4 h-4 cursor-pointer"
            />
          </div>

          <div className="py-3 flex items-center justify-between">
            <div>
              <span className="font-semibold text-xs text-[#252720] block">
                Loom Production Milestones
              </span>
              <span className="text-[11px] text-[#68745A]">
                Alerts when fabric is warped, screen printing starts, and QC certification passes.
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationPrefs.productionMilestones}
              onChange={() => handleToggleNotification('productionMilestones')}
              className="accent-[#3D4935] w-4 h-4 cursor-pointer"
            />
          </div>
        </div>
      </div>

      {/* Tax & GST Preferences */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E8DDCA] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Commercial Compliance
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#252720]">
              GST & Invoicing Profile
            </h3>
          </div>
          <Receipt className="w-5 h-5 text-[#68745A]" />
        </div>

        <form onSubmit={handleSaveTax} className="space-y-4 max-w-lg">
          <div>
            <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
              Registered GSTIN (Goods and Services Tax ID)
            </label>
            <input
              type="text"
              value={taxPrefs.gstin}
              onChange={(e) => setTaxPrefs({ ...taxPrefs, gstin: e.target.value.toUpperCase() })}
              placeholder="e.g. 19AAACB1234F1Z8"
              className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs font-mono text-[#252720] focus:outline-none focus:border-[#3D4935]"
            />
            <p className="text-[11px] text-[#68745A] mt-1">
              Used automatically on all GST tax invoices for claiming 100% Input Tax Credit.
            </p>
          </div>

          <div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={taxPrefs.requiresInputTaxCredit}
                onChange={(e) =>
                  setTaxPrefs({ ...taxPrefs, requiresInputTaxCredit: e.target.checked })
                }
                className="accent-[#3D4935] w-4 h-4 cursor-pointer"
              />
              <span className="text-xs text-[#252720] font-medium">
                Always issue B2B Tax Invoice with E-Way Bill Generation
              </span>
            </label>
          </div>

          <Button
            variant="secondary"
            size="sm"
            type="submit"
            className="text-xs uppercase tracking-wider font-semibold"
          >
            Save Tax Preferences
          </Button>
        </form>
      </div>

      {/* Demo Session & Data Management */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 space-y-6">
        <div className="border-b border-[#E8DDCA] pb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
              Session Tools
            </span>
            <h3 className="font-serif text-xl sm:text-2xl text-[#252720]">
              Demo Environment Controls
            </h3>
          </div>
          <ShieldAlert className="w-5 h-5 text-[#A88B66]" />
        </div>

        <div className="space-y-4 text-xs text-[#252720]/80">
          <p className="leading-relaxed">
            This customer dashboard operates in frontend demonstration mode with local browser persistence. You can reset demo orders back to the clean 6-status baseline or export your session data as an API-ready JSON document.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={onResetDemoData}
              className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset 6 Demo Status Orders</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleExportData}
              className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export Account Data (JSON)</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onLogout}
              className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 text-red-700 border-red-200 hover:bg-red-50"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out of Portal</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
