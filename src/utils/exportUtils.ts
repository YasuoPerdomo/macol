import jsPDF from 'jspdf';
import 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { MonthlyData } from '../types';

export const exportToPDF = (monthData: MonthlyData, monthName: string) => {
  const doc = new jsPDF();
  
  // Title
  doc.setFontSize(18);
  doc.text(`Reporte Financiero - ${monthName}`, 14, 22);
  
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Generado el: ${new Date().toLocaleDateString()}`, 14, 30);

  let yPos = 40;

  // Helper to add tables
  const addTable = (title: string, data: any[], columns: string[], dataKeys: string[]) => {
    if (data.length === 0) return;
    
    doc.setFontSize(14);
    doc.setTextColor(40);
    doc.text(title, 14, yPos);
    
    (doc as any).autoTable({
      startY: yPos + 5,
      head: [columns],
      body: data.map(item => dataKeys.map(key => item[key])),
      theme: 'grid',
      headStyles: { fillColor: [41, 128, 185] },
      margin: { top: 10 },
    });
    
    yPos = (doc as any).lastAutoTable.finalY + 15;
  };

  addTable(
    'Ingresos', 
    monthData.incomes, 
    ['Concepto', 'Presupuesto (S/)', 'Real (S/)'], 
    ['description', 'budget', 'real']
  );
  
  addTable(
    'Gastos Fijos', 
    monthData.fixedExpenses, 
    ['Concepto', 'Presupuesto (S/)', 'Real (S/)'], 
    ['description', 'budget', 'real']
  );
  
  addTable(
    'Gastos Variables', 
    monthData.variableExpenses, 
    ['Concepto', 'Categoría', 'Presupuesto (S/)', 'Real (S/)'], 
    ['description', 'category', 'budget', 'real']
  );
  
  addTable(
    'Deudas', 
    monthData.debts, 
    ['Concepto', 'Presupuesto (S/)', 'Real (S/)'], 
    ['description', 'budget', 'real']
  );
  
  addTable(
    'Ahorros', 
    monthData.savings, 
    ['Concepto', 'Presupuesto (S/)', 'Real (S/)'], 
    ['description', 'budget', 'real']
  );

  doc.save(`Reporte_Macol_${monthName}.pdf`);
};

export const exportToExcel = (monthData: MonthlyData, monthName: string) => {
  const wb = XLSX.utils.book_new();

  const addSheet = (sheetName: string, data: any[]) => {
    if (data.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(data.map(item => {
      const row: any = { Concepto: item.description, Presupuesto: item.budget, Real: item.real };
      if (item.category) row.Categoria = item.category;
      if (item.paid !== undefined) row.Pagado = item.paid ? 'Sí' : 'No';
      return row;
    }));
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
  };

  addSheet('Ingresos', monthData.incomes);
  addSheet('Gastos Fijos', monthData.fixedExpenses);
  addSheet('Gastos Variables', monthData.variableExpenses);
  addSheet('Deudas', monthData.debts);
  addSheet('Ahorros', monthData.savings);

  if (wb.SheetNames.length === 0) {
    const ws = XLSX.utils.json_to_sheet([{ Mensaje: 'No hay datos para este mes' }]);
    XLSX.utils.book_append_sheet(wb, ws, 'Vacío');
  }

  XLSX.writeFile(wb, `Reporte_Macol_${monthName}.xlsx`);
};
