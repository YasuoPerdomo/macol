export interface IncomeItem {
  id: string;
  description: string;
  budget: number;
  real: number;
}

export interface FixedExpenseItem {
  id: string;
  paid: boolean;
  description: string;
  due: string; // Format "DD/MM/YYYY" or just day number
  budget: number;
  real: number;
}

export interface VariableExpenseItem {
  id: string;
  description: string;
  category?: string; // e.g. 'Alimentación', 'Transporte', 'Entretenimiento', 'Higiene', 'Otros'
  budget: number;
  real: number;
}

export interface DebtItem {
  id: string;
  description: string;
  budget: number;
  real: number;
}

export interface SavingItem {
  id: string;
  description: string;
  budget: number;
  real: number;
}

export interface CashFlowRow {
  concept: string;
  budget: number;
  real: number;
}

export interface MonthlyData {
  monthName: string;
  year: number;
  incomes: IncomeItem[];
  fixedExpenses: FixedExpenseItem[];
  variableExpenses: VariableExpenseItem[];
  debts: DebtItem[];
  savings: SavingItem[];
}

export type ThemeType = 'pearl' | 'steel' | 'navy';

export interface ThemeColors {
  primary: string;      // main blue
  secondary: string;    // medium blue
  accent: string;       // bright blue
  background: string;   // soft background blue/gray
  cardBg: string;       // white/pearl card
  textPrimary: string;  // deep text
  textSecondary: string;// soft text
  border: string;       // border blue/gray
  progressRing: string; // circular progress color
}
