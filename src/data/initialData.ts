import { MonthlyData, ThemeType, ThemeColors } from '../types';

export const monthsList = [
  { key: 'Ene', name: 'Enero', monthNum: 0 },
  { key: 'Feb', name: 'Febrero', monthNum: 1 },
  { key: 'Mar', name: 'Marzo', monthNum: 2 },
  { key: 'Abr', name: 'Abril', monthNum: 3 },
  { key: 'May', name: 'Mayo', monthNum: 4 },
  { key: 'Jun', name: 'Junio', monthNum: 5 },
  { key: 'Jul', name: 'Julio', monthNum: 6 },
  { key: 'Ago', name: 'Agosto', monthNum: 7 },
  { key: 'Sep', name: 'Septiembre', monthNum: 8 },
  { key: 'Oct', name: 'Octubre', monthNum: 9 },
  { key: 'Nov', name: 'Noviembre', monthNum: 10 },
  { key: 'Dic', name: 'Diciembre', monthNum: 11 },
];

export const getInitialData = (): Record<string, MonthlyData> => {
  const currentYear = 2026;
  
  return {
    Ene: {
      monthName: 'Enero',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
        { id: 'e2', description: 'Trabajo Freelance', budget: 150000, real: 200000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/01/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/01/2026', budget: 45000, real: 42000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/01/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: false, description: 'Seguro Médico', due: '28/01/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 420000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 65000 },
        { id: 'v3', description: 'Entretenimiento', budget: 100000, real: 120000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 48000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
      ],
    },
    Feb: {
      monthName: 'Febrero',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
        { id: 'e2', description: 'Trabajo Freelance', budget: 150000, real: 0 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/02/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/02/2026', budget: 45000, real: 48000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/02/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/02/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 390000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 72000 },
        { id: 'v3', description: 'Regalos San Valentín', budget: 80000, real: 85000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 42000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
      ],
    },
    Mar: {
      monthName: 'Marzo',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
        { id: 'e2', description: 'Bono Anual', budget: 500000, real: 550000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/03/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/03/2026', budget: 45000, real: 41000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/03/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/03/2026', budget: 120000, real: 120000 },
        { id: 'f5', paid: true, description: 'Permiso de Circulación', due: '31/03/2026', budget: 150000, real: 145000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 430000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 80000 },
        { id: 'v3', description: 'Útiles Escolares/Estudio', budget: 100000, real: 95000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 52000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 200000 },
        { id: 's2', description: 'Ahorro Vacaciones', budget: 200000, real: 250000 },
      ],
    },
    Abr: {
      monthName: 'Abril',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/04/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/04/2026', budget: 45000, real: 43000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/04/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/04/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 380000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 68000 },
        { id: 'v3', description: 'Salidas y Restaurantes', budget: 120000, real: 110000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 49000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
      ],
    },
    May: {
      monthName: 'Mayo',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
        { id: 'e2', description: 'Venta de Artículos', budget: 50000, real: 80000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/05/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/05/2026', budget: 45000, real: 46000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/05/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/05/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 415000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 71000 },
        { id: 'v3', description: 'Regalo Día de la Madre', budget: 60000, real: 65000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 51000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
      ],
    },
    Jun: {
      monthName: 'Junio',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/06/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/06/2026', budget: 45000, real: 44000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/06/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/06/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 395000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 66000 },
        { id: 'v3', description: 'Ropa / Calzado', budget: 100000, real: 90000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 47000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
      ],
    },
    Jul: {
      monthName: 'Julio',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
        { id: 'e2', description: 'Aguinaldo Invierno', budget: 200000, real: 200000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/07/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/07/2026', budget: 45000, real: 49000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/07/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/07/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 420000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 73000 },
        { id: 'v3', description: 'Entretenimiento Vacaciones', budget: 150000, real: 170000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 54000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
        { id: 's2', description: 'Depósito Plazo Fijo', budget: 150000, real: 150000 },
      ],
    },
    Ago: {
      monthName: 'Agosto',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Arriendo', due: '05/08/2026', budget: 600000, real: 600000 },
        { id: 'f2', paid: true, description: 'Agua', due: '20/08/2026', budget: 45000, real: 45000 },
        { id: 'f3', paid: true, description: 'Internet & TV', due: '12/08/2026', budget: 35000, real: 35000 },
        { id: 'f4', paid: true, description: 'Seguro Médico', due: '28/08/2026', budget: 120000, real: 120000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 410000 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 67000 },
        { id: 'v3', description: 'Salidas Fin de Semana', budget: 100000, real: 90000 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 48000 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 150000 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 100000 },
      ],
    },
    Sep: {
      monthName: 'Septiembre',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Ingreso inicial', budget: 2000000, real: 2000000 },
        { id: 'e2', description: 'Otros ingresos', budget: 200000, real: 150000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: true, description: 'Agua', due: '26/09/2026', budget: 50000, real: 60000 },
        { id: 'f2', paid: true, description: 'Gas', due: '17/09/2026', budget: 80000, real: 80000 },
        { id: 'f3', paid: true, description: 'Electricidad', due: '28/09/2026', budget: 100000, real: 95000 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Transporte', budget: 80000, real: 60000 },
        { id: 'v2', description: 'Alimentación', budget: 500000, real: 600000 },
        { id: 'v3', description: 'Higiene', budget: 100000, real: 95600 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota de Crédito de Consumo', budget: 120000, real: 120000 },
      ],
      savings: [
        { id: 's1', description: 'Reserva para Proyectos', budget: 150000, real: 150000 },
      ],
    },
    Oct: {
      monthName: 'Octubre',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: false, description: 'Arriendo', due: '05/10/2026', budget: 600000, real: 0 },
        { id: 'f2', paid: false, description: 'Agua', due: '20/10/2026', budget: 45000, real: 0 },
        { id: 'f3', paid: false, description: 'Internet & TV', due: '12/10/2026', budget: 35000, real: 0 },
        { id: 'f4', paid: false, description: 'Seguro Médico', due: '28/10/2026', budget: 120000, real: 0 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 0 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 0 },
        { id: 'v3', description: 'Higiene y Limpieza', budget: 50000, real: 0 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 0 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 0 },
      ],
    },
    Nov: {
      monthName: 'Noviembre',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: false, description: 'Arriendo', due: '05/11/2026', budget: 600000, real: 0 },
        { id: 'f2', paid: false, description: 'Agua', due: '20/11/2026', budget: 45000, real: 0 },
        { id: 'f3', paid: false, description: 'Internet & TV', due: '12/11/2026', budget: 35000, real: 0 },
        { id: 'f4', paid: false, description: 'Seguro Médico', due: '28/11/2026', budget: 120000, real: 0 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación', budget: 400000, real: 0 },
        { id: 'v2', description: 'Transporte', budget: 70000, real: 0 },
        { id: 'v3', description: 'Higiene y Limpieza', budget: 50000, real: 0 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 0 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 0 },
      ],
    },
    Dic: {
      monthName: 'Diciembre',
      year: currentYear,
      incomes: [
        { id: 'e1', description: 'Salario Principal', budget: 1800000, real: 1800000 },
        { id: 'e2', description: 'Bono Fin de Año', budget: 300000, real: 300000 },
      ],
      fixedExpenses: [
        { id: 'f1', paid: false, description: 'Arriendo', due: '05/12/2026', budget: 600000, real: 0 },
        { id: 'f2', paid: false, description: 'Agua', due: '20/12/2026', budget: 45000, real: 0 },
        { id: 'f3', paid: false, description: 'Internet & TV', due: '12/12/2026', budget: 35000, real: 0 },
        { id: 'f4', paid: false, description: 'Seguro Médico', due: '28/12/2026', budget: 120000, real: 0 },
      ],
      variableExpenses: [
        { id: 'v1', description: 'Alimentación / Cenas', budget: 500000, real: 0 },
        { id: 'v2', description: 'Regalos Navideños', budget: 300000, real: 0 },
        { id: 'v3', description: 'Transporte / Viajes', budget: 150000, real: 0 },
        { id: 'v4', description: 'Higiene y Limpieza', budget: 50000, real: 0 },
      ],
      debts: [
        { id: 'd1', description: 'Cuota Tarjeta de Crédito', budget: 150000, real: 0 },
      ],
      savings: [
        { id: 's1', description: 'Fondo de Emergencias', budget: 100000, real: 0 },
      ],
    }
  };
};

