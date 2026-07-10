import React from 'react';
import { FixedExpenseItem } from '../types';
import { AlertCircle, Bell, Check, Clock } from 'lucide-react';

interface CalendarProps {
  monthNum: number; // 0 to 11
  year: number;
  fixedExpenses: FixedExpenseItem[];
  themeColors: any;
}

export const Calendar: React.FC<CalendarProps> = ({
  monthNum,
  year,
  fixedExpenses,
  themeColors,
}) => {
  // Get days in month
  const getDaysInMonth = (m: number, y: number) => {
    return new Date(y, m + 1, 0).getDate();
  };

  // Get starting day of the week (0 = Sunday, 1 = Monday, etc.)
  const getStartDayOfWeek = (m: number, y: number) => {
    const day = new Date(y, m, 1).getDay();
    // Convert Sunday (0) to 6, Monday (1) to 0, etc.
    return day === 0 ? 6 : day - 1;
  };

  const daysInMonth = getDaysInMonth(monthNum, year);
  const startDay = getStartDayOfWeek(monthNum, year);

  // Helper to parse due date day
  const getDueDay = (dueDateStr: string): number | null => {
    if (!dueDateStr) return null;
    const parts = dueDateStr.split('/');
    if (parts.length > 0) {
      const dayNum = parseInt(parts[0], 10);
      if (!isNaN(dayNum)) return dayNum;
    }
    return null;
  };

  // Helper to parse full date
  const parseDueDate = (dueStr: string): Date | null => {
    if (!dueStr) return null;
    const parts = dueStr.split('/');
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1; // 0-indexed
      const year = parseInt(parts[2], 10);
      return new Date(year, month, day);
    }
    return null;
  };

  // Find expenses due on a specific day
  const getExpensesForDay = (day: number): FixedExpenseItem[] => {
    return fixedExpenses.filter((expense) => {
      const dueDay = getDueDay(expense.due);
      return dueDay === day;
    });
  };

  const weekDays = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];

  const calendarCells = [];
  // Empty cells for padding
  for (let i = 0; i < startDay; i++) {
    calendarCells.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  const isDark = themeColors.cardBg !== '#ffffff';

  // Days of month
  for (let d = 1; d <= daysInMonth; d++) {
    const expensesOnDay = getExpensesForDay(d);
    const hasExpenses = expensesOnDay.length > 0;
    const allPaid = hasExpenses && expensesOnDay.every(e => e.paid);
    
    calendarCells.push(
      <div
        key={`day-${d}`}
        id={`calendar-day-${d}`}
        className="relative flex h-8 w-8 flex-col items-center justify-center rounded-md text-xs font-medium transition-colors cursor-pointer group hover:bg-slate-500/10"
        style={{ color: themeColors.textPrimary }}
      >
        <span className="z-10">{d}</span>
        
        {/* Highlight if there's an expense due */}
        {hasExpenses && (
          <div
            className={`absolute bottom-0.5 h-1.5 w-1.5 rounded-full ${
              allPaid ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`}
          />
        )}

        {/* Beautiful Hover Tooltip */}
        {hasExpenses && (
          <div className="absolute bottom-full left-1/2 z-50 mb-1 hidden w-40 -translate-x-1/2 flex-col items-center rounded bg-slate-900 p-2 text-[10px] leading-tight text-white shadow-lg group-hover:flex">
            <p className="font-bold border-b border-slate-700 pb-1 mb-1 w-full text-center">
              Vence el día {d}
            </p>
            {expensesOnDay.map((e) => (
              <div key={e.id} className="flex justify-between w-full mt-0.5">
                <span className="truncate max-w-[80px]">{e.description}:</span>
                <span className={e.paid ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  S/ {e.real ? e.real.toLocaleString('es-PE') : e.budget.toLocaleString('es-PE')}
                </span>
              </div>
            ))}
            <div className="absolute top-full left-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1 bg-slate-900 rotate-45" />
          </div>
        )}
      </div>
    );
  }

  // Generate Notifications
  const todayDate = new Date();
  todayDate.setHours(0, 0, 0, 0);

  const notifications = fixedExpenses
    .filter(e => !e.paid)
    .map(e => {
      const dueDate = parseDueDate(e.due);
      if (!dueDate) return null;
      dueDate.setHours(0, 0, 0, 0);

      const diffTime = dueDate.getTime() - todayDate.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      return {
        expense: e,
        daysLeft: diffDays,
      };
    })
    .filter((n): n is { expense: FixedExpenseItem; daysLeft: number } => n !== null)
    .sort((a, b) => a.daysLeft - b.daysLeft);

  const urgentAlertsCount = notifications.filter(n => n.daysLeft <= 3).length;

  return (
    <div 
      className="rounded-2xl p-4 shadow-sm border flex flex-col gap-4" 
      style={{ 
        backgroundColor: themeColors.cardBg,
        borderColor: themeColors.border
      }}
      id="finance-calendar-card"
    >
      <div>
        <h3 className="text-sm font-semibold tracking-tight flex items-center justify-between" style={{ color: themeColors.textPrimary }}>
          <span className="flex items-center gap-2">
            <span>Calendario de Vencimientos</span>
            {urgentAlertsCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white animate-bounce">
                {urgentAlertsCount}
              </span>
            )}
          </span>
          <span className="text-xs font-normal" style={{ color: themeColors.textSecondary }}>
            {year}
          </span>
        </h3>
      </div>
      
      <div className="grid grid-cols-7 gap-1 text-center font-semibold text-xs text-slate-400">
        {weekDays.map((wd, idx) => (
          <div key={idx} className="h-6 flex items-center justify-center">
            {wd}
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {calendarCells}
      </div>

      <div 
        className="pt-2 border-t flex items-center gap-4 text-[10px]"
        style={{ borderTopColor: themeColors.border, color: themeColors.textSecondary }}
      >
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-500" />
          <span>Gastos fijos pagados</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-amber-500" />
          <span>Por pagar</span>
        </div>
      </div>

      {/* Notifications Panel */}
      <div className="mt-2 pt-3 border-t" style={{ borderTopColor: themeColors.border }}>
        <h4 className="text-xs font-bold flex items-center gap-1.5 mb-2" style={{ color: themeColors.textPrimary }}>
          <Bell size={13} className="text-amber-500" />
          Vencimientos Pendientes
        </h4>
        
        {notifications.length === 0 ? (
          <div 
            className="border rounded-xl p-2.5 flex items-center gap-2 text-[11px]"
            style={{ 
              backgroundColor: isDark ? 'rgba(16, 185, 129, 0.1)' : '#f0fdf4', 
              borderColor: isDark ? 'rgba(16, 185, 129, 0.2)' : '#bbf7d0', 
              color: isDark ? '#34d399' : '#166534' 
            }}
          >
            <Check size={14} className="text-emerald-500 flex-shrink-0" />
            <span>¡Todos tus gastos fijos de este mes están pagados!</span>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[160px] overflow-y-auto pr-1">
            {notifications.map(({ expense, daysLeft }) => {
              let badgeColor = isDark ? "bg-slate-800 text-slate-300 border-slate-700" : "bg-slate-100 text-slate-700 border-slate-200";
              let badgeText = `Vence en ${daysLeft} días`;
              
              if (daysLeft < 0) {
                badgeColor = isDark ? "bg-rose-950/40 text-rose-300 border-rose-900/50 font-semibold" : "bg-rose-50 text-rose-700 border-rose-200 font-semibold";
                badgeText = `VENCIDO hace ${Math.abs(daysLeft)} días`;
              } else if (daysLeft === 0) {
                badgeColor = "bg-rose-500 text-white border-rose-600 font-bold animate-pulse";
                badgeText = "VENCE HOY 🚨";
              } else if (daysLeft <= 3) {
                badgeColor = isDark ? "bg-amber-950/40 text-amber-300 border-amber-900/50 font-semibold" : "bg-amber-50 text-amber-700 border-amber-200 font-semibold";
                badgeText = `Vence en ${daysLeft} días ⚠️`;
              }

              return (
                <div 
                  key={expense.id} 
                  className="flex items-center justify-between p-2 rounded-xl border transition-colors text-[11px] hover:bg-slate-500/5"
                  style={{ 
                    backgroundColor: isDark ? 'rgba(30, 41, 59, 0.3)' : 'rgba(248, 250, 252, 0.5)', 
                    borderColor: themeColors.border 
                  }}
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="font-semibold truncate max-w-[120px]" style={{ color: themeColors.textPrimary }}>{expense.description}</span>
                    <span className="font-mono text-[10px]" style={{ color: themeColors.textSecondary }}>S/ {expense.real ? expense.real.toLocaleString('es-PE') : expense.budget.toLocaleString('es-PE')}</span>
                  </div>
                  <div className={`px-2 py-0.5 rounded-full border text-[9px] text-center ${badgeColor}`}>
                    {badgeText}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
