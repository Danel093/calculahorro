import { DollarSign } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { formatCurrency } from '@/lib/formatters';

interface IngresoSectionProps {
  ingresoMensual: number;
  onChange: (value: number) => void;
}

export function IngresoSection({ ingresoMensual, onChange }: IngresoSectionProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    onChange(value ? parseInt(value, 10) : 0);
  };

  return (
    <section className="card-finance animate-slide-up">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-primary/10 rounded-lg">
          <DollarSign className="w-6 h-6 text-primary" />
        </div>
        <h2 className="section-title">Configura tus Finanzas</h2>
      </div>
      
      <div className="space-y-3">
        <Label htmlFor="ingreso" className="text-base font-medium">
          Ingreso Mensual
        </Label>
        
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-lg font-semibold text-muted-foreground">
            $
          </span>
          <Input
            id="ingreso"
            type="text"
            inputMode="numeric"
            value={ingresoMensual || ''}
            onChange={handleChange}
            placeholder="Ej: 15000"
            className="input-currency"
          />
        </div>
        
        {ingresoMensual > 0 && (
          <p className="text-sm text-muted-foreground animate-fade-in">
            Ingreso configurado: <span className="font-semibold text-foreground">{formatCurrency(ingresoMensual)}</span>
          </p>
        )}
      </div>
    </section>
  );
}
