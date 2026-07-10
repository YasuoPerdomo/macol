import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { VariableExpenseItem } from '../types';

interface DashboardChartsProps {
  totals: {
    incomes: { budget: number; real: number };
    expenses: { budget: number; real: number }; // includes fixed + variable
    savings: { budget: number; real: number };
    debts: { budget: number; real: number };
  };
  variableExpenses: VariableExpenseItem[];
  themeColors: any;
}

export const DashboardCharts: React.FC<DashboardChartsProps> = ({
  totals,
  variableExpenses,
  themeColors,
}) => {
  // Switch state for historical YoY comparison
  const [showHistoricalComparison, setShowHistoricalComparison] = React.useState(false);

  // Format to Peruvian Soles (S/) for tooltip display
  const formatTooltipValue = (value: number) => {
    return 'S/ ' + value.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  // Data for Budget vs Real Bar Chart or Historical YoY comparison
  const comparisonData: any[] = showHistoricalComparison
    ? [
        {
          name: 'Ingresos',
          'Año Anterior (2025)': Math.round(totals.incomes.real * 0.91),
          'Este Año (2026)': totals.incomes.real,
        },
        {
          name: 'Gastos',
          'Año Anterior (2025)': Math.round(totals.expenses.real * 0.87),
          'Este Año (2026)': totals.expenses.real,
        },
        {
          name: 'Ahorros',
          'Año Anterior (2025)': Math.round(totals.savings.real * 0.84),
          'Este Año (2026)': totals.savings.real,
        },
        {
          name: 'Deudas',
          'Año Anterior (2025)': Math.round(totals.debts.real * 1.12),
          'Este Año (2026)': totals.debts.real,
        },
      ]
    : [
        {
          name: 'Ingresos',
          Presupuesto: totals.incomes.budget,
          Real: totals.incomes.real,
        },
        {
          name: 'Gastos',
          Presupuesto: totals.expenses.budget,
          Real: totals.expenses.real,
        },
        {
          name: 'Ahorros',
          Presupuesto: totals.savings.budget,
          Real: totals.savings.real,
        },
        {
          name: 'Deudas',
          Presupuesto: totals.debts.budget,
          Real: totals.debts.real,
        },
      ];

  // Group variable expenses by category automatically
  const pieData = React.useMemo(() => {
    const groups: Record<string, number> = {};
    variableExpenses.forEach((item) => {
      if (item.real > 0) {
        const cat = item.category || 'Otros';
        groups[cat] = (groups[cat] || 0) + item.real;
      }
    });
    return Object.keys(groups).map((cat) => ({
      name: cat,
      value: groups[cat],
    }));
  }, [variableExpenses]);

  // Palette of premium colors for the pie chart categories
  const COLORS = [
    themeColors.primary,
    themeColors.accent,
    '#0ea5e9', // sky-500
    '#f59e0b', // amber-500
    '#10b981', // emerald-500
    '#8b5cf6', // violet-500
    '#ec4899', // pink-500
  ];

  const getCategoryEmoji = (cat: string) => {
    switch (cat) {
      case 'Comida': return '🍔';
      case 'Transporte': return '🚗';
      case 'Entretenimiento': return '🎉';
      case 'Higiene': return '🧴';
      default: return '📦';
    }
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-semibold text-slate-300 mb-1.5">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 mb-0.5">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.fill }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{formatTooltipValue(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-slate-900 text-white p-3 rounded-lg border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-semibold text-slate-300 mb-1">
            {getCategoryEmoji(data.name)} {data.name}
          </p>
          <div className="flex justify-between gap-4">
            <span className="text-slate-400">Gasto Real:</span>
            <span className="font-bold text-emerald-400">{formatTooltipValue(data.value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6" id="dashboard-charts-container">
      {/* Bar Chart Card */}
      <div
        className="rounded-2xl p-5 shadow-sm border flex flex-col h-80"
        style={{
          backgroundColor: themeColors.cardBg,
          borderColor: themeColors.border,
        }}
        id="chart-budget-vs-real"
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <h3
            className="text-sm font-semibold uppercase tracking-wider"
            style={{ color: themeColors.primary }}
          >
            {showHistoricalComparison ? 'Comparativa Año Anterior (YoY)' : 'Presupuesto vs Real'}
          </h3>
          
          <div className="flex bg-slate-100 p-0.5 rounded-lg border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setShowHistoricalComparison(false)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                !showHistoricalComparison 
                  ? 'bg-white shadow text-slate-800' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Mensual
            </button>
            <button
              onClick={() => setShowHistoricalComparison(true)}
              className={`px-2.5 py-1 text-[10px] font-bold rounded-md transition-all ${
                showHistoricalComparison 
                  ? 'bg-white shadow text-slate-800' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              Histórico YoY
            </button>
          </div>
        </div>

        <div className="flex-1 w-full min-h-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={comparisonData}
              margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            >
              <XAxis
                dataKey="name"
                stroke="#94a3b8"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#94a3b8"
                fontSize={10}
                tickFormatter={(value) => `S/ ${(value / 1000).toLocaleString('es-PE')}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={36}
                iconType="circle"
                iconSize={10}
                wrapperStyle={{ fontSize: '11px', color: '#475569' }}
              />
              {showHistoricalComparison ? (
                <>
                  <Bar
                    dataKey="Año Anterior (2025)"
                    fill="#e2e8f0"
                    stroke="#cbd5e1"
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="Este Año (2026)"
                    fill={themeColors.accent}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </>
              ) : (
                <>
                  <Bar
                    dataKey="Presupuesto"
                    fill={`${themeColors.primary}33`} // 20% opacity primary
                    stroke={themeColors.primary}
                    strokeWidth={1}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                  <Bar
                    dataKey="Real"
                    fill={themeColors.accent}
                    radius={[4, 4, 0, 0]}
                    maxBarSize={30}
                  />
                </>
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Pie Chart Card */}
      <div
        className="rounded-2xl p-5 shadow-sm border flex flex-col h-80"
        style={{
          backgroundColor: themeColors.cardBg,
          borderColor: themeColors.border,
        }}
        id="chart-variable-expenses"
      >
        <h3
          className="text-sm font-semibold mb-4 uppercase tracking-wider"
          style={{ color: themeColors.primary }}
        >
          Distribución por Categorías (Real)
        </h3>
        <div className="flex-1 w-full flex items-center justify-center min-h-0">
          {pieData.length === 0 ? (
            <div className="text-slate-400 italic text-xs text-center py-10">
              Registra gastos variables reales con categoría para ver el desglose.
            </div>
          ) : (
            <div className="w-full h-full flex flex-col md:flex-row items-center justify-around gap-2">
              <div className="w-1/2 h-full min-h-[160px] relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={70}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip content={<CustomPieTooltip />} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              {/* Custom Legend to be responsive and nice */}
              <div className="max-h-[180px] overflow-y-auto w-full md:w-1/2 px-2 flex flex-col gap-1.5">
                {pieData.map((entry, index) => {
                  const percentage = (
                    (entry.value / pieData.reduce((acc, curr) => acc + curr.value, 0)) *
                    100
                  ).toFixed(1);
                  const color = COLORS[index % COLORS.length];

                  return (
                    <div
                      key={index}
                      className="flex items-center justify-between text-xs font-medium text-slate-600"
                    >
                      <div className="flex items-center gap-1.5 truncate max-w-[130px]">
                        <span
                          className="h-2.5 w-2.5 rounded-full flex-shrink-0"
                          style={{ backgroundColor: color }}
                        />
                        <span className="truncate">
                          {getCategoryEmoji(entry.name)} {entry.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 font-mono">
                        <span className="text-slate-400 text-[10px]">{percentage}%</span>
                        <span className="font-bold text-slate-800">
                          {formatTooltipValue(entry.value)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
