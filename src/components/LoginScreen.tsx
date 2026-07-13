import React, { useState } from 'react';
import { LogIn, UserPlus, Mail, Lock, User, Eye, EyeOff, TrendingUp } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onRegister: (email: string, password: string, name: string) => Promise<any>;
  error: string | null;
  themeColors: any;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onRegister, error, themeColors }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        await onRegister(email, password, name);
      } else {
        await onLogin(email, password);
      }
    } catch {
      // error is handled by parent
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <TrendingUp size={32} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white tracking-tight">Macol</h1>
          <p className="text-slate-400 mt-1">Finanzas en pareja, bajo control</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-8 shadow-2xl border" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: 'rgba(51, 65, 85, 0.5)', backdropFilter: 'blur(20px)' }}>
          {/* Tabs */}
          <div className="flex rounded-xl overflow-hidden mb-6" style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)' }}>
            <button
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${!isRegister ? 'text-white shadow-md' : 'text-slate-400'}`}
              style={!isRegister ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' } : {}}
            >
              <LogIn size={14} className="inline mr-1.5" />
              Iniciar Sesión
            </button>
            <button
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 text-sm font-semibold transition-all ${isRegister ? 'text-white shadow-md' : 'text-slate-400'}`}
              style={isRegister ? { background: 'linear-gradient(135deg, #3b82f6, #6366f1)' } : {}}
            >
              <UserPlus size={14} className="inline mr-1.5" />
              Registrarse
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm text-rose-300 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
              ⚠️ {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isRegister && (
              <div>
                <label className="text-xs font-medium text-slate-400 mb-1.5 block">Tu nombre</label>
                <div className="relative">
                  <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ej: Luis"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Correo electrónico</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-10 pr-4 py-3 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-slate-400 mb-1.5 block">Contraseña</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  required
                  minLength={6}
                  className="w-full pl-10 pr-12 py-3 rounded-xl border text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                  style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:brightness-110 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed mt-2"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}
            >
              {loading ? '⏳ Procesando...' : isRegister ? '✨ Crear cuenta' : '🔐 Entrar'}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-slate-500 mt-6">
          Tus datos están seguros y encriptados 🔒
        </p>
      </div>
    </div>
  );
};
