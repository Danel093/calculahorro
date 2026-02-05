import { useState } from 'react';
import { Target, Plus, X, Calendar, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { formatCurrency, formatDate } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import type { MetaAhorro } from '@/hooks/useFinanceData';

interface AhorroSectionProps {
  porcentajeAhorro: number;
  montoAhorro: number;
  ingresoMensual: number;
  metas: MetaAhorro[];
  onPorcentajeChange: (value: number) => void;
  onAddMeta: (meta: Omit<MetaAhorro, 'id'>) => void;
  onRemoveMeta: (id: string) => void;
  getMetaViability: (meta: MetaAhorro) => { status: string; monthlyNeeded: number; message: string };
}

const porcentajeOptions = [10, 20, 30, 50];

export function AhorroSection({
  porcentajeAhorro,
  montoAhorro,
  ingresoMensual,
  metas,
  onPorcentajeChange,
  onAddMeta,
  onRemoveMeta,
  getMetaViability,
}: AhorroSectionProps) {
  const [showCustom, setShowCustom] = useState(!porcentajeOptions.includes(porcentajeAhorro));
  const [showMetaForm, setShowMetaForm] = useState(false);
  const [newMeta, setNewMeta] = useState({ nombre: '', montoObjetivo: 0, fechaObjetivo: null as Date | null });

  const handleOptionClick = (value: number) => {
    setShowCustom(false);
    onPorcentajeChange(value);
  };

  const handleCustomClick = () => {
    setShowCustom(true);
  };

  const handleAddMeta = () => {
    if (newMeta.nombre && newMeta.montoObjetivo > 0) {
      onAddMeta(newMeta);
      setNewMeta({ nombre: '', montoObjetivo: 0, fechaObjetivo: null });
      setShowMetaForm(false);
    }
  };

  const getViabilityColor = (status: string) => {
    switch (status) {
      case 'achievable': return 'text-success bg-success/10';
      case 'challenging': return 'text-warning bg-warning/10';
      case 'ambitious': return 'text-destructive bg-destructive/10';
      default: return 'text-muted-foreground bg-muted';
    }
  };

  const getViabilityIcon = (status: string) => {
    switch (status) {
      case 'achievable': return <CheckCircle className="w-4 h-4" />;
      case 'challenging': return <TrendingUp className="w-4 h-4" />;
      case 'ambitious': return <AlertTriangle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.3s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <Target className="w-6 h-6 text-primary" />
        </div>
        <h2 className="section-title">¿Cuánto Quieres Ahorrar?</h2>
      </div>

      {/* Percentage selector */}
      <div className="mb-6">
        <Label className="text-base font-medium mb-3 block">Selecciona tu porcentaje de ahorro</Label>
        <div className="flex flex-wrap gap-2">
          {porcentajeOptions.map((value) => (
            <button
              key={value}
              onClick={() => handleOptionClick(value)}
              className={cn(
                'btn-pill border-2',
                porcentajeAhorro === value && !showCustom
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-background text-foreground border-border hover:border-primary/50'
              )}
            >
              {value}%
            </button>
          ))}
          <button
            onClick={handleCustomClick}
            className={cn(
              'btn-pill border-2',
              showCustom
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-foreground border-border hover:border-primary/50'
            )}
          >
            Personalizado
          </button>
        </div>
      </div>

      {/* Custom slider */}
      {showCustom && (
        <div className="mb-6 p-4 bg-muted/50 rounded-lg animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <Label>Porcentaje personalizado</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                min="0"
                max="100"
                value={porcentajeAhorro}
                onChange={(e) => onPorcentajeChange(parseInt(e.target.value) || 0)}
                className="w-20 text-center"
              />
              <span className="font-medium">%</span>
            </div>
          </div>
          <Slider
            value={[porcentajeAhorro]}
            onValueChange={(value) => onPorcentajeChange(value[0])}
            max={100}
            step={1}
            className="w-full"
          />
        </div>
      )}

      {/* Ahorro result */}
      <div className="p-6 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl border border-primary/20 mb-8">
        <div className="text-center">
          <p className="text-sm font-medium text-muted-foreground mb-2">Monto a Ahorrar</p>
          <p className="number-xl text-primary animate-count-up">{formatCurrency(montoAhorro)}</p>
          <p className="text-lg font-semibold text-primary/80 mt-1">{porcentajeAhorro}% de tu ingreso</p>
        </div>
      </div>

      {/* Metas section */}
      <div className="border-t border-border pt-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mis Metas de Ahorro</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowMetaForm(true)}
            className="border-primary text-primary hover:bg-primary/10"
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar Meta
          </Button>
        </div>

        {/* Meta form */}
        {showMetaForm && (
          <div className="p-4 bg-muted/50 rounded-lg mb-4 animate-fade-in">
            <div className="grid gap-4">
              <div>
                <Label>Nombre de la meta</Label>
                <Input
                  value={newMeta.nombre}
                  onChange={(e) => setNewMeta({ ...newMeta, nombre: e.target.value })}
                  placeholder="Ej: Vacaciones, Auto, Emergencia"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Monto objetivo</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                      $
                    </span>
                    <Input
                      type="text"
                      inputMode="numeric"
                      value={newMeta.montoObjetivo || ''}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[^0-9]/g, '');
                        setNewMeta({ ...newMeta, montoObjetivo: value ? parseInt(value) : 0 });
                      }}
                      placeholder="50000"
                      className="pl-7"
                    />
                  </div>
                </div>
                <div>
                  <Label>Fecha objetivo</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        {newMeta.fechaObjetivo ? formatDate(newMeta.fechaObjetivo) : 'Seleccionar'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={newMeta.fechaObjetivo || undefined}
                        onSelect={(date) => setNewMeta({ ...newMeta, fechaObjetivo: date || null })}
                        disabled={(date) => date < new Date()}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => setShowMetaForm(false)}>
                  Cancelar
                </Button>
                <Button onClick={handleAddMeta} className="bg-primary hover:bg-primary/90">
                  Guardar Meta
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Meta list */}
        {metas.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            Aún no tienes metas de ahorro. ¡Agrega una para empezar!
          </p>
        ) : (
          <div className="space-y-4">
            {metas.map((meta) => {
              const viability = getMetaViability(meta);
              const progress = montoAhorro > 0 && meta.fechaObjetivo
                ? Math.min(100, (montoAhorro / viability.monthlyNeeded) * 100)
                : 0;

              return (
                <div key={meta.id} className="p-4 bg-muted/30 rounded-lg border border-border animate-fade-in">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-lg">{meta.nombre}</h4>
                      <p className="text-muted-foreground">
                        Objetivo: {formatCurrency(meta.montoObjetivo)}
                        {meta.fechaObjetivo && ` • ${formatDate(meta.fechaObjetivo)}`}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onRemoveMeta(meta.id)}
                      className="text-destructive hover:bg-destructive/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  {viability.monthlyNeeded > 0 && (
                    <>
                      <p className="text-sm mb-2">
                        Necesitas ahorrar <span className="font-semibold">{formatCurrency(viability.monthlyNeeded)}</span> por mes
                      </p>
                      <Progress value={progress} className="h-2 mb-2" />
                      <div className={cn('inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-sm font-medium', getViabilityColor(viability.status))}>
                        {getViabilityIcon(viability.status)}
                        {viability.message}
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
