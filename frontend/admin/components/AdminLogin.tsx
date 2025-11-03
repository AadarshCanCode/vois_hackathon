import React, { useState } from 'react';
import { Shield, Eye, EyeOff, Settings, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface AdminLoginProps {
  onBack?: () => void;
  onSuccess?: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await (login as (email: string, password: string, role: 'admin') => Promise<boolean>)(email, password, 'admin');
      onSuccess?.();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-page flex items-center justify-center p-4">
      <div className="max-w-lg w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <Shield className="h-20 w-20 accent-emerald animate-pulse text-contrast" />
              <div className="absolute inset-0 h-20 w-20 accent-emerald animate-ping opacity-20">
                <Shield className="h-full w-full text-contrast" />
              </div>
            </div>
          </div>
          <h2 className="text-4xl font-bold text-primary mb-3">Admin Access</h2>
          <p className="text-xl text-muted">Secure administrative portal</p>
        </div>

  <div className="bg-card rounded-3xl shadow-2xl p-8 space-y-6 border border-card">
          {onBack && (
            <button
              onClick={onBack}
              className="flex items-center text-slate-300 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          )}

          {error && (
            <div className="bg-red-500/20 border border-red-500/50 rounded-xl p-4 animate-scale-in">
              <p className="text-red-200 text-sm text-center">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex justify-center mb-6">
              <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center">
                <Settings className="h-8 w-8 text-orange-400" />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-muted mb-2">
                Administrator Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-4 bg-card border-card rounded-2xl text-contrast placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                placeholder="Enter administrator email"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-muted mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-4 pr-12 bg-card border-card rounded-2xl text-contrast placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all duration-300"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-300 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 btn-primary rounded-2xl shadow transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-contrast"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Access Admin Panel'
              )}
            </button>
          </form>

          <div className="bg-muted border border-card rounded-xl p-4">
            <div className="flex items-center text-muted mb-2">
              <Shield className="h-5 w-5 mr-2 accent-amber" />
              <span className="font-medium text-primary">Security Notice</span>
            </div>
            <p className="text-muted text-sm">
              Admin access is restricted to authorized personnel only. All login attempts are monitored and logged.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};