import { FileSpreadsheet, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { exportToExcel } from '@/lib/exportExcel';
import { exportToPDF } from '@/lib/exportPDF';
import type { ExportData } from '@/lib/exportExcel';

export type ExportSectionProps = ExportData;

export function ExportSection(props: ExportSectionProps) {
  const handleExcel = async () => {
    try {
      await exportToExcel(props);
      toast.success('Excel exportado correctamente');
    } catch (error) {
      console.error('Error exporting Excel:', error);
      toast.error('Error al exportar Excel');
    }
  };

  const handlePDF = async () => {
    try {
      await exportToPDF(props);
      toast.success('PDF exportado correctamente');
    } catch (error) {
      console.error('Error exporting PDF:', error);
      toast.error('Error al exportar PDF');
    }
  };

  return (
    <Card className="card-finance">
      <CardHeader className="pb-4">
        <CardTitle className="section-title flex items-center gap-3">
          <div className="p-2 rounded-lg bg-primary/10">
            <Download className="w-5 h-5 text-primary" />
          </div>
          Exportar Datos
        </CardTitle>
        <p className="text-sm text-muted-foreground">
          Descarga tu presupuesto completo en el formato que prefieras
        </p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-3 border-2 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all"
            onClick={handleExcel}
          >
            <FileSpreadsheet className="w-8 h-8 text-primary" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Exportar Excel</p>
              <p className="text-xs text-muted-foreground mt-1">
                Archivo .xlsx con tablas estilizadas
              </p>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center gap-3 border-2 border-dashed hover:border-destructive/50 hover:bg-destructive/5 transition-all"
            onClick={handlePDF}
          >
            <FileText className="w-8 h-8 text-destructive" />
            <div className="text-center">
              <p className="font-semibold text-foreground">Exportar PDF</p>
              <p className="text-xs text-muted-foreground mt-1">
                Documento listo para imprimir
              </p>
            </div>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
