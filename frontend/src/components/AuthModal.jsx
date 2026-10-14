import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Mail,
  User,
  ShieldCheck,
  ArrowRight,
  Phone,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import { api } from '../api';

export default function AuthModal({ isOpen, onClose, onAuthSuccess, currentUser }) {
  const [isLogin, setIsLogin] = useState(true);
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (currentUser) {
      setIsEditProfile(true);
      const defaultAddr = currentUser.addresses?.[0] || {};
      setFormData({
        name: currentUser.name || '',
        email: currentUser.email || '',
        password: '',
        phone: currentUser.phone || '',
        street: defaultAddr.street || '',
        city: defaultAddr.city || '',
        state: defaultAddr.state || '',
        zip: defaultAddr.zip || '',
      });
    } else {
      setIsEditProfile(false);
    }
  }, [currentUser, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccessMsg('');

    try {
      if (isEditProfile && currentUser) {
        // Save user profile & address updates
        const updatePayload = {
          name: formData.name,
          phone: formData.phone,
          addresses: [
            {
              label: 'Default Address',
              street: formData.street,
              city: formData.city,
              state: formData.state,
              zip: formData.zip,
              country: 'India',
              isDefault: true,
            },
          ],
        };
        const res = await api.updateProfile(updatePayload);
        if (res.success && res.data) {
          onAuthSuccess(res.data);
          setSuccessMsg('Profile and address saved successfully!');
          setTimeout(() => onClose(), 1000);
        } else {
          setError(res.message || 'Failed to update profile');
        }
      } else if (isLogin) {
        const res = await api.login(formData.email, formData.password);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Invalid email or password');
        }
      } else {
        const res = await api.register(formData.name, formData.email, formData.password);
        if (res.success && res.user) {
          onAuthSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Registration failed');
        }
      }
    } catch (err) {
      setError(err.message || 'Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-md max-h-[90vh] overflow-y-auto rounded-3xl bg-neutral-900 border border-neutral-800 p-7 shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mx-auto flex items-center justify-center mb-3">
            {isEditProfile ? <User className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <h3 className="text-2xl font-black text-white">
            {isEditProfile
              ? 'Your Customer Profile'
              : isLogin
              ? 'Welcome Back'
              : 'Create Customer Account'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {isEditProfile
              ? 'Save your address and contact details for express one-click checkout'
              : isLogin
              ? 'Sign in to access orders, saved addresses, and wishlist'
              : 'Join the platform for personalized discounts and fast delivery'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center">
            {error}
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold text-center flex items-center justify-center gap-1.5">
            <CheckCircle className="w-4 h-4" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          {(!isLogin || isEditProfile) && (
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="Rahul Verma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-300 font-bold mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                disabled={isEditProfile}
                placeholder="you@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 disabled:opacity-60 transition"
              />
            </div>
          </div>

          {!isEditProfile && (
            <div>
              <label className="block text-neutral-300 font-bold mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>
          )}

          {/* If editing profile, show saved address fields */}
          {isEditProfile && (
            <div className="space-y-3 pt-2 border-t border-neutral-800">
              <div>
                <label className="block text-neutral-300 font-bold mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute left-3.5 top-3" />
                  <input
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-300 font-bold mb-1">Default Street Address</label>
                <input
                  type="text"
                  placeholder="Flat / House / Landmark"
                  value={formData.street}
                  onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 font-bold mb-1">PIN Code</label>
                  <input
                    type="text"
                    placeholder="400001"
                    value={formData.zip}
                    onChange={(e) => setFormData({ ...formData, zip: e.target.value })}
                    className="w-full px-2.5 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 mt-2 rounded-2xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-neutral-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg transition active:scale-[0.98]"
          >
            <span>
              {loading
                ? 'Processing...'
                : isEditProfile
                ? 'Save Profile & Address'
                : isLogin
                ? 'Sign In to Account'
                : 'Create Account'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {!isEditProfile && (
          <div className="mt-5 pt-4 border-t border-neutral-800 text-center">
            <p className="text-xs text-neutral-400">
              {isLogin ? "Don't have an account yet?" : 'Already have an account?'}{' '}
              <button
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError('');
                }}
                className="text-emerald-400 font-bold hover:underline ml-1"
              >
                {isLogin ? 'Sign Up Free' : 'Sign In'}
              </button>
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[11px] text-neutral-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          <span>Encrypted JWT Authentication & MongoDB User Store</span>
        </div>
      </div>
    </div>
  );
}
