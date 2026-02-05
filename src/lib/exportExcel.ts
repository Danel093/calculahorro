import { formatCurrency, formatDate } from '@/lib/formatters';
import type { GastoFijo, GastoVariable, EgresoDiario, MetaAhorro } from '@/hooks/useFinanceData';

export interface ExportData {
  ingresoMensual: number;
  gastosFijos: GastoFijo[];
  totalGastosFijos: number;
  gastosVariablesConTotales: GastoVariable[];
  egresosDiarios: EgresoDiario[];
  totalGastosVariables: number;
  porcentajeAhorro: number;
  montoAhorro: number;
  disponible: number;
  metas: MetaAhorro[];
}

// Style helpers
const headerStyle = (rgb: string) => ({
  font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 11 },
  fill: { fgColor: { rgb } },
  border: borderAll(),
  alignment: { horizontal: 'center' as const },
});

const titleStyle = () => ({
  font: { bold: true, sz: 16, color: { rgb: '1A1A1A' } },
  alignment: { horizontal: 'center' as const },
});

const subtitleStyle = () => ({
  font: { sz: 10, color: { rgb: '666666' } },
  alignment: { horizontal: 'center' as const },
});

const sectionTitleStyle = () => ({
  font: { bold: true, sz: 13, color: { rgb: '1A1A1A' } },
});

const cellStyle = (alt = false) => ({
  border: borderAll(),
  fill: alt ? { fgColor: { rgb: 'F5F5F5' } } : undefined,
  alignment: { horizontal: 'left' as const },
});

const currencyStyle = (alt = false) => ({
  border: borderAll(),
  fill: alt ? { fgColor: { rgb: 'F5F5F5' } } : undefined,
  alignment: { horizontal: 'right' as const },
  numFmt: '$#,##0',
});

const totalLabelStyle = () => ({
  font: { bold: true },
  border: borderAll(),
  fill: { fgColor: { rgb: 'E8E8E8' } },
});

const totalValueStyle = () => ({
  font: { bold: true },
  border: borderAll(),
  fill: { fgColor: { rgb: 'E8E8E8' } },
  alignment: { horizontal: 'right' as const },
  numFmt: '$#,##0',
});

function borderAll() {
  const side = { style: 'thin' as const, color: { rgb: 'CCCCCC' } };
  return { top: side, bottom: side, left: side, right: side };
}

