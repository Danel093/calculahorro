import { Home, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GastoItem } from './GastoItem';
import { formatCurrency } from '@/lib/formatters';
import type { GastoFijo } from '@/hooks/useFinanceData';

interface GastosFijosSectionProps {
  gastosFijos: GastoFijo[];
  totalGastosFijos: number;
  onAdd: () => void;
  onUpdate: (id: string, field: keyof GastoFijo, value: string | number) => void;
  onRemove: (id: string) => void;
}

export function GastosFijosSection({
  gastosFijos,
  totalGastosFijos,
  onAdd,
  onUpdate,
  onRemove,
}: GastosFijosSectionProps) {
  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.1s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-secondary/10 rounded-lg">
          <Home className="w-6 h-6 text-secondary" />
        </div>
        <h2 className="section-title">Gastos Fijos Mensuales</h2>
      </div>

      <div className="space-y-3 mb-6">
        {gastosFijos.map((gasto) => (
          <GastoItem
            key={gasto.id}
            nombre={gasto.nombre}
            monto={gasto.monto}
            onNombreChange={(value) => onUpdate(gasto.id, 'nombre', value)}
            onMontoChange={(value) => onUpdate(gasto.id, 'monto', value)}
            onRemove={() => onRemove(gasto.id)}
            placeholderNombre="Ej: Renta"
          />
        ))}
      </div>

      <Button
        variant="outline"
        onClick={onAdd}
        className="w-full border-dashed border-2 hover:border-secondary hover:bg-secondary/5"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Gasto Fijo
      </Button>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-muted-foreground">Total Gastos Fijos:</span>
          <span className="number-lg text-secondary">{formatCurrency(totalGastosFijos)}</span>
        </div>
      </div>
    </section>
  );
}