export const getThemeColors = (theme: ThemeType, isDarkMode: boolean = false): ThemeColors => {
  if (isDarkMode) {
    switch (theme) {
      case 'pearl': // Pearl Blue (Dark Version)
        return {
          primary: '#38bdf8',      // sky-400
          secondary: '#0284c7',    // sky-600
          accent: '#0ea5e9',       // sky-500
          background: '#070f1e',   // dark sky backdrop
          cardBg: '#0f1c2e',       // deep slate sky card
          textPrimary: '#f0f9ff',  // sky-50
          textSecondary: '#7dd3fc',// sky-300
          border: '#1e2d42',       // border slate sky
          progressRing: '#38bdf8'  // sky-400
        };
      case 'steel': // Steel Blue (Dark Version)
        return {
          primary: '#cbd5e1',      // slate-300
          secondary: '#475569',    // slate-600
          accent: '#94a3b8',       // slate-400
          background: '#0f172a',   // slate-900 background
          cardBg: '#1e293b',       // slate-800 card
          textPrimary: '#f8fafc',  // slate-50
          textSecondary: '#94a3b8',// slate-400
          border: '#334155',       // slate-700
          progressRing: '#94a3b8'  // slate-400
        };
      case 'navy': // Navy Blue (Dark Version)
      default:
        return {
          primary: '#60a5fa',      // blue-400
          secondary: '#1d4ed8',    // blue-700
          accent: '#3b82f6',       // blue-500
          background: '#030712',   // rich dark neutral backdrop
          cardBg: '#111827',       // deep slate card
          textPrimary: '#f9fafb',  // soft white
          textSecondary: '#9ca3af',// gray-400
          border: '#1f2937',       // gray-800
          progressRing: '#3b82f6'  // blue-500
        };
    }
  }

  switch (theme) {
    case 'pearl': // Pearl Blue (Soft, elegant light-blue pearl aesthetic)
      return {
        primary: '#0284c7',      // sky-600
        secondary: '#0369a1',    // sky-700
        accent: '#0ea5e9',       // sky-500
        background: '#f0f9ff',   // sky-50 (pearl soft light bg)
        cardBg: '#ffffff',
        textPrimary: '#0f172a',  // slate-900
        textSecondary: '#475569',// slate-600
        border: '#e0f2fe',       // sky-100
        progressRing: '#38bdf8'  // sky-400
      };
    case 'steel': // Steel Blue (Metallic, sleek, professional grayish-blue)
      return {
        primary: '#475569',      // slate-600
        secondary: '#334155',    // slate-700
        accent: '#64748b',       // slate-500
        background: '#f1f5f9',   // slate-100
        cardBg: '#ffffff',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        border: '#cbd5e1',       // slate-300
        progressRing: '#94a3b8'  // slate-400
      };
    case 'navy': // Navy Blue (Deep ocean luxury, high contrast navy slate)
    default:
      return {
        primary: '#1e3a8a',      // blue-900
        secondary: '#172554',    // blue-950
        accent: '#2563eb',       // blue-600
        background: '#f8fafc',   // slate-50
        cardBg: '#ffffff',
        textPrimary: '#0f172a',  // slate-900
        textSecondary: '#475569',// slate-600
        border: '#e2e8f0',       // slate-200
        progressRing: '#3b82f6'  // blue-500
      };
  }
};
