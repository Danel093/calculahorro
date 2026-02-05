import { Lightbulb, AlertTriangle, TrendingDown, TrendingUp, PartyPopper, Home, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConsejosSectionProps {
  porcentajeAhorro: number;
  porcentajeGastosFijos: number;
  porcentajeGastosVariables: number;
  disponible: number;
  ingresoMensual: number;
}

interface Consejo {
  tipo: 'success' | 'warning' | 'danger' | 'info';
  icon: React.ReactNode;
  titulo: string;
  mensaje: string;
}

export function ConsejosSection({
  porcentajeAhorro,
  porcentajeGastosFijos,
  porcentajeGastosVariables,
  disponible,
  ingresoMensual,
}: ConsejosSectionProps) {
  const consejos: Consejo[] = [];

  // Positive: Good savings
  if (porcentajeAhorro >= 20) {
    consejos.push({
      tipo: 'success',
      icon: <PartyPopper className="w-5 h-5" />,
      titulo: '¡Excelente disciplina financiera!',
      mensaje: 'Estás ahorrando el 20% o más de tus ingresos. Estás construyendo un futuro sólido.',
    });
  }

  // Warning: Low savings
  if (porcentajeAhorro < 10 && ingresoMensual > 0) {
    consejos.push({
      tipo: 'warning',
      icon: <TrendingDown className="w-5 h-5" />,
      titulo: 'Intenta ahorrar más',
      mensaje: 'Intenta ahorrar al menos el 10% de tus ingresos. Pequeños cambios hacen gran diferencia.',
    });
  }

  // Danger: High fixed expenses
  if (porcentajeGastosFijos > 50 && ingresoMensual > 0) {
    consejos.push({
      tipo: 'danger',
      icon: <Home className="w-5 h-5" />,
      titulo: 'Gastos fijos elevados',
      mensaje: 'Tus gastos fijos superan el 50% de tu ingreso. Considera opciones más económicas.',
    });
  }

  // Warning: High variable expenses
  if (porcentajeGastosVariables > 30 && ingresoMensual > 0) {
    consejos.push({
      tipo: 'warning',
      icon: <ShoppingBag className="w-5 h-5" />,
      titulo: 'Revisa tus gastos variables',
      mensaje: 'Podrías reducir gastos en entretenimiento o comida fuera de casa.',
    });
  }

  // Danger: Negative balance
  if (disponible < 0) {
    consejos.push({
      tipo: 'danger',
      icon: <AlertTriangle className="w-5 h-5" />,
      titulo: 'ALERTA: Balance negativo',
      mensaje: 'Estás gastando más de lo que ganas. Reduce gastos urgentemente.',
    });
  }

  // Info: No data
  if (ingresoMensual === 0) {
    consejos.push({
      tipo: 'info',
      icon: <Lightbulb className="w-5 h-5" />,
      titulo: 'Empieza a configurar',
      mensaje: 'Ingresa tu información financiera para recibir consejos personalizados.',
    });
  }

  // Good balance
  if (disponible > 0 && disponible / ingresoMensual > 0.1 && porcentajeAhorro >= 10) {
    consejos.push({
      tipo: 'success',
      icon: <TrendingUp className="w-5 h-5" />,
      titulo: 'Buen balance',
      mensaje: 'Tienes un balance saludable entre gastos, ahorro y disponible.',
    });
  }

  const getConsejoStyles = (tipo: string) => {
    switch (tipo) {
      case 'success':
        return 'bg-success/10 border-success/30 text-success';
      case 'warning':
        return 'bg-warning/10 border-warning/30 text-warning';
      case 'danger':
        return 'bg-destructive/10 border-destructive/30 text-destructive';
      default:
        return 'bg-secondary/10 border-secondary/30 text-secondary';
    }
  };

  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.7s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-warning/10 rounded-lg">
          <Lightbulb className="w-6 h-6 text-warning" />
        </div>
        <h2 className="section-title">Recomendaciones Personalizadas</h2>
      </div>

      <div className="space-y-4">
        {consejos.map((consejo, index) => (
          <div
            key={index}
            className={cn(
              'flex items-start gap-4 p-4 rounded-lg border-2 transition-all animate-fade-in',
              getConsejoStyles(consejo.tipo)
            )}
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex-shrink-0 mt-0.5">
              {consejo.icon}
            </div>
            <div>
              <h4 className="font-semibold mb-1">{consejo.titulo}</h4>
              <p className="text-sm opacity-90">{consejo.mensaje}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
