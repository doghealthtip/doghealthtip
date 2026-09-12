import React, { useState } from 'react';
import { Lock, User, KeyRound, AlertCircle, X, Shield, ArrowRight, Loader2 } from 'lucide-react';

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: username.trim(),
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Invalid credentials. Access denied.');
      }

      // Store in sessionStorage for tab persistence
      sessionStorage.setItem('canine_admin_token', data.token);
      onLoginSuccess(data.token, data.user);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
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
            className="text-white/70 hover:text-white transition-colors p-1 rounded-md"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{error}</span>
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
            <label className="block text-xs font-bold text-[#4A3525] uppercase tracking-wider mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[#718C5C]">
                <KeyRound className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full pl-9 pr-3 py-2.5 bg-white border border-[#E8E0D3] rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-[#315B2B] text-[#1c1c16]"
              />
            </div>
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
            Authentication is verified server-side with encrypted token exchange.
          </p>
        </form>
      </div>
    </div>
  );
};
