import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, X, Shield, ArrowRight, Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/apiService';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (token: string, user: { username: string; role: string }) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [username, setUsername] = useState('doghealthtip');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const result = await apiService.loginAdmin(username, password);

      if (!result.success || !result.token || !result.user) {
        throw new Error(result.error || 'Invalid credentials. Access denied.');
      }

      onLoginSuccess(result.token, result.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleUseDefaultCredentials = () => {
    setUsername('doghealthtip');
    setPassword('Pass@2026#');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-[#FAF6EC] border border-[#E8E0D3] rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
        aria-labelledby="admin-dialog-title"
      >
        {/* Header */}
        <div className="bg-[#24451F] text-white px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-[#315B2B] rounded-lg">
              <Shield className="w-5 h-5 text-[#CEECB4]" />
            </div>
            <div>
              <h2 id="admin-dialog-title" className="font-serif text-lg font-bold">
                Editorial Admin Portal
              </h2>
              <p className="text-[11px] text-[#CEECB4]">Secure Veterinary Publication Access</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-white/70 hover:text-white transition-colors p-1 rounded-md cursor-pointer"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold">{error}</p>
                <button
                  type="button"
                  onClick={handleUseDefaultCredentials}
                  className="mt-1.5 text-xs text-[#315B2B] underline font-medium hover:text-[#24451F] cursor-pointer"
                >
                  Click here to autofill default credentials
                </button>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718C5C]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username (e.g., doghealthtip)"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E0D3] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#315B2B] text-[#1c1c16]"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider">
                Admin Password
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-[#718C5C] hover:text-[#315B2B] flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718C5C]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-9 pr-10 py-2.5 bg-white border border-[#E8E0D3] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#315B2B] text-[#1c1c16]"
              />
            </div>
          </div>

          {/* Quick Credential Hint / Helper for Cloudflare deployment */}
          <div className="bg-[#F1E7D4]/50 border border-[#E8E0D3] rounded-xl p-3 flex items-center justify-between gap-2">
            <div className="text-[11px] text-[#4A3525]">
              <span className="font-bold text-[#315B2B]">Default Admin:</span>
              <span className="ml-1 text-[#5c4a38]">doghealthtip</span>
            </div>
            <button
              type="button"
              onClick={handleUseDefaultCredentials}
              className="text-[11px] font-bold text-[#315B2B] hover:text-[#24451F] bg-white px-2.5 py-1 rounded-lg border border-[#E8E0D3] shadow-2xs hover:bg-[#FAF6EC] transition-colors cursor-pointer flex items-center gap-1"
            >
              <CheckCircle2 className="w-3 h-3 text-[#315B2B]" />
              <span>Autofill</span>
            </button>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 bg-[#24451F] hover:bg-[#315B2B] disabled:bg-[#718C5C] text-white text-sm font-bold rounded-xl shadow-md transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>Authenticate & Enter Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>

          <p className="text-[11px] text-center text-[#718C5C] pt-2">
            Multi-environment authentication active (Cloudflare Edge, Pages, & Server compatible).
          </p>
        </form>
      </div>
    </div>
  );
};
