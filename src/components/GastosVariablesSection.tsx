import { useState } from 'react';
import { ShoppingBag, Plus, X, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { formatCurrency } from '@/lib/formatters';
import type { GastoVariable, EgresoDiario } from '@/hooks/useFinanceData';

interface GastosVariablesSectionProps {
  categoriasGastosVariables: GastoVariable[];
  gastosVariablesConTotales: GastoVariable[];
  egresosDiarios: EgresoDiario[];
  totalGastosVariables: number;
  onAddCategoria: () => void;
  onUpdateCategoria: (id: string, field: keyof GastoVariable, value: string | number) => void;
  onRemoveCategoria: (id: string) => void;
  onAddEgreso: (descripcion: string, monto: number, categoriaId: string) => void;
  onRemoveEgreso: (id: string) => void;
}

export function GastosVariablesSection({
  categoriasGastosVariables,
  gastosVariablesConTotales,
  egresosDiarios,
  totalGastosVariables,
  onAddCategoria,
  onUpdateCategoria,
  onRemoveCategoria,
  onAddEgreso,
  onRemoveEgreso,
}: GastosVariablesSectionProps) {
  const [nuevoEgreso, setNuevoEgreso] = useState({ descripcion: '', monto: '', categoriaId: '' });

  const handleAddEgreso = () => {
    if (nuevoEgreso.descripcion && nuevoEgreso.monto && nuevoEgreso.categoriaId) {
      onAddEgreso(nuevoEgreso.descripcion, parseInt(nuevoEgreso.monto, 10), nuevoEgreso.categoriaId);
      setNuevoEgreso({ descripcion: '', monto: '', categoriaId: '' });
    }
  };

  const handleMontoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setNuevoEgreso(prev => ({ ...prev, monto: value }));
  };

  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-warning/10 rounded-lg">
          <ShoppingBag className="w-6 h-6 text-warning" />
        </div>
        <h2 className="section-title">Gastos Variables Mensuales</h2>
      </div>

      {/* Formulario para agregar egreso diario */}
      <div className="bg-muted/30 rounded-lg p-4 mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3">Agregar Egreso</h3>
        <div className="flex flex-col sm:flex-row gap-3">
          <Input
            type="text"
            value={nuevoEgreso.descripcion}
            onChange={(e) => setNuevoEgreso(prev => ({ ...prev, descripcion: e.target.value }))}
            placeholder="Descripción del gasto"
            className="flex-1"
          />
          <div className="relative w-full sm:w-28">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
              $
            </span>
            <Input
              type="text"
              inputMode="numeric"
              value={nuevoEgreso.monto}
              onChange={handleMontoChange}
              placeholder="0"
              className="pl-7 text-right font-medium"
            />
          </div>
          <Select
            value={nuevoEgreso.categoriaId}
            onValueChange={(value) => setNuevoEgreso(prev => ({ ...prev, categoriaId: value }))}
          >
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Categoría" />
            </SelectTrigger>
            <SelectContent>
              {categoriasGastosVariables.map((cat) => (
                <SelectItem key={cat.id} value={cat.id}>
                  {cat.categoria || 'Sin nombre'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            onClick={handleAddEgreso}
            disabled={!nuevoEgreso.descripcion || !nuevoEgreso.monto || !nuevoEgreso.categoriaId}
            className="bg-warning hover:bg-warning/90 text-warning-foreground"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar
          </Button>
        </div>
      </div>

      {/* Lista de egresos recientes */}
      {egresosDiarios.length > 0 && (
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Egresos Registrados</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {egresosDiarios.map((egreso) => {
              const categoria = categoriasGastosVariables.find(c => c.id === egreso.categoriaId);
              return (
                <div
                  key={egreso.id}
                  className="flex items-center justify-between gap-3 bg-background border border-border rounded-lg px-3 py-2 group animate-fade-in"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-sm truncate">{egreso.descripcion}</span>
                    <span className="text-xs px-2 py-0.5 bg-warning/10 text-warning rounded-full whitespace-nowrap">
                      {categoria?.categoria || 'Sin categoría'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-warning">{formatCurrency(egreso.monto)}</span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveEgreso(egreso.id)}
                      className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Resumen por categorías */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
          <Tag className="w-4 h-4" />
          Totales por Categoría
        </h3>
        <div className="space-y-2">
          {gastosVariablesConTotales.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center justify-between gap-3 bg-muted/20 rounded-lg px-4 py-3 group"
            >
              <div className="flex items-center gap-3 flex-1">
                <Input
                  type="text"
                  value={cat.categoria}
                  onChange={(e) => onUpdateCategoria(cat.id, 'categoria', e.target.value)}
                  placeholder="Nombre de categoría"
                  className="bg-transparent border-0 p-0 h-auto font-medium focus-visible:ring-0 focus-visible:ring-offset-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-warning text-lg">{formatCurrency(cat.monto)}</span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemoveCategoria(cat.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-destructive hover:text-destructive hover:bg-destructive/10 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={onAddCategoria}
        className="w-full border-dashed border-2 hover:border-warning hover:bg-warning/5"
      >
        <Plus className="w-4 h-4 mr-2" />
        Agregar Categoría
      </Button>

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-between">
          <span className="text-lg font-medium text-muted-foreground">Total Gastos Variables:</span>
          <span className="number-lg text-warning">{formatCurrency(totalGastosVariables)}</span>
        </div>
      </div>
    </section>
  );
}
