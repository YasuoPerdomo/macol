import React from 'react';
import { Plus, Trash2, CheckSquare, Square, Calendar as CalendarIcon, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TableItem {
  id: string;
  description: string;
  budget: number;
  real: number;
  paid?: boolean;
  due?: string;
}

interface FinancialTableProps {
  title: string;
  items: TableItem[];
  type: 'fixed' | 'variable' | 'debts' | 'savings' | 'income';
  themeColors: any;
  onUpdateItem: (id: string, field: string, value: any) => void;
  onAddItem: () => void;
  onDeleteItem: (id: string) => void;
}

export const FinancialTable: React.FC<FinancialTableProps> = ({
  title,
  items,
  type,
  themeColors,
  onUpdateItem,
  onAddItem,
  onDeleteItem,
}) => {
  // Format numbers to Peruvian Soles format (e.g. S/ 1.289.400)
  const formatCurrency = (val: number) => {
    return 'S/ ' + val.toLocaleString('es-PE', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
  };

  const totalBudget = items.reduce((sum, item) => sum + (item.budget || 0), 0);
  const totalReal = items.reduce((sum, item) => sum + (item.real || 0), 0);

  // Custom placeholder descriptions depending on the table type
  const getPlaceholder = () => {
    switch (type) {
      case 'fixed': return 'Ej. Luz, Agua, Gas...';
      case 'variable': return 'Ej. Compras, Salidas...';
      case 'income': return 'Ej. Salario, Freelance...';
      case 'debts': return 'Ej. Tarjeta, Préstamo...';
      case 'savings': return 'Ej. Fondo de Emergencia...';
    }
  };

  const getEmoji = (desc: string, cat?: string) => {
    const d = (desc || '').toLowerCase();
    if (type === 'income') {
      if (d.includes('salario') || d.includes('sueldo')) return '💼';
      if (d.includes('freelance') || d.includes('proyecto')) return '💻';
      return '💵';
    }
    if (type === 'debts') return '💳';
    if (type === 'savings') return '🏦';
    if (type === 'variable' && cat) {
      if (cat === 'Comida') return '🍔';
      if (cat === 'Transporte') return '🚗';
      if (cat === 'Entretenimiento') return '🎉';
      if (cat === 'Higiene') return '🧴';
    }
    if (d.includes('luz') || d.includes('electricidad')) return '💡';
    if (d.includes('agua')) return '💧';
    if (d.includes('gas')) return '🔥';
    if (d.includes('internet') || d.includes('wifi')) return '🌐';
    if (d.includes('netflix') || d.includes('cine')) return '🍿';
    if (d.includes('spotify') || d.includes('musica')) return '🎵';
    if (d.includes('telefono') || d.includes('celular') || d.includes('movil')) return '📱';
    if (d.includes('gym') || d.includes('gimnasio')) return '🏋️‍♂️';
    if (d.includes('seguro')) return '🛡️';
    if (d.includes('alquiler') || d.includes('renta')) return '🏠';
    return '📝';
  };

  return (
    <div 
      className="rounded-2xl shadow-sm border overflow-hidden"
      style={{ 
        backgroundColor: themeColors.cardBg,
        borderColor: themeColors.border
      }}
      id={`table-${type}`}
    >
      {/* Header */}
      <div 
        className="px-5 py-3.5 flex justify-between items-center border-b"
        style={{ borderColor: themeColors.border }}
      >
        <h3 className="font-semibold text-sm uppercase tracking-wider" style={{ color: themeColors.primary }}>
          {title}
        </h3>
        <button
          onClick={onAddItem}
          id={`btn-add-${type}`}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white rounded-lg transition-all hover:brightness-110 active:scale-95 shadow-sm"
          style={{ backgroundColor: themeColors.primary }}
        >
          <Plus size={14} />
          <span>Agregar fila</span>
        </button>
      </div>

      {/* Table content */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs sm:text-sm border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-medium">
              {type === 'fixed' && <th className="p-2 sm:p-3 w-10 text-center">Pago</th>}
              <th className="p-2 sm:p-3">Descripción</th>
              {type === 'variable' && <th className="p-2 sm:p-3 w-36">Categoría</th>}
              {type === 'fixed' && <th className="p-2 sm:p-3 w-32 sm:w-36">Vence</th>}
              <th className="p-2 sm:p-3 text-right w-28 sm:w-32">Presupuesto</th>
              <th className="p-2 sm:p-3 text-right w-28 sm:w-32">Real</th>
              <th className="p-2 sm:p-3 w-10 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr>
                <td colSpan={type === 'fixed' ? 6 : (type === 'variable' ? 5 : 4)} className="p-6 text-center text-slate-400 italic">
                  No hay registros. Agrega uno usando el botón superior.
                </td>
              </tr>
            ) : (
              <AnimatePresence initial={false}>
                {items.map((item) => (
                  <motion.tr 
                    key={item.id} 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                  {/* Paid checkbox for Fixed Expenses */}
                  {type === 'fixed' && (
                    <td className="p-3 text-center">
                      <button
                        onClick={() => onUpdateItem(item.id, 'paid', !item.paid)}
                        id={`check-${item.id}`}
                        className="text-slate-400 hover:text-emerald-500 transition-colors"
                      >
                        {item.paid ? (
                          <CheckSquare size={18} className="text-emerald-500 inline-block" />
                        ) : (
                          <Square size={18} className="inline-block" />
                        )}
                      </button>
                    </td>
                  )}

                  {/* Description cell */}
                  <td className="p-2 sm:p-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg" title="Ícono sugerido automáticamente">
                        {getEmoji(item.description, (item as any).category)}
                      </span>
                      <input
                        type="text"
                        value={item.description || ''}
                        placeholder={getPlaceholder()}
                        onChange={(e) => onUpdateItem(item.id, 'description', e.target.value)}
                        className="w-full bg-transparent border-b border-transparent hover:border-slate-200 focus:border-blue-500 focus:bg-white px-1.5 py-1.5 sm:py-1 rounded transition-all focus:outline-none text-slate-700 font-medium text-sm sm:text-xs"
                      />
                    </div>
                  </td>

                  {/* Category dropdown (Variable Expenses only) */}
                  {type === 'variable' && (
                    <td className="p-3">
                      <select
                        value={(item as any).category || 'Otros'}
                        onChange={(e) => onUpdateItem(item.id, 'category', e.target.value)}
                        className="bg-slate-100/60 border border-slate-200 text-[11px] font-medium text-slate-700 rounded px-2 py-1 focus:bg-white focus:ring-1 focus:ring-blue-100 focus:border-blue-500 focus:outline-none transition-all w-full cursor-pointer"
                      >
                        <option value="Comida">🍔 Comida</option>
                        <option value="Transporte">🚗 Transporte</option>
                        <option value="Entretenimiento">🎉 Entretenimiento</option>
                        <option value="Higiene">🧴 Higiene</option>
                        <option value="Otros">📦 Otros</option>
                      </select>
                    </td>
                  )}

                  {/* Due Date cell (Fixed Expenses only) */}
                  {type === 'fixed' && (
                    <td className="p-2 sm:p-3">
                      <div className="flex items-center gap-1.5 bg-slate-100/50 border border-slate-200 rounded-lg px-2 py-2 sm:py-1.5 min-w-[120px]">
                        <CalendarIcon size={14} className="text-slate-400 flex-shrink-0" />
                        <input
                          type="text"
                          value={item.due || ''}
                          placeholder="DD/MM/AAAA"
                          onChange={(e) => onUpdateItem(item.id, 'due', e.target.value)}
                          className="w-full bg-transparent border-none text-sm sm:text-xs p-0 focus:ring-0 focus:outline-none font-mono text-slate-600"
                        />
                      </div>
                    </td>
                  )}

                  {/* Budget cell */}
                  <td className="p-2 sm:p-3">
                    <div className="flex items-center justify-end bg-slate-50 border border-slate-100 rounded-lg px-2 py-2 sm:py-1 hover:bg-white focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                      <span className="text-slate-400 mr-1 text-sm sm:text-xs">S/</span>
                      <input
                        type="number"
                        value={item.budget || ''}
                        placeholder="0"
                        onChange={(e) => onUpdateItem(item.id, 'budget', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-none p-0 text-right focus:ring-0 focus:outline-none font-mono text-slate-700 text-sm sm:text-xs"
                      />
                    </div>
                  </td>

                  {/* Real cell */}
                  <td className="p-2 sm:p-3">
                    <div className="flex items-center justify-end bg-slate-50 border border-slate-100 rounded-lg px-2 py-2 sm:py-1 hover:bg-white focus-within:bg-white focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-100 transition-all">
                      <span className="text-slate-400 mr-1 text-sm sm:text-xs">S/</span>
                      <input
                        type="number"
                        value={item.real || ''}
                        placeholder="0"
                        onChange={(e) => onUpdateItem(item.id, 'real', parseFloat(e.target.value) || 0)}
                        className="w-full bg-transparent border-none p-0 text-right focus:ring-0 focus:outline-none font-mono text-slate-700 text-sm sm:text-xs"
                      />
                    </div>
                  </td>

                  {/* Delete row action */}
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onDeleteItem(item.id)}
                      id={`delete-${item.id}`}
                      className="text-slate-300 hover:text-rose-500 p-1 rounded-md hover:bg-rose-50 transition-all active:scale-90"
                    >
                      <Trash2 size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
            )}
          </tbody>

          {/* Footer Totals Row */}
          {items.length > 0 && (
            <tfoot className="bg-slate-50/50 border-t border-slate-200">
              <tr className="font-bold text-slate-700">
                {type === 'fixed' && <td />}
                <td className="p-3 text-right text-xs uppercase tracking-wider text-slate-500">Total:</td>
                {type === 'variable' && <td />}
                {type === 'fixed' && <td />}
                <td className="p-3 text-right font-mono text-slate-800" style={{ fontSize: '13px' }}>
                  {formatCurrency(totalBudget)}
                </td>
                <td className="p-3 text-right font-mono text-slate-800" style={{ fontSize: '13px' }}>
                  {formatCurrency(totalReal)}
                </td>
                <td />
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
};
