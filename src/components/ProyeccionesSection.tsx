import { TrendingUp, Calendar, Sparkles } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface ProyeccionesSectionProps {
  proyecciones: {
    sesMeses: number;
    unAno: number;
    dosAnos: number;
    cincoAnos: number;
  };
}

export function ProyeccionesSection({ proyecciones }: ProyeccionesSectionProps) {
  const items = [
    { label: '6 meses', value: proyecciones.sesMeses, icon: Calendar },
    { label: '1 año', value: proyecciones.unAno, icon: Calendar },
    { label: '2 años', value: proyecciones.dosAnos, icon: TrendingUp },
    { label: '5 años', value: proyecciones.cincoAnos, icon: Sparkles, highlight: true },
  ];

  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.5s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-success/10 rounded-lg">
          <TrendingUp className="w-6 h-6 text-success" />
        </div>
        <h2 className="section-title">Proyección de tu Ahorro</h2>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ label, value, icon: Icon, highlight }) => (
          <div
            key={label}
            className={`p-5 rounded-xl text-center transition-all ${
              highlight
                ? 'bg-gradient-to-br from-success/10 via-success/5 to-accent/10 border-2 border-success/30'
                : 'bg-muted/50 border border-border'
            }`}
          >
            <div className="flex justify-center mb-3">
              <div className={`p-2 rounded-lg ${highlight ? 'bg-success/20' : 'bg-muted'}`}>
                <Icon className={`w-5 h-5 ${highlight ? 'text-success' : 'text-muted-foreground'}`} />
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-1">En {label}</p>
            <p className={`text-xl md:text-2xl font-bold ${highlight ? 'text-success' : 'text-foreground'} animate-count-up`}>
              {formatCurrency(value)}
            </p>
            {highlight && (
              <p className="text-xs text-success mt-2 font-medium">¡Imagina lo que podrías lograr!</p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
