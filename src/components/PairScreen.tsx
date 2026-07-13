import React, { useState } from 'react';
import { Link2, Copy, Check, ArrowRight, Users, RefreshCw } from 'lucide-react';

interface PairScreenProps {
  pairCode: string | null;
  userName: string;
  onPairWithCode: (code: string) => Promise<void>;
  onRefreshProfile: () => Promise<void>;
  onLogout: () => Promise<void>;
  error: string | null;
}

export const PairScreen: React.FC<PairScreenProps> = ({
  pairCode,
  userName,
  onPairWithCode,
  onRefreshProfile,
  onLogout,
  error,
}) => {
  const [partnerCode, setPartnerCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCopy = async () => {
    if (pairCode) {
      await navigator.clipboard.writeText(pairCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePair = async () => {
    if (!partnerCode.trim()) return;
    setLoading(true);
    await onPairWithCode(partnerCode.trim());
    setLoading(false);
  };

  const handleRefresh = async () => {
    setLoading(true);
    await onRefreshProfile();
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
      <div className="w-full max-w-md">
        {/* Welcome */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>
            <Users size={32} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">¡Hola, {userName}! 👋</h1>
          <p className="text-slate-400 mt-1">Vincula tu cuenta con tu pareja</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-6 sm:p-8 shadow-2xl border" style={{ backgroundColor: 'rgba(30, 41, 59, 0.8)', borderColor: 'rgba(51, 65, 85, 0.5)', backdropFilter: 'blur(20px)' }}>
          {/* Your code section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, #3b82f6, #6366f1)' }}>1</span>
              Comparte tu código con tu pareja
            </h3>
            <p className="text-xs text-slate-400 mb-3 ml-8">
              Envíale este código por WhatsApp para que se vincule contigo
            </p>
            <div className="flex items-center gap-2 ml-8">
              <div className="flex-1 px-4 py-3 rounded-xl border text-center font-mono text-lg font-bold tracking-widest text-blue-400"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(59, 130, 246, 0.3)' }}>
                {pairCode || 'Cargando...'}
              </div>
              <button
                onClick={handleCopy}
                className="p-3 rounded-xl border transition-all hover:brightness-110 active:scale-95"
                style={{
                  backgroundColor: copied ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                  borderColor: copied ? 'rgba(16, 185, 129, 0.4)' : 'rgba(59, 130, 246, 0.4)',
                }}
              >
                {copied ? <Check size={18} className="text-emerald-400" /> : <Copy size={18} className="text-blue-400" />}
              </button>
            </div>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-700" />
            <span className="text-xs text-slate-500 font-medium">O</span>
            <div className="flex-1 h-px bg-slate-700" />
          </div>

          {/* Enter partner code */}
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
              <span className="flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold" style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}>2</span>
              Ingresa el código de tu pareja
            </h3>
            <p className="text-xs text-slate-400 mb-3 ml-8">
              Si tu pareja ya se registró, pídele su código e ingrésalo aquí
            </p>

            {error && (
              <div className="mb-3 ml-8 p-3 rounded-xl text-xs text-rose-300 border" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', borderColor: 'rgba(239, 68, 68, 0.3)' }}>
                ⚠️ {error}
              </div>
            )}

            <div className="flex items-center gap-2 ml-8">
              <input
                type="text"
                value={partnerCode}
                onChange={(e) => setPartnerCode(e.target.value.toUpperCase())}
                placeholder="MACOL-XXXX"
                maxLength={10}
                className="flex-1 px-4 py-3 rounded-xl border text-sm text-white placeholder-slate-500 font-mono tracking-wider text-center focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
                style={{ backgroundColor: 'rgba(15, 23, 42, 0.6)', borderColor: 'rgba(51, 65, 85, 0.5)' }}
              />
              <button
                onClick={handlePair}
                disabled={loading || !partnerCode.trim()}
                className="p-3 rounded-xl text-white transition-all hover:brightness-110 active:scale-95 disabled:opacity-50"
                style={{ background: 'linear-gradient(135deg, #8b5cf6, #ec4899)' }}
              >
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Refresh button */}
          <div className="mt-6 flex flex-col items-center gap-3">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-medium text-slate-400 border transition-all hover:text-white hover:border-slate-500"
              style={{ borderColor: 'rgba(51, 65, 85, 0.5)' }}
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              ¿Tu pareja ya ingresó el código? Actualizar
            </button>

            <button
              onClick={onLogout}
              className="text-xs text-slate-500 hover:text-rose-400 transition-colors"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
