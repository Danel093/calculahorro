import { formatCurrency, formatDate } from '@/lib/formatters';
import type { ExportData } from '@/lib/exportExcel';

export async function exportToPDF(props: ExportData) {
  const { default: jsPDF } = await import('jspdf');
  const { autoTable } = await import('jspdf-autotable');

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Title
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('Mi Presupuesto Personal', pageWidth / 2, y, { align: 'center' });
  y += 8;
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`Generado el ${formatDate(new Date())}`, pageWidth / 2, y, { align: 'center' });
  y += 14;

  const pctStr = (val: number) =>
    props.ingresoMensual > 0 ? `${((val / props.ingresoMensual) * 100).toFixed(1)}%` : '0%';

  // Resumen
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Resumen Financiero', 14, y);
  y += 2;

  const resumenBody: any[][] = [
    ['Ingreso Mensual', formatCurrency(props.ingresoMensual), '100%'],
  ];
  if (props.totalGastosFijos > 0) resumenBody.push(['Total Gastos Fijos', formatCurrency(props.totalGastosFijos), pctStr(props.totalGastosFijos)]);
  if (props.totalGastosVariables > 0) resumenBody.push(['Total Gastos Variables', formatCurrency(props.totalGastosVariables), pctStr(props.totalGastosVariables)]);
  if (props.montoAhorro > 0) resumenBody.push([`Ahorro (${props.porcentajeAhorro}%)`, formatCurrency(props.montoAhorro), `${props.porcentajeAhorro}%`]);
  resumenBody.push(['Disponible', formatCurrency(props.disponible), pctStr(props.disponible)]);

  autoTable(doc, {
    startY: y,
    head: [['Concepto', 'Monto', '% del Ingreso']],
    body: resumenBody,
    theme: 'grid',
    headStyles: { fillColor: [16, 163, 127], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { left: 14, right: 14 },
  });

  y = (doc as any).lastAutoTable.finalY + 12;

  // Gastos Fijos
  const gastosFijosFiltered = props.gastosFijos.filter(g => g.monto > 0);
  if (gastosFijosFiltered.length > 0) {
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Gastos Fijos', 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [['Nombre', 'Monto']],
      body: [
        ...gastosFijosFiltered.map(g => [g.nombre || 'Sin nombre', formatCurrency(g.monto)]),
        [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }, { content: formatCurrency(props.totalGastosFijos), styles: { fontStyle: 'bold' } }],
      ],
      theme: 'grid',
      headStyles: { fillColor: [59, 130, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Gastos Variables
  const gastosVarFiltered = props.gastosVariablesConTotales.filter(g => g.monto > 0);
  if (gastosVarFiltered.length > 0) {
    if (y > 250) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Gastos Variables por Categoría', 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [['Categoría', 'Total']],
      body: [
        ...gastosVarFiltered.map(c => [c.categoria || 'Sin categoría', formatCurrency(c.monto)]),
        [{ content: 'TOTAL', styles: { fontStyle: 'bold' } }, { content: formatCurrency(props.totalGastosVariables), styles: { fontStyle: 'bold' } }],
      ],
      theme: 'grid',
      headStyles: { fillColor: [245, 158, 11], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Egresos Diarios
  const egresosFiltered = props.egresosDiarios.filter(e => e.monto > 0);
  if (egresosFiltered.length > 0) {
    if (y > 220) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalle de Egresos Diarios', 14, y);
    y += 2;

    const totalEgresos = egresosFiltered.reduce((s, e) => s + e.monto, 0);

    autoTable(doc, {
      startY: y,
      head: [['Fecha', 'Descripción', 'Categoría', 'Monto']],
      body: [
        ...egresosFiltered.map(e => {
          const cat = props.gastosVariablesConTotales.find(c => c.id === e.categoriaId);
          return [
            formatDate(new Date(e.fecha)),
            e.descripcion,
            cat?.categoria || 'Sin categoría',
            formatCurrency(e.monto),
          ];
        }),
        ['', '', { content: 'TOTAL', styles: { fontStyle: 'bold' } }, { content: formatCurrency(totalEgresos), styles: { fontStyle: 'bold' } }],
      ],
      theme: 'grid',
      headStyles: { fillColor: [139, 92, 246], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 12;
  }

  // Metas
  const metasFiltered = props.metas.filter(m => m.montoObjetivo > 0);
  if (metasFiltered.length > 0) {
    if (y > 240) { doc.addPage(); y = 20; }
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Metas de Ahorro', 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [['Meta', 'Objetivo', 'Fecha']],
      body: metasFiltered.map(m => [
        m.nombre,
        formatCurrency(m.montoObjetivo),
        m.fechaObjetivo ? formatDate(new Date(m.fechaObjetivo)) : 'Sin fecha',
      ]),
      theme: 'grid',
      headStyles: { fillColor: [16, 163, 127], textColor: 255, fontStyle: 'bold' },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 14, right: 14 },
    });
  }

  doc.save('mi-presupuesto.pdf');
}
