import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from 'recharts';
import { TrendingUp, PiggyBank } from 'lucide-react';

interface AnnualDataPoint {
  key: string;
  name: string;
  'Ahorro Mensual': number;
  'Saldo Restante': number;
}

interface AnnualEvolutionChartProps {
  data: AnnualDataPoint[];
  themeColors: any;
}

export const AnnualEvolutionChart: React.FC<AnnualEvolutionChartProps> = ({
  data,
  themeColors,
}) => {
  // Format currency for display
  const formatCurrency = (value: number) => {
    return 'S/ ' + value.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 text-white p-3.5 rounded-xl border border-slate-700 shadow-xl text-xs font-mono">
          <p className="font-semibold text-slate-300 mb-2">{label}</p>
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex justify-between gap-6 mb-1">
              <span className="flex items-center gap-1.5 text-slate-400">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: entry.stroke }} />
                {entry.name}:
              </span>
              <span className="font-bold text-white">{formatCurrency(entry.value)}</span>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <div
      className="rounded-2xl p-5 shadow-sm border flex flex-col h-[380px] w-full mt-6"
      style={{
        backgroundColor: themeColors.cardBg,
        borderColor: themeColors.border,
      }}
      id="annual-evolution-card"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
        <div>
          <h3
            className="text-sm font-semibold uppercase tracking-wider flex items-center gap-2"
            style={{ color: themeColors.primary }}
          >
            <TrendingUp size={16} />
            Evolución Financiera Anual
          </h3>
          <p className="text-xs text-slate-400 mt-1">
            Tendencia comparativa de ahorro acumulado y saldo para gastar restante mes a mes
          </p>
        </div>

        {/* Dynamic mini-indicators */}
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-emerald-500/10 border border-emerald-500" />
            <span className="text-slate-600 font-medium">Ahorros Activos</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full bg-blue-500/10 border border-blue-500" />
            <span className="text-slate-600 font-medium">Flujo Disponible</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 15, left: 10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
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
              iconType="plainline"
              iconSize={14}
              wrapperStyle={{ fontSize: '11px', color: '#475569' }}
            />
            <Line
              type="monotone"
              dataKey="Ahorro Mensual"
              name="Ahorro Mensual"
              stroke={themeColors.accent}
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ stroke: themeColors.accent, strokeWidth: 2, r: 3, fill: '#fff' }}
            />
            <Line
              type="monotone"
              dataKey="Saldo Restante"
              name="Saldo Restante"
              stroke={themeColors.primary}
              strokeWidth={3}
              activeDot={{ r: 6 }}
              dot={{ stroke: themeColors.primary, strokeWidth: 2, r: 3, fill: '#fff' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
