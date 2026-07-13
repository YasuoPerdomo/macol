import React from 'react';
import { Clock, UserCheck, X } from 'lucide-react';
import { ActivityItem } from '../hooks/useFirebaseData';

interface ActivityLogProps {
  activities: ActivityItem[];
  currentUserId: string;
  themeColors: any;
  onClose: () => void;
}

export const ActivityLog: React.FC<ActivityLogProps> = ({ activities, currentUserId, themeColors, onClose }) => {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHrs = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHrs / 24);

    if (diffMins < 1) return 'Ahora mismo';
    if (diffMins < 60) return `Hace ${diffMins} min`;
    if (diffHrs < 24) return `Hace ${diffHrs}h`;
    if (diffDays < 7) return `Hace ${diffDays}d`;
    return date.toLocaleDateString('es-PE', { day: '2-digit', month: 'short' });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      
      {/* Panel */}
      <div 
        className="relative w-full sm:max-w-md max-h-[80vh] rounded-t-2xl sm:rounded-2xl shadow-2xl border overflow-hidden flex flex-col"
        style={{ backgroundColor: themeColors.cardBg, borderColor: themeColors.border }}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between" style={{ borderColor: themeColors.border }}>
          <h3 className="font-bold text-base flex items-center gap-2" style={{ color: themeColors.textPrimary }}>
            <Clock size={18} className="text-blue-500" />
            Historial de Actividad
          </h3>
          <button 
            onClick={onClose} 
            className="p-2 rounded-xl hover:bg-slate-500/10 transition-colors"
            style={{ color: themeColors.textSecondary }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Activity list */}
        <div className="flex-1 overflow-y-auto p-4">
          {activities.length === 0 ? (
            <div className="text-center py-8">
              <Clock size={32} className="mx-auto mb-2 text-slate-400" />
              <p className="text-sm" style={{ color: themeColors.textSecondary }}>
                No hay actividad todavía
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {activities.map((activity, idx) => {
                const isMe = activity.userId === currentUserId;
                return (
                  <div 
                    key={activity.id || idx}
                    className="flex items-start gap-3 p-3 rounded-xl border transition-colors"
                    style={{ 
                      backgroundColor: isMe ? 'transparent' : 'rgba(59, 130, 246, 0.05)',
                      borderColor: themeColors.border 
                    }}
                  >
                    <div 
                      className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                      style={{ background: isMe ? 'linear-gradient(135deg, #8b5cf6, #6366f1)' : 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
                    >
                      {activity.userName.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold" style={{ color: themeColors.textPrimary }}>
                          {isMe ? 'Tú' : activity.userName}
                        </span>
                        <span className="text-[10px]" style={{ color: themeColors.textSecondary }}>
                          {formatTime(activity.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs mt-0.5" style={{ color: themeColors.textSecondary }}>
                        {activity.action}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
