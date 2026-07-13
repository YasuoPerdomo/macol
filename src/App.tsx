import React, { useState, useEffect, useMemo } from 'react';
import { 
  TrendingUp, 
  Wallet, 
  Calendar as CalendarIcon, 
  RefreshCw, 
  PiggyBank, 
  CreditCard, 
  DollarSign, 
  CheckCircle2, 
  Plus, 
  Trash2,
  Settings,
  HelpCircle,
  FileSpreadsheet,
  Sun,
  Moon,
  Target,
  AlertTriangle,
  Bell,
  LogOut,
  FileDown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Confetti from 'react-confetti';
import CountUp from 'react-countup';
import { exportToPDF, exportToExcel } from './utils/exportUtils';
import { getInitialData, monthsList, getThemeColors } from './data/initialData';
import { MonthlyData, ThemeType, IncomeItem, FixedExpenseItem, VariableExpenseItem, DebtItem, SavingItem } from './types';
import { Calendar } from './components/Calendar';
import { FinancialTable } from './components/FinancialTable';
import { DashboardCharts } from './components/DashboardCharts';
import { AnnualEvolutionChart } from './components/AnnualEvolutionChart';
import { LoginScreen } from './components/LoginScreen';
import { PairScreen } from './components/PairScreen';
import { NotificationBanner } from './components/NotificationBanner';
import { ActivityLog } from './components/ActivityLog';
import { useAuth } from './hooks/useAuth';
import { useFirebaseData } from './hooks/useFirebaseData';

export default function App() {
  // Auth state
  const { user, userProfile, loading: authLoading, error: authError, setError: setAuthError, register, login, logout, pairWithCode, refreshProfile } = useAuth();

  // Firebase data (real-time sync)
  const firebaseData = useFirebaseData({
    coupleId: userProfile?.coupleId || null,
    userId: user?.uid || '',
    userName: userProfile?.displayName || '',
  });

  // Activity log visibility
  const [showActivityLog, setShowActivityLog] = useState(false);

  // Theme state: default to 'navy' (Azul Marino), options: 'pearl' (Azul Perla), 'steel' (Azul Acero)
  const [theme, setTheme] = useState<ThemeType>(() => {
    const savedTheme = localStorage.getItem('finance_theme');
    return (savedTheme as ThemeType) || 'navy';
  });

  // Dark mode state
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('finance_dark_mode');
    return saved === 'true';
  });



  // Current month state (tabs at the bottom): default to 'Sep' (Septiembre)
  const [currentMonthKey, setCurrentMonthKey] = useState('Sep');
  const [showConfetti, setShowConfetti] = useState(false);

  // Use Firebase data for allMonthsData and acumuladoMap
  const allMonthsData = firebaseData.allMonthsData;
  const acumuladoMap = firebaseData.acumuladoMap;
  const annualLimit = firebaseData.annualLimit;
  const setAllMonthsData = (updater: any) => {
    const newData = typeof updater === 'function' ? updater(allMonthsData) : updater;
    firebaseData.saveMonthsData(newData);
  };
  const setAcumuladoMap = (updater: any) => {
    const newData = typeof updater === 'function' ? updater(acumuladoMap) : updater;
    firebaseData.saveAcumulado(newData);
  };
  const setAnnualLimit = (updater: any) => {
    const newData = typeof updater === 'function' ? updater(annualLimit) : updater;
    firebaseData.saveAnnualLimit(newData);
  };

  useEffect(() => {
    localStorage.setItem('finance_theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finance_dark_mode', String(isDarkMode));
  }, [isDarkMode]);




  // Sum of expenses for ALL 12 months (Gasto fijos + Gasto variables)
  const totalAnnualExpenses = useMemo(() => {
    let budgetTotal = 0;
    let realTotal = 0;
    monthsList.forEach((m) => {
      const mData = allMonthsData[m.key] || getInitialData()[m.key];
      const fixedBudget = (mData.fixedExpenses || []).reduce((s, item) => s + (item.budget || 0), 0);
      const fixedReal = (mData.fixedExpenses || []).reduce((s, item) => s + (item.real || 0), 0);
      const variableBudget = (mData.variableExpenses || []).reduce((s, item) => s + (item.budget || 0), 0);
      const variableReal = (mData.variableExpenses || []).reduce((s, item) => s + (item.real || 0), 0);
      
      budgetTotal += (fixedBudget + variableBudget);
      realTotal += (fixedReal + variableReal);
    });
    return { budget: budgetTotal, real: realTotal };
  }, [allMonthsData]);

  // Retrieve current active theme colors
  const themeColors = useMemo(() => getThemeColors(theme, isDarkMode), [theme, isDarkMode]);

  // Retrieve current selected month full details
  const currentMonthData = useMemo(() => {
    const rawData = allMonthsData[currentMonthKey] || getInitialData()[currentMonthKey];
    return {
      ...rawData,
      incomes: rawData.incomes || [],
      fixedExpenses: rawData.fixedExpenses || [],
      variableExpenses: rawData.variableExpenses || [],
      debts: rawData.debts || [],
      savings: rawData.savings || []
    };
  }, [allMonthsData, currentMonthKey]);

  const currentMonthObj = useMemo(() => {
    return monthsList.find((m) => m.key === currentMonthKey) || monthsList[8];
  }, [currentMonthKey]);

  // Current month's accumulated balance state
  const currentAcumulado = useMemo(() => {
    return acumuladoMap[currentMonthKey] || { budget: 0, real: 0 };
  }, [acumuladoMap, currentMonthKey]);

  // Calculations for current month
  const totals = useMemo(() => {
    const incomesBudget = (currentMonthData.incomes || []).reduce((s, item) => s + (item.budget || 0), 0);
    const incomesReal = (currentMonthData.incomes || []).reduce((s, item) => s + (item.real || 0), 0);

    const fixedExpensesBudget = (currentMonthData.fixedExpenses || []).reduce((s, item) => s + (item.budget || 0), 0);
    const fixedExpensesReal = (currentMonthData.fixedExpenses || []).reduce((s, item) => s + (item.real || 0), 0);

    const variableExpensesBudget = (currentMonthData.variableExpenses || []).reduce((s, item) => s + (item.budget || 0), 0);
    const variableExpensesReal = (currentMonthData.variableExpenses || []).reduce((s, item) => s + (item.real || 0), 0);

    const debtsBudget = (currentMonthData.debts || []).reduce((s, item) => s + (item.budget || 0), 0);
    const debtsReal = (currentMonthData.debts || []).reduce((s, item) => s + (item.real || 0), 0);

    const savingsBudget = (currentMonthData.savings || []).reduce((s, item) => s + (item.budget || 0), 0);
    const savingsReal = (currentMonthData.savings || []).reduce((s, item) => s + (item.real || 0), 0);

    const totalExpensesBudget = fixedExpensesBudget + variableExpensesBudget;
    const totalExpensesReal = fixedExpensesReal + variableExpensesReal;

    const cashFlowRestanteBudget = currentAcumulado.budget + incomesBudget - totalExpensesBudget - savingsBudget - debtsBudget;
    const cashFlowRestanteReal = currentAcumulado.real + incomesReal - totalExpensesReal - savingsReal - debtsReal;

    // Total fixed expenses paid
    const totalFixedPaidCount = currentMonthData.fixedExpenses.filter(e => e.paid).length;
    const totalFixedCount = currentMonthData.fixedExpenses.length;

    return {
      incomes: { budget: incomesBudget, real: incomesReal },
      fixedExpenses: { budget: fixedExpensesBudget, real: fixedExpensesReal },
      variableExpenses: { budget: variableExpensesBudget, real: variableExpensesReal },
      expenses: { budget: totalExpensesBudget, real: totalExpensesReal },
      debts: { budget: debtsBudget, real: debtsReal },
      savings: { budget: savingsBudget, real: savingsReal },
      restante: { budget: cashFlowRestanteBudget, real: cashFlowRestanteReal },
      fixedPaid: { paidCount: totalFixedPaidCount, totalCount: totalFixedCount }
    };
  }, [currentMonthData, currentAcumulado]);

  // Confetti effect when hitting savings goal and having positive remaining balance
  useEffect(() => {
    if (totals.restante.real >= 0 && totals.savings.real >= totals.savings.budget && totals.savings.budget > 0) {
      const storageKey = `confetti_${currentMonthKey}_${totals.savings.real}`;
      if (!localStorage.getItem(storageKey)) {
        setShowConfetti(true);
        localStorage.setItem(storageKey, 'true');
        setTimeout(() => setShowConfetti(false), 6000);
      }
    }
  }, [totals.restante.real, totals.savings.real, totals.savings.budget, currentMonthKey]);

  // Calculations for annual evolution
  const annualData = useMemo(() => {
    return monthsList.map((m) => {
      const mData = allMonthsData[m.key] || getInitialData()[m.key];
      const acumulado = acumuladoMap[m.key] || { budget: 0, real: 0 };

      const incomesReal = (mData.incomes || []).reduce((s, item) => s + (item.real || 0), 0);
      const fixedExpensesReal = (mData.fixedExpenses || []).reduce((s, item) => s + (item.real || 0), 0);
      const variableExpensesReal = (mData.variableExpenses || []).reduce((s, item) => s + (item.real || 0), 0);
      const debtsReal = (mData.debts || []).reduce((s, item) => s + (item.real || 0), 0);
      const savingsReal = (mData.savings || []).reduce((s, item) => s + (item.real || 0), 0);

      const totalExpensesReal = fixedExpensesReal + variableExpensesReal;
      const cashFlowRestanteReal = acumulado.real + incomesReal - totalExpensesReal - savingsReal - debtsReal;

      return {
        key: m.key,
        name: m.name,
        'Ahorro Mensual': savingsReal,
        'Saldo Restante': cashFlowRestanteReal,
      };
    });
  }, [allMonthsData, acumuladoMap]);

  // Handlers for table item updating
  const handleUpdateItem = (tableType: 'incomes' | 'fixedExpenses' | 'variableExpenses' | 'debts' | 'savings', id: string, field: string, value: any) => {
    setAllMonthsData((prev: any) => {
      const monthData = { ...prev[currentMonthKey] };
      const list = [...((monthData[tableType] as any[]) || [])];
      const idx = list.findIndex((item) => item.id === id);
      if (idx !== -1) {
        list[idx] = { ...list[idx], [field]: value };
        monthData[tableType] = list as any;
      }
      return { ...prev, [currentMonthKey]: monthData };
    });
  };

  const tableTypeNames: Record<string, string> = {
    incomes: 'Ingresos',
    fixedExpenses: 'Gastos Fijos',
    variableExpenses: 'Gastos Variables',
    debts: 'Deudas',
    savings: 'Ahorros',
  };

  const handleAddItem = (tableType: 'incomes' | 'fixedExpenses' | 'variableExpenses' | 'debts' | 'savings') => {
    setAllMonthsData((prev: any) => {
      const monthData = { ...prev[currentMonthKey] };
      const list = [...((monthData[tableType] as any[]) || [])];
      
      const newId = `${tableType.charAt(0)}-${Date.now()}`;
      let newItem: any = { id: newId, description: '', budget: 0, real: 0 };
      
      if (tableType === 'fixedExpenses') {
        newItem = { ...newItem, paid: false, due: `15/${(currentMonthObj.monthNum + 1).toString().padStart(2, '0')}/${currentMonthData.year}` };
      }
      
      list.push(newItem);
      monthData[tableType] = list as any;
      return { ...prev, [currentMonthKey]: monthData };
    });
    firebaseData.logActivity(`Agregó una fila en ${tableTypeNames[tableType]} (${currentMonthData.monthName})`);
  };

  const handleDeleteItem = (tableType: 'incomes' | 'fixedExpenses' | 'variableExpenses' | 'debts' | 'savings', id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este elemento?')) {
      const list = (allMonthsData[currentMonthKey] as any)?.[tableType] || [];
      const item = list.find((i: any) => i.id === id);
      const itemName = item?.description || 'elemento';

      setAllMonthsData((prev: any) => {
        const monthData = { ...prev[currentMonthKey] };
        const list = [...((monthData[tableType] as any[]) || [])];
        monthData[tableType] = list.filter((item) => item.id !== id) as any;
        return { ...prev, [currentMonthKey]: monthData };
      });
      firebaseData.logActivity(`Eliminó '${itemName}' de ${tableTypeNames[tableType]} (${currentMonthData.monthName})`);
    }
  };

  // Handler for updating the current month's "Acumulado" balance
  const handleUpdateAcumulado = (field: 'budget' | 'real', val: number) => {
    setAcumuladoMap((prev) => ({
      ...prev,
      [currentMonthKey]: {
        ...prev[currentMonthKey],
        [field]: val,
      },
    }));
  };

  // Reset current month to defaults
  const handleResetMonth = () => {
    if (window.confirm(`¿Estás seguro de que deseas restablecer los datos de ${currentMonthData.monthName} a los valores iniciales?`)) {
      const defaults = getInitialData();
      setAllMonthsData((prev) => ({
        ...prev,
        [currentMonthKey]: defaults[currentMonthKey],
      }));
      setAcumuladoMap((prev) => ({
        ...prev,
        [currentMonthKey]: { budget: currentMonthKey === 'Sep' ? 50000 : 100000, real: currentMonthKey === 'Sep' ? 50000 : 100000 },
      }));
      firebaseData.logActivity(`Restableció los datos de ${currentMonthData.monthName} a valores iniciales`);
    }
  };

  // Reset entire dashboard
  const handleResetAll = () => {
    if (window.confirm('¿Deseas restablecer TODA la planilla de finanzas? Se perderán todos tus cambios personalizados en todos los meses.')) {
      setAllMonthsData(getInitialData());
      localStorage.removeItem('finance_all_months_data_v2');
      localStorage.removeItem('finance_acumulado_map_v2');
      setCurrentMonthKey('Sep');
      firebaseData.logActivity(`Restableció toda la planilla a los valores por defecto`);
    }
  };

  // Formatting utility
  const formatCurrency = (val: number) => {
    return 'S/ ' + val.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Calculate percentages for Total expenses progress card
  const expensesPercentage = useMemo(() => {
    if (totals.incomes.real === 0) return 0;
    return Math.min(Math.round((totals.expenses.real / totals.incomes.real) * 100), 100);
  }, [totals]);

  // Calculate Remaining percentage for donut display
  const remainingPercentage = useMemo(() => {
    if (totals.incomes.real === 0) return 100;
    const ratio = totals.restante.real / (totals.incomes.real + currentAcumulado.real);
    return Math.max(0, Math.min(100, Math.round(ratio * 100)));
  }, [totals, currentAcumulado]);

  // Show login screen if not authenticated
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)' }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4 animate-pulse" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}>
            <TrendingUp size={32} className="text-white" />
          </div>
          <p className="text-slate-400 text-sm">Cargando Macol...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen onLogin={login} onRegister={register} error={authError} themeColors={themeColors} />;
  }

  if (!userProfile?.coupleId) {
    return <PairScreen pairCode={userProfile?.pairCode || null} userName={userProfile?.displayName || ''} onPairWithCode={pairWithCode} onRefreshProfile={refreshProfile} onLogout={logout} error={authError} />;
  }

  return (
    <div 
      className="min-h-screen flex flex-col font-sans transition-colors duration-500 pb-20"
      style={{ backgroundColor: themeColors.background }}
      id="main-app-container"
    >
      {/* Notification Banner */}
      <NotificationBanner notification={firebaseData.newNotification} onDismiss={firebaseData.dismissNotification} />

      {/* Activity Log Modal */}
      {showActivityLog && (
        <ActivityLog
          activities={firebaseData.activities}
          currentUserId={user?.uid || ''}
          themeColors={themeColors}
          onClose={() => setShowActivityLog(false)}
        />
      )}
      {/* Top Professional Banner */}
      <header 
        className="w-full text-white shadow-md z-10"
        style={{ 
          background: `linear-gradient(135deg, ${themeColors.secondary} 0%, ${themeColors.primary} 100%)` 
        }}
        id="app-header"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
              <FileSpreadsheet size={24} className="text-white animate-pulse" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">Plantilla de Finanzas Premium</h1>
              <p className="text-xs text-white/70">Organización inteligente con control presupuestario interactivo</p>
            </div>
          </div>

          {/* Theme Selector and Dark Mode Toggle */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-black/15 p-1 rounded-xl border border-white/10">
              <span className="text-[10px] uppercase font-bold text-white/50 px-2 tracking-wider">Estilo:</span>
              
              <button
                onClick={() => setTheme('pearl')}
                id="theme-pearl-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'pearl' 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Azul Perla
              </button>
              
              <button
                onClick={() => setTheme('steel')}
                id="theme-steel-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'steel' 
                    ? 'bg-slate-500 text-white shadow-md' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Azul Acero
              </button>
              
              <button
                onClick={() => setTheme('navy')}
                id="theme-navy-btn"
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  theme === 'navy' 
                    ? 'bg-blue-600 text-white shadow-md' 
                    : 'text-white/70 hover:text-white hover:bg-white/5'
                }`}
              >
                Azul Marino
              </button>
            </div>

            {/* Dark Mode Toggle Button */}
            <button
              onClick={() => setIsDarkMode(!isDarkMode)}
              id="dark-mode-toggle-btn"
              className="flex items-center justify-center p-2.5 rounded-xl bg-black/15 hover:bg-black/25 text-white border border-white/10 transition-all shadow-md active:scale-95"
              title={isDarkMode ? 'Modo Claro' : 'Modo Oscuro'}
            >
              {isDarkMode ? <Sun size={16} className="text-amber-400 animate-spin-slow" /> : <Moon size={16} className="text-blue-200" />}
            </button>

            {/* Activity Log Button */}
            <button
              onClick={() => setShowActivityLog(true)}
              className="relative flex items-center justify-center p-2.5 rounded-xl bg-black/15 hover:bg-black/25 text-white border border-white/10 transition-all shadow-md active:scale-95"
              title="Historial de actividad"
            >
              <Bell size={16} />
              {firebaseData.activities.filter(a => a.userId !== user?.uid && !a.read).length > 0 && (
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-rose-500 rounded-full animate-pulse" />
              )}
            </button>

            {/* User Info & Logout */}
            <div className="flex items-center gap-2 bg-black/15 px-3 py-1.5 rounded-xl border border-white/10">
              <span className="text-xs text-white/80 font-medium hidden sm:inline">{userProfile?.displayName}</span>
              <button
                onClick={logout}
                className="p-1.5 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-all"
                title="Cerrar sesión"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 w-full flex-1 flex flex-col gap-6" id="dashboard-stage">
        
        {/* Toolbar & Title */}
        <div 
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md p-4 rounded-2xl border shadow-sm" 
          style={{ 
            backgroundColor: isDarkMode ? `${themeColors.cardBg}b0` : 'rgba(255, 255, 255, 0.6)', 
            borderColor: themeColors.border 
          }}
          id="toolbar"
        >
          {showConfetti && <Confetti width={window.innerWidth} height={window.innerHeight} recycle={false} numberOfPieces={500} gravity={0.15} />}
          <div className="flex items-baseline gap-2">
            <h2 className="text-3xl font-bold tracking-tight" style={{ color: themeColors.textPrimary }} id="current-month-title">
              {currentMonthData.monthName}
            </h2>
            <span className="text-sm font-semibold" style={{ color: themeColors.textSecondary }}>Plantilla de Finanzas</span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => exportToPDF(currentMonthData, currentMonthData.monthName)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-xl shadow-xs transition-all hover:bg-slate-100"
              style={{ backgroundColor: 'transparent', borderColor: themeColors.border, color: themeColors.textPrimary }}
              title="Exportar a PDF"
            >
              <FileDown size={14} className="text-rose-500" />
              <span className="hidden sm:inline">PDF</span>
            </button>
            <button
              onClick={() => exportToExcel(currentMonthData, currentMonthData.monthName)}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border rounded-xl shadow-xs transition-all hover:bg-slate-100"
              style={{ backgroundColor: 'transparent', borderColor: themeColors.border, color: themeColors.textPrimary }}
              title="Exportar a Excel"
            >
              <FileDown size={14} className="text-emerald-500" />
              <span className="hidden sm:inline">Excel</span>
            </button>

            <button
              onClick={handleResetMonth}
              id="btn-reset-month"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border rounded-xl shadow-xs transition-all hover:opacity-90"
              style={{ 
                backgroundColor: themeColors.cardBg, 
                borderColor: themeColors.border, 
                color: themeColors.textPrimary 
              }}
            >
              <RefreshCw size={14} />
              <span>Restablecer Mes</span>
            </button>
            
            <button
              onClick={handleResetAll}
              id="btn-reset-all"
              className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold border rounded-xl shadow-xs transition-all hover:opacity-90"
              style={{ 
                backgroundColor: isDarkMode ? '#8813371f' : '#fff1f2', 
                borderColor: isDarkMode ? '#be123c50' : '#ffe4e6', 
                color: isDarkMode ? '#fda4af' : '#b91c1c' 
              }}
            >
              <Trash2 size={14} />
              <span>Restablecer Todo</span>
            </button>
          </div>
        </div>

        {/* Sección de Presupuesto Límite Anual Global */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl p-5 border shadow-sm transition-all flex flex-col md:flex-row gap-6 justify-between items-center"
          style={{
            backgroundColor: themeColors.cardBg,
            borderColor: themeColors.border,
          }}
          id="annual-budget-global-section"
        >
          {/* Seccion Izquierda: Configuración del limite */}
          <div className="w-full md:w-1/3 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl text-white flex items-center justify-center shadow-xs" style={{ backgroundColor: themeColors.primary }}>
                <Target size={18} />
              </span>
              <div>
                <h3 className="font-bold text-sm tracking-tight" style={{ color: themeColors.textPrimary }}>
                  Presupuesto Límite Anual Global
                </h3>
                <p className="text-xs" style={{ color: themeColors.textSecondary }}>
                  Meta acumulada de egresos para todos los meses
                </p>
              </div>
            </div>

            <div className="mt-2">
              <label className="block text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: themeColors.textSecondary }}>
                Definir Límite de Presupuesto Anual (S/):
              </label>
              <div 
                className="flex items-center bg-slate-50 border rounded-xl px-3 py-2 transition-all"
                style={{ 
                  backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', 
                  borderColor: themeColors.border
                }}
              >
                <span className="text-sm font-semibold mr-1" style={{ color: themeColors.textSecondary }}>S/</span>
                <input
                  type="number"
                  value={annualLimit || ''}
                  onChange={(e) => setAnnualLimit(Math.max(0, parseFloat(e.target.value) || 0))}
                  placeholder="Ej. 2500000"
                  className="w-full bg-transparent border-none p-0 focus:ring-0 focus:outline-none text-sm font-semibold font-mono"
                  style={{ color: themeColors.textPrimary }}
                  id="annual-limit-input"
                />
              </div>
            </div>
          </div>

          {/* Seccion Derecha: Avance acumulado y barra de progreso */}
          <div className="w-full md:w-2/3 flex flex-col gap-3">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: themeColors.textSecondary }}>
                  Gasto Real Acumulado:
                </span>
                <span className="text-base font-extrabold font-mono" style={{ color: themeColors.textPrimary }}>
                  {formatCurrency(totalAnnualExpenses.real)}
                </span>
              </div>
              
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: themeColors.textSecondary }}>
                  Gasto Presupuestado (12M):
                </span>
                <span className="text-sm font-semibold font-mono" style={{ color: themeColors.textSecondary }}>
                  {formatCurrency(totalAnnualExpenses.budget)}
                </span>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <span className="text-[10px] uppercase font-bold tracking-wider block" style={{ color: themeColors.textSecondary }}>
                  Disponible / Diferencia:
                </span>
                <span 
                  className={`text-sm font-extrabold font-mono`}
                  style={{ color: annualLimit - totalAnnualExpenses.real >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {annualLimit - totalAnnualExpenses.real >= 0 ? '+' : ''}
                  {formatCurrency(annualLimit - totalAnnualExpenses.real)}
                </span>
              </div>
            </div>

            {/* Progress Bar Component */}
            <div>
              <div className="flex justify-between items-center text-xs mb-1">
                <span className="font-semibold" style={{ color: themeColors.textSecondary }}>
                  Consumo del Límite Anual
                </span>
                <span 
                  className="font-bold px-1.5 py-0.5 rounded text-[10px] font-mono text-white"
                  style={{ 
                    backgroundColor: 
                      (totalAnnualExpenses.real / (annualLimit || 1)) > 0.95 
                        ? '#ef4444' 
                        : (totalAnnualExpenses.real / (annualLimit || 1)) > 0.75 
                          ? '#f59e0b' 
                          : '#10b981'
                  }}
                >
                  {Math.round((totalAnnualExpenses.real / (annualLimit || 1)) * 100)}%
                </span>
              </div>

              {/* Progress bar container */}
              <div className="relative w-full h-3 rounded-full overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500 ease-out"
                  style={{ 
                    width: `${Math.min(100, Math.round((totalAnnualExpenses.real / (annualLimit || 1)) * 100))}%`,
                    backgroundColor: 
                      (totalAnnualExpenses.real / (annualLimit || 1)) > 0.95 
                        ? '#ef4444' 
                        : (totalAnnualExpenses.real / (annualLimit || 1)) > 0.75 
                          ? '#f59e0b' 
                          : '#10b981'
                  }}
                />
                
                {/* Visual indicator / marker for Budgeted progress */}
                {totalAnnualExpenses.budget > 0 && (
                  <div 
                    className="absolute top-0 bottom-0 w-0.5 bg-blue-500/80 cursor-help"
                    style={{ 
                      left: `${Math.min(99, Math.round((totalAnnualExpenses.budget / (annualLimit || 1)) * 100))}%` 
                    }}
                    title={`Punto Planificado: ${Math.round((totalAnnualExpenses.budget / (annualLimit || 1)) * 100)}%`}
                  />
                )}
              </div>

              {/* Progress bar info footer */}
              <div className="flex justify-between items-center mt-1 text-[9px]" style={{ color: themeColors.textSecondary }}>
                <span>0%</span>
                {totalAnnualExpenses.budget > 0 && (
                  <span className="flex items-center gap-1">
                    <span className="inline-block w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    Marcador azul: Planificado ({Math.round((totalAnnualExpenses.budget / (annualLimit || 1)) * 100)}%)
                  </span>
                )}
                <span>Límite ({formatCurrency(annualLimit)})</span>
              </div>
            </div>

            {/* Over-budget alert warning if applicable */}
            {totalAnnualExpenses.real > annualLimit && (
              <div className="flex items-center gap-2 p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-[11px] text-rose-500 animate-pulse mt-1">
                <AlertTriangle size={14} className="flex-shrink-0" />
                <span className="font-semibold">¡Alerta! Has sobrepasado el límite de presupuesto anual global definido.</span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Dashboard Cards & Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="top-widgets-grid">
          
          {/* Card: Total Egresos with percentage */}
          <div 
            className="lg:col-span-3 rounded-2xl p-5 shadow-sm border flex flex-col justify-between"
            style={{ 
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border
            }}
            id="widget-total-egresos"
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs uppercase tracking-wider font-semibold" style={{ color: themeColors.textSecondary }}>Total Egresos</span>
                <span 
                  className="p-1.5 rounded-lg text-white"
                  style={{ backgroundColor: themeColors.primary }}
                >
                  <TrendingUp size={16} />
                </span>
              </div>
              <h3 className="text-2xl font-extrabold font-mono" style={{ color: themeColors.textPrimary }} id="total-egresos-display">
                <CountUp end={totals.expenses.real} prefix="S/ " separator="," duration={1.5} />
              </h3>
              <p className="text-[10px] mt-1" style={{ color: themeColors.textSecondary }}>
                Presupuestado: <span className="font-semibold">{formatCurrency(totals.expenses.budget)}</span>
              </p>
            </div>

            <div className="mt-4">
              <div className="flex justify-between text-xs font-semibold mb-1" style={{ color: themeColors.textSecondary }}>
                <span>Consumo de ingresos</span>
                <span>{expensesPercentage}%</span>
              </div>
              <div className="w-full rounded-full h-2 overflow-hidden" style={{ backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${expensesPercentage}%`,
                    backgroundColor: expensesPercentage > 90 ? '#ef4444' : themeColors.accent 
                  }}
                />
              </div>
            </div>
          </div>

          {/* Card: Saldo Para Gastar (Donut Visual) */}
          <div 
            className="lg:col-span-3 rounded-2xl p-5 shadow-sm border flex items-center justify-between gap-4"
            style={{ 
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border
            }}
            id="widget-saldo-gastar"
          >
            <div className="flex-1">
              <span className="text-xs uppercase tracking-wider font-semibold block mb-1" style={{ color: themeColors.textSecondary }}>Saldo para Gastar</span>
              <h3 className="text-2xl font-extrabold font-mono" style={{ color: themeColors.textPrimary }} id="restante-real-display">
                <CountUp end={totals.restante.real} prefix="S/ " separator="," duration={1.5} />
              </h3>
              <p className="text-[10px] mt-1" style={{ color: themeColors.textSecondary }}>
                Meta Esperada: <span className="font-semibold">{formatCurrency(totals.restante.budget)}</span>
              </p>
              
              <div className="flex items-center gap-1 mt-3">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-semibold" style={{ color: themeColors.textSecondary }}>
                  {totals.restante.real >= 0 ? 'Presupuesto saludable' : 'Sobregiro detectado'}
                </span>
              </div>
            </div>

            {/* Micro Donut Ring */}
            <div className="relative h-20 w-20 flex-shrink-0 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={isDarkMode ? '#1e293b' : '#f1f5f9'}
                  strokeWidth="6"
                  fill="transparent"
                />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  stroke={totals.restante.real >= 0 ? themeColors.progressRing : '#ef4444'}
                  strokeWidth="6"
                  fill="transparent"
                  strokeDasharray={213.6}
                  strokeDashoffset={213.6 - (213.6 * remainingPercentage) / 100}
                  className="transition-all duration-700 ease-out"
                />
              </svg>
              <div className="absolute text-[11px] font-bold" style={{ color: themeColors.textPrimary }}>
                {remainingPercentage}%
              </div>
            </div>
          </div>

          {/* Calendar Widget */}
          <div className="lg:col-span-6" id="widget-calendar-container">
            <Calendar 
              monthNum={currentMonthObj.monthNum}
              year={currentMonthData.year}
              fixedExpenses={currentMonthData.fixedExpenses}
              themeColors={themeColors}
            />
          </div>

        </div>

        {/* Cash Flow and Income sections */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6" id="mid-tables-grid">
          
          {/* Table: Flujo de Efectivo (Cash Flow Overview) */}
          <div 
            className="lg:col-span-6 rounded-2xl p-5 shadow-sm border overflow-hidden"
            style={{ 
              backgroundColor: themeColors.cardBg,
              borderColor: themeColors.border
            }}
            id="flujo-de-efectivo-card"
          >
            <div className="flex items-center justify-between mb-4 border-b pb-3" style={{ borderColor: themeColors.border }}>
              <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: themeColors.primary }}>
                Flujo de Efectivo
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-slate-500">
                <Wallet size={14} style={{ color: themeColors.primary }} />
                <span>Resumen global de caja</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr 
                    className="border-b font-medium"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc', 
                      borderBottomColor: themeColors.border,
                      color: themeColors.textSecondary 
                    }}
                  >
                    <th className="p-2.5">Concepto</th>
                    <th className="p-2.5 text-right w-28">Presupuesto</th>
                    <th className="p-2.5 text-right w-28">Real</th>
                    <th className="p-2.5 text-right w-24">Diferencia</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/10" style={{ borderColor: themeColors.border }}>
                  
                  {/* Row: Acumulado (Editable for starting month) */}
                  <tr className="hover:opacity-95 transition-colors">
                    <td className="p-2.5 font-semibold flex items-center gap-1.5" style={{ color: themeColors.textPrimary }}>
                      <span className="h-2 w-2 rounded-full bg-slate-400" />
                      Acumulado (Saldo anterior)
                    </td>
                    <td className="p-2.5">
                      <div 
                        className="flex items-center justify-end border rounded px-1.5 py-0.5 transition-all"
                        style={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                          borderColor: themeColors.border
                        }}
                      >
                        <span className="text-slate-400 mr-0.5">S/</span>
                        <input
                          type="number"
                          value={currentAcumulado.budget || ''}
                          onChange={(e) => handleUpdateAcumulado('budget', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-none p-0 text-right focus:ring-0 focus:outline-none font-mono font-medium"
                          style={{ color: themeColors.textPrimary }}
                        />
                      </div>
                    </td>
                    <td className="p-2.5">
                      <div 
                        className="flex items-center justify-end border rounded px-1.5 py-0.5 transition-all"
                        style={{ 
                          backgroundColor: isDarkMode ? '#1e293b' : '#f8fafc',
                          borderColor: themeColors.border
                        }}
                      >
                        <span className="text-slate-400 mr-0.5">S/</span>
                        <input
                          type="number"
                          value={currentAcumulado.real || ''}
                          onChange={(e) => handleUpdateAcumulado('real', parseFloat(e.target.value) || 0)}
                          className="w-full bg-transparent border-none p-0 text-right focus:ring-0 focus:outline-none font-mono font-medium"
                          style={{ color: themeColors.textPrimary }}
                        />
                      </div>
                    </td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textSecondary }}>
                      {formatCurrency(currentAcumulado.real - currentAcumulado.budget)}
                    </td>
                  </tr>
 
                  {/* Row: Ingresos */}
                  <tr className="hover:opacity-95 transition-colors">
                    <td className="p-2.5 font-semibold flex items-center gap-1.5" style={{ color: themeColors.textPrimary }}>
                      <span className="h-2 w-2 rounded-full bg-emerald-500" />
                      (+) Ingresos
                    </td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textPrimary }}>{formatCurrency(totals.incomes.budget)}</td>
                    <td className="p-2.5 text-right font-mono font-bold text-emerald-500">{formatCurrency(totals.incomes.real)}</td>
                    <td className="p-2.5 text-right font-mono text-emerald-500">
                      {totals.incomes.real - totals.incomes.budget >= 0 ? '+' : ''}
                      {formatCurrency(totals.incomes.real - totals.incomes.budget)}
                    </td>
                  </tr>
 
                  {/* Row: Gastos */}
                  <tr className="hover:opacity-95 transition-colors">
                    <td className="p-2.5 font-semibold flex items-center gap-1.5" style={{ color: themeColors.textPrimary }}>
                      <span className="h-2 w-2 rounded-full bg-rose-500" />
                      (-) Gastos (Fijos + Var.)
                    </td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textPrimary }}>{formatCurrency(totals.expenses.budget)}</td>
                    <td className="p-2.5 text-right font-mono text-rose-500 font-bold">{formatCurrency(totals.expenses.real)}</td>
                    <td className={`p-2.5 text-right font-mono ${totals.expenses.real - totals.expenses.budget <= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {totals.expenses.real - totals.expenses.budget > 0 ? '+' : ''}
                      {formatCurrency(totals.expenses.real - totals.expenses.budget)}
                    </td>
                  </tr>
 
                  {/* Row: Ahorros */}
                  <tr className="hover:opacity-95 transition-colors">
                    <td className="p-2.5 font-semibold flex items-center gap-1.5" style={{ color: themeColors.textPrimary }}>
                      <span className="h-2 w-2 rounded-full bg-amber-500" />
                      (-) Ahorros
                    </td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textPrimary }}>{formatCurrency(totals.savings.budget)}</td>
                    <td className="p-2.5 text-right font-mono text-amber-500 font-bold">{formatCurrency(totals.savings.real)}</td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textSecondary }}>{formatCurrency(totals.savings.real - totals.savings.budget)}</td>
                  </tr>
 
                  {/* Row: Deudas */}
                  <tr className="hover:opacity-95 transition-colors">
                    <td className="p-2.5 font-semibold flex items-center gap-1.5" style={{ color: themeColors.textPrimary }}>
                      <span className="h-2 w-2 rounded-full bg-indigo-500" />
                      (-) Deudas
                    </td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textPrimary }}>{formatCurrency(totals.debts.budget)}</td>
                    <td className="p-2.5 text-right font-mono text-indigo-500 font-bold">{formatCurrency(totals.debts.real)}</td>
                    <td className="p-2.5 text-right font-mono" style={{ color: themeColors.textSecondary }}>{formatCurrency(totals.debts.real - totals.debts.budget)}</td>
                  </tr>
 
                </tbody>
                <tfoot>
                  {/* Row: Restante */}
                  <tr 
                    className="font-bold border-t"
                    style={{ 
                      backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9', 
                      borderTopColor: themeColors.border 
                    }}
                  >
                    <td className="p-3 uppercase tracking-wider text-xs" style={{ color: themeColors.textPrimary }}>Saldo Restante:</td>
                    <td className="p-3 text-right font-mono" style={{ color: themeColors.textSecondary }}>{formatCurrency(totals.restante.budget)}</td>
                    <td className={`p-3 text-right font-mono text-sm`} style={{ color: totals.restante.real >= 0 ? (isDarkMode ? '#60a5fa' : '#1d4ed8') : '#ef4444' }}>
                      {formatCurrency(totals.restante.real)}
                    </td>
                    <td className={`p-3 text-right font-mono text-xs`} style={{ color: totals.restante.real - totals.restante.budget >= 0 ? '#10b981' : '#ef4444' }}>
                      {totals.restante.real - totals.restante.budget >= 0 ? '+' : ''}
                      {formatCurrency(totals.restante.real - totals.restante.budget)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Table: Ingresos (Incomes) */}
          <div className="lg:col-span-6">
            <FinancialTable 
              title="Ingresos"
              items={currentMonthData.incomes}
              type="income"
              themeColors={themeColors}
              onUpdateItem={(id, field, value) => handleUpdateItem('incomes', id, field, value)}
              onAddItem={() => handleAddItem('incomes')}
              onDeleteItem={(id) => handleDeleteItem('incomes', id)}
            />
          </div>

        </div>

        {/* Detailed Budget Lists (Fixed, Variable, Debts, Savings) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="bottom-tables-grid">
          
          {/* Gastos Fijos (Fixed Expenses) */}
          <FinancialTable 
            title="Gastos Fijos"
            items={currentMonthData.fixedExpenses}
            type="fixed"
            themeColors={themeColors}
            onUpdateItem={(id, field, value) => handleUpdateItem('fixedExpenses', id, field, value)}
            onAddItem={() => handleAddItem('fixedExpenses')}
            onDeleteItem={(id) => handleDeleteItem('fixedExpenses', id)}
          />

          {/* Gastos Variables (Variable Expenses) */}
          <FinancialTable 
            title="Gastos Variables"
            items={currentMonthData.variableExpenses}
            type="variable"
            themeColors={themeColors}
            onUpdateItem={(id, field, value) => handleUpdateItem('variableExpenses', id, field, value)}
            onAddItem={() => handleAddItem('variableExpenses')}
            onDeleteItem={(id) => handleDeleteItem('variableExpenses', id)}
          />

          {/* Deudas (Debts) */}
          <FinancialTable 
            title="Deudas"
            items={currentMonthData.debts}
            type="debts"
            themeColors={themeColors}
            onUpdateItem={(id, field, value) => handleUpdateItem('debts', id, field, value)}
            onAddItem={() => handleAddItem('debts')}
            onDeleteItem={(id) => handleDeleteItem('debts', id)}
          />

          {/* Ahorros (Savings) */}
          <FinancialTable 
            title="Ahorros"
            items={currentMonthData.savings}
            type="savings"
            themeColors={themeColors}
            onUpdateItem={(id, field, value) => handleUpdateItem('savings', id, field, value)}
            onAddItem={() => handleAddItem('savings')}
            onDeleteItem={(id) => handleDeleteItem('savings', id)}
          />

        </div>

        {/* Charts Dashboard */}
        <div className="mt-4 animate-fade-in">
          <DashboardCharts 
            totals={totals}
            variableExpenses={currentMonthData.variableExpenses}
            themeColors={themeColors}
          />
          <AnnualEvolutionChart 
            data={annualData}
            themeColors={themeColors}
          />
        </div>

      </main>

      {/* Bottom Tabs Month Selector (Spreadsheet Style) */}
      <footer 
        className="fixed bottom-0 left-0 right-0 h-16 shadow-lg border-t z-50 backdrop-blur-md"
        style={{ 
          backgroundColor: '#ffffffd0',
          borderColor: themeColors.border
        }}
        id="app-footer"
      >
        <div className="max-w-7xl mx-auto h-full px-2 sm:px-6 flex items-center justify-between overflow-x-auto gap-2">
          
          {/* Navigation Month Tabs */}
          <div className="flex h-full items-center gap-1 flex-1 overflow-x-auto py-1 scrollbar-thin">
            {monthsList.map((m) => {
              const isActive = m.key === currentMonthKey;
              return (
                <button
                  key={m.key}
                  onClick={() => setCurrentMonthKey(m.key)}
                  id={`tab-month-${m.key}`}
                  className={`px-3 sm:px-4 h-10 flex items-center justify-center text-xs font-bold rounded-xl transition-all relative ${
                    isActive 
                      ? 'text-white shadow-sm' 
                      : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                  }`}
                  style={isActive ? { backgroundColor: themeColors.primary } : {}}
                >
                  {m.key}
                  {/* Indicator if active */}
                  {isActive && (
                    <motion.div
                      layoutId="activeMonthTabIndicator"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-1 w-4 rounded-full bg-white/50"
                      transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Help Info icon / Quick overview */}
          <div className="flex items-center gap-2 pl-4 border-l border-slate-200 hidden md:flex flex-shrink-0 text-slate-500 text-xs">
            <CheckCircle2 size={16} className="text-emerald-500" />
            <span className="font-medium">Autoguardado en navegador</span>
          </div>

        </div>
      </footer>
    </div>
  );
}
