'use client';

import { useState } from 'react';
import {
  MapPin,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Building2,
  Phone,
  AlertCircle,
  X
} from 'lucide-react';
import Button from '@/components/ui/Button';
import { INDIAN_STATES } from '@/lib/auth';
import { validateAddress } from '@/lib/dashboard';

/**
 * Saved Addresses Management View for JUTON customer accounts
 */
export default function SavedAddressesView({
  addresses = [],
  onAddAddress,
  onUpdateAddress,
  onDeleteAddress,
  onSetDefault,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    label: '',
    recipientName: '',
    mobile: '',
    houseBuilding: '',
    street: '',
    city: '',
    state: 'West Bengal',
    pinCode: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const resetForm = () => {
    setFormData({
      label: '',
      recipientName: '',
      mobile: '',
      houseBuilding: '',
      street: '',
      city: '',
      state: 'West Bengal',
      pinCode: '',
      isDefault: false,
    });
    setErrors({});
    setIsEditing(false);
    setEditingId(null);
  };

  const handleOpenAdd = () => {
    resetForm();
    setIsEditing(true);
  };

  const handleOpenEdit = (addr) => {
    setFormData({
      label: addr.label || '',
      recipientName: addr.recipientName || '',
      mobile: addr.mobile || '',
      houseBuilding: addr.houseBuilding || '',
      street: addr.street || '',
      city: addr.city || '',
      state: addr.state || 'West Bengal',
      pinCode: addr.pinCode || '',
      isDefault: Boolean(addr.isDefault),
    });
    setErrors({});
    setEditingId(addr.id);
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validation = validateAddress(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    if (editingId) {
      onUpdateAddress(editingId, formData);
      setToastMessage('Destination address updated successfully.');
    } else {
      onAddAddress(formData);
      setToastMessage('New commercial delivery destination registered.');
    }

    resetForm();
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleDelete = (id, label) => {
    if (confirm(`Remove "${label}" from saved destinations?`)) {
      onDeleteAddress(id);
      setToastMessage(`Address "${label}" removed.`);
      setTimeout(() => setToastMessage(null), 3000);
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Header and Add Action */}
      <div className="bg-[#FFFFFF] border border-[#E8DDCA] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
            Pan-India Logistics Registry
          </span>
          <h3 className="font-serif text-2xl text-[#252720]">Saved Delivery Addresses</h3>
          <p className="text-xs text-[#68745A] mt-1">
            Manage receiving warehouses, regional retail fulfillment points, and corporate headquarters.
          </p>
        </div>

        {!isEditing && (
          <Button
            variant="primary"
            size="sm"
            onClick={handleOpenAdd}
            className="text-xs uppercase tracking-wider font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Destination Hub</span>
          </Button>
        )}
      </div>

      {toastMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Add / Edit Form Modal / Inline Box */}
      {isEditing && (
        <div className="bg-[#FFFFFF] border-2 border-[#3D4935] p-6 sm:p-8 space-y-6 shadow-sm">
          <div className="flex items-center justify-between border-b border-[#E8DDCA] pb-4">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#A88B66] font-semibold block">
                {editingId ? 'Modify Logistics Profile' : 'New Delivery Destination'}
              </span>
              <h4 className="font-serif text-xl text-[#252720]">
                {editingId ? 'Edit Saved Address' : 'Register New Warehouse / Hub'}
              </h4>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="p-1 text-[#68745A] hover:text-[#252720] cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Address Label / Identifier *
                </label>
                <input
                  type="text"
                  name="label"
                  value={formData.label}
                  onChange={handleChange}
                  placeholder="e.g. Central Warehouse, Mumbai Flagship"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.label && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.label}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Receiving Contact / Officer Name *
                </label>
                <input
                  type="text"
                  name="recipientName"
                  value={formData.recipientName}
                  onChange={handleChange}
                  placeholder="e.g. Vikramaditya Roy (Procurement)"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.recipientName && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.recipientName}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Consignment Mobile Number (India) *
                </label>
                <input
                  type="tel"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="10-digit mobile (e.g. 9830048821)"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.mobile && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.mobile}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  Warehouse Bay / Building / Unit *
                </label>
                <input
                  type="text"
                  name="houseBuilding"
                  value={formData.houseBuilding}
                  onChange={handleChange}
                  placeholder="e.g. Godown 14B, Logistics Bay"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.houseBuilding && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.houseBuilding}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                Street / Industrial Road Area *
              </label>
              <input
                type="text"
                name="street"
                value={formData.street}
                onChange={handleChange}
                placeholder="e.g. Strand Bank Road, Posta Market"
                className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
              />
              {errors.street && (
                <p className="text-[11px] text-red-600 mt-1">{errors.street}</p>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  placeholder="e.g. Kolkata"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.city && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.city}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935] cursor-pointer"
                >
                  {INDIAN_STATES.map((state) => (
                    <option key={state} value={state}>
                      {state}
                    </option>
                  ))}
                </select>
                {errors.state && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.state}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-[#252720] uppercase tracking-wider mb-1">
                  6-Digit PIN Code *
                </label>
                <input
                  type="text"
                  name="pinCode"
                  maxLength={6}
                  value={formData.pinCode}
                  onChange={handleChange}
                  placeholder="e.g. 700001"
                  className="w-full px-3.5 py-2.5 bg-[#F7F5EF] border border-[#E8DDCA] text-xs text-[#252720] focus:outline-none focus:border-[#3D4935]"
                />
                {errors.pinCode && (
                  <p className="text-[11px] text-red-600 mt-1">{errors.pinCode}</p>
                )}
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="isDefault"
                  checked={formData.isDefault}
                  onChange={handleChange}
                  className="accent-[#3D4935] w-4 h-4 cursor-pointer"
                />
                <span className="text-xs text-[#252720] font-medium">
                  Set as Default Destination for Future Wholesale Dispatches
                </span>
              </label>
            </div>

            <div className="pt-4 flex items-center justify-end gap-3 border-t border-[#E8DDCA]">
              <Button
                variant="secondary"
                size="sm"
                type="button"
                onClick={resetForm}
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
                {editingId ? 'Save Address Changes' : 'Register Destination Hub'}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Addresses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {addresses.map((addr) => (
          <div
            key={addr.id}
            className={`bg-[#FFFFFF] border p-6 flex flex-col justify-between space-y-4 transition-all ${
              addr.isDefault
                ? 'border-[#3D4935] ring-1 ring-[#3D4935]/20 shadow-xs'
                : 'border-[#E8DDCA] hover:border-[#A88B66]'
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start justify-between gap-2 border-b border-[#E8DDCA] pb-3">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg text-[#252720] font-medium">
                    {addr.label}
                  </h4>
                  {addr.isDefault && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#3D4935] text-[#F7F5EF] text-[10px] font-bold uppercase tracking-wider">
                      <CheckCircle2 className="w-3 h-3" />
                      Default Hub
                    </span>
                  )}
                </div>
                <MapPin className="w-4 h-4 text-[#A88B66]" />
              </div>

              <div className="text-xs space-y-1.5 text-[#252720]/80">
                <div className="font-semibold text-[#252720]">
                  {addr.recipientName}
                </div>
                {addr.mobile && (
                  <div className="text-[#68745A] flex items-center gap-1.5">
                    <Phone className="w-3 h-3" />
                    <span>+91 {addr.mobile}</span>
                  </div>
                )}
                <div className="pt-1 text-[#252720]/85 leading-relaxed">
                  <p>{addr.houseBuilding}</p>
                  <p>{addr.street}</p>
                  <p className="font-medium text-[#252720]">
                    {addr.city}, {addr.state} - {addr.pinCode}
                  </p>
                  <p className="text-[11px] text-[#68745A]">India</p>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="pt-4 border-t border-[#E8DDCA] flex items-center justify-between gap-2 text-xs">
              {!addr.isDefault ? (
                <button
                  type="button"
                  onClick={() => onSetDefault(addr.id)}
                  className="text-xs text-[#3D4935] hover:text-[#252720] font-semibold underline underline-offset-4 cursor-pointer"
                >
                  Set as Default
                </button>
              ) : (
                <span className="text-[11px] text-[#68745A] font-medium">
                  Primary Destination
                </span>
              )}

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(addr)}
                  className="p-1.5 text-[#68745A] hover:text-[#3D4935] hover:bg-[#F7F5EF] border border-[#E8DDCA] transition-colors cursor-pointer"
                  title="Edit Address"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                {addresses.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleDelete(addr.id, addr.label)}
                    className="p-1.5 text-stone-500 hover:text-red-700 hover:bg-red-50 border border-[#E8DDCA] transition-colors cursor-pointer"
                    title="Delete Address"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
