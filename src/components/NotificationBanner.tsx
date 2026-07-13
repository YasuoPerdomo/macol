import React from 'react';
import { X, UserCheck } from 'lucide-react';
import { ActivityItem } from '../hooks/useFirebaseData';

interface NotificationBannerProps {
  notification: ActivityItem | null;
  onDismiss: () => void;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({ notification, onDismiss }) => {
  if (!notification) return null;

  return (
    <div 
      className="fixed top-4 right-4 left-4 sm:left-auto sm:w-96 z-[100] animate-slide-in"
      style={{ animation: 'slideIn 0.4s ease-out' }}
    >
      <style>{`
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
      <div 
        className="rounded-2xl p-4 shadow-2xl border flex items-start gap-3"
        style={{ 
          backgroundColor: 'rgba(30, 41, 59, 0.95)', 
          borderColor: 'rgba(59, 130, 246, 0.4)',
          backdropFilter: 'blur(20px)'
        }}
      >
        <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
          <UserCheck size={16} className="text-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-bold text-blue-400">{notification.userName}</p>
          <p className="text-sm text-white mt-0.5">{notification.action}</p>
          <p className="text-[10px] text-slate-500 mt-1">
            {new Date(notification.timestamp).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        <button 
          onClick={onDismiss} 
          className="flex-shrink-0 p-1 rounded-lg hover:bg-slate-700/50 text-slate-500 hover:text-white transition-colors"
        >
          <X size={14} />
        </button>
      </div>
    </div>
  );
};