export async function exportToExcel(props: ExportData) {
  const XLSX = await import('xlsx-js-style');
  const wb = XLSX.utils.book_new();

  type CellObj = { v: string | number; s?: any; t?: string };
  const rows: (CellObj | null)[][] = [];

  const push = (...r: (CellObj | null)[][]) => rows.push(...r);
  const empty = () => push([null]);

  const cell = (v: string | number, s?: any): CellObj => ({ v, s });

  // === TÍTULO ===
  push(
    [cell('MI PRESUPUESTO PERSONAL', titleStyle())],
    [cell(`Generado el ${formatDate(new Date())}`, subtitleStyle())],
  );
  empty();

  // === RESUMEN ===
  push([cell('RESUMEN FINANCIERO', sectionTitleStyle())]);
  const pct = (val: number) =>
    props.ingresoMensual > 0 ? `${((val / props.ingresoMensual) * 100).toFixed(1)}%` : '0%';

  const resumenHeaders = ['Concepto', 'Monto', '% del Ingreso'];
  push(resumenHeaders.map(h => cell(h, headerStyle('10A37F'))));

  const resumenRows: [string, number, string][] = [
    ['Ingreso Mensual', props.ingresoMensual, '100%'],
  ];
  if (props.totalGastosFijos > 0) resumenRows.push(['Total Gastos Fijos', props.totalGastosFijos, pct(props.totalGastosFijos)]);
  if (props.totalGastosVariables > 0) resumenRows.push(['Total Gastos Variables', props.totalGastosVariables, pct(props.totalGastosVariables)]);
  if (props.montoAhorro > 0) resumenRows.push([`Ahorro (${props.porcentajeAhorro}%)`, props.montoAhorro, `${props.porcentajeAhorro}%`]);
  resumenRows.push(['Disponible', props.disponible, pct(props.disponible)]);

  resumenRows.forEach(([label, monto, p], i) => {
    const alt = i % 2 === 1;
    push([cell(label, cellStyle(alt)), cell(monto, currencyStyle(alt)), cell(p, cellStyle(alt))]);
  });
  empty();

  // === GASTOS FIJOS ===
  const gastosFijosFiltered = props.gastosFijos.filter(g => g.monto > 0);
  if (gastosFijosFiltered.length > 0) {
    push([cell('GASTOS FIJOS', sectionTitleStyle())]);
    push(['Nombre', 'Monto'].map(h => cell(h, headerStyle('3B82F6'))));
    gastosFijosFiltered.forEach((g, i) => {
      const alt = i % 2 === 1;
      push([cell(g.nombre || 'Sin nombre', cellStyle(alt)), cell(g.monto, currencyStyle(alt))]);
    });
    push([cell('TOTAL', totalLabelStyle()), cell(props.totalGastosFijos, totalValueStyle())]);
    empty();
  }

  // === GASTOS VARIABLES ===
  const gastosVarFiltered = props.gastosVariablesConTotales.filter(g => g.monto > 0);
  if (gastosVarFiltered.length > 0) {
    push([cell('GASTOS VARIABLES POR CATEGORÍA', sectionTitleStyle())]);
    push(['Categoría', 'Total'].map(h => cell(h, headerStyle('F59E0B'))));
    gastosVarFiltered.forEach((c, i) => {
      const alt = i % 2 === 1;
      push([cell(c.categoria || 'Sin categoría', cellStyle(alt)), cell(c.monto, currencyStyle(alt))]);
    });
    push([cell('TOTAL', totalLabelStyle()), cell(props.totalGastosVariables, totalValueStyle())]);
    empty();
  }

  // === EGRESOS DIARIOS ===
  const egresosFiltered = props.egresosDiarios.filter(e => e.monto > 0);
  if (egresosFiltered.length > 0) {
    push([cell('DETALLE DE EGRESOS DIARIOS', sectionTitleStyle())]);
    push(['Fecha', 'Descripción', 'Categoría', 'Monto'].map(h => cell(h, headerStyle('8B5CF6'))));
    egresosFiltered.forEach((e, i) => {
      const cat = props.gastosVariablesConTotales.find(c => c.id === e.categoriaId);
      const alt = i % 2 === 1;
      push([
        cell(formatDate(new Date(e.fecha)), cellStyle(alt)),
        cell(e.descripcion, cellStyle(alt)),
        cell(cat?.categoria || 'Sin categoría', cellStyle(alt)),
        cell(e.monto, currencyStyle(alt)),
      ]);
    });
    const totalEgresos = egresosFiltered.reduce((s, e) => s + e.monto, 0);
    push([null, null, cell('TOTAL', totalLabelStyle()), cell(totalEgresos, totalValueStyle())]);
    empty();
  }

  // === METAS ===
  const metasFiltered = props.metas.filter(m => m.montoObjetivo > 0);
  if (metasFiltered.length > 0) {
    push([cell('METAS DE AHORRO', sectionTitleStyle())]);
    push(['Meta', 'Objetivo', 'Fecha Objetivo'].map(h => cell(h, headerStyle('10A37F'))));
    metasFiltered.forEach((m, i) => {
      const alt = i % 2 === 1;
      push([
        cell(m.nombre, cellStyle(alt)),
        cell(m.montoObjetivo, currencyStyle(alt)),
        cell(m.fechaObjetivo ? formatDate(new Date(m.fechaObjetivo)) : 'Sin fecha', cellStyle(alt)),
      ]);
    });
    empty();
  }

  // Build worksheet from cell objects
  const ws: any = {};
  let maxR = 0;
  let maxC = 0;
  rows.forEach((row, r) => {
    row.forEach((c, col) => {
      if (!c) return;
      const ref = XLSX.utils.encode_cell({ r, c: col });
      ws[ref] = { v: c.v, t: typeof c.v === 'number' ? 'n' : 's', s: c.s };
      if (r > maxR) maxR = r;
      if (col > maxC) maxC = col;
    });
  });
  ws['!ref'] = `A1:${XLSX.utils.encode_cell({ r: maxR, c: maxC })}`;
  ws['!cols'] = [{ wch: 30 }, { wch: 18 }, { wch: 18 }, { wch: 18 }];
  ws['!merges'] = [
    { s: { r: 0, c: 0 }, e: { r: 0, c: 3 } },
    { s: { r: 1, c: 0 }, e: { r: 1, c: 3 } },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Presupuesto');
  XLSX.writeFile(wb, 'mi-presupuesto.xlsx');
}
