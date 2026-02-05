import { Wallet, Calendar, PiggyBank, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { formatCurrency, formatPercentage } from '@/lib/formatters';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface ResumenSectionProps {
  ingresoMensual: number;
  totalGastosFijos: number;
  totalGastosVariables: number;
  montoAhorro: number;
  porcentajeAhorro: number;
  disponible: number;
  gastoDiario: number;
  porcentajeGastosFijos: number;
  porcentajeGastosVariables: number;
  porcentajeDisponible: number;
  getDisponibleStatus: () => string;
}

export function ResumenSection({
  ingresoMensual,
  totalGastosFijos,
  totalGastosVariables,
  montoAhorro,
  porcentajeAhorro,
  disponible,
  gastoDiario,
  porcentajeGastosFijos,
  porcentajeGastosVariables,
  porcentajeDisponible,
  getDisponibleStatus,
}: ResumenSectionProps) {
  const status = getDisponibleStatus();

  const getStatusColor = (statusType: string) => {
    switch (statusType) {
      case 'positive': return 'bg-success text-success-foreground';
      case 'warning': return 'bg-warning text-warning-foreground';
      case 'negative': return 'bg-destructive text-destructive-foreground';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const getStatusMessage = (statusType: string) => {
    switch (statusType) {
      case 'positive': return { emoji: '👍', text: '¡Vas muy bien!' };
      case 'warning': return { emoji: '📊', text: 'Mantén el control' };
      case 'negative': return { emoji: '⚠️', text: 'Ajusta tus gastos o ahorro' };
      default: return { emoji: '', text: '' };
    }
  };

  const getStatusIcon = (statusType: string) => {
    switch (statusType) {
      case 'positive': return <TrendingUp className="w-5 h-5" />;
      case 'warning': return <Minus className="w-5 h-5" />;
      case 'negative': return <TrendingDown className="w-5 h-5" />;
      default: return null;
    }
  };

  const statusMessage = getStatusMessage(status);

  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.4s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-accent/10 rounded-lg">
          <Wallet className="w-6 h-6 text-accent" />
        </div>
        <h2 className="section-title">Tu Resumen Financiero</h2>
      </div>

      {/* Main cards */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        {/* Disponible */}
        <div className={cn('p-6 rounded-xl text-center transition-all min-w-0 overflow-hidden', getStatusColor(status))}>
          <div className="flex items-center justify-center gap-2 mb-2">
            {getStatusIcon(status)}
            <span className="text-sm font-medium opacity-90">Disponible para Gastar</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight truncate animate-count-up">{formatCurrency(disponible)}</p>
          <p className="mt-2 font-medium opacity-90">
            {statusMessage.emoji} {statusMessage.text}
          </p>
        </div>

        {/* Gasto diario */}
        <div className={cn('p-6 rounded-xl text-center transition-all min-w-0 overflow-hidden', getStatusColor(status))}>
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Gasto Diario Permitido</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight truncate animate-count-up">{formatCurrency(gastoDiario)}</p>
          <p className="mt-2 text-sm opacity-80">Promedio diario disponible</p>
        </div>

        {/* Ahorro */}
        <div className="p-6 rounded-xl text-center bg-success text-success-foreground min-w-0 overflow-hidden">
          <div className="flex items-center justify-center gap-2 mb-2">
            <PiggyBank className="w-5 h-5" />
            <span className="text-sm font-medium opacity-90">Ahorro Mensual</span>
          </div>
          <p className="text-2xl md:text-3xl font-bold tracking-tight truncate animate-count-up">{formatCurrency(montoAhorro)}</p>
          <p className="mt-2 text-sm opacity-80">{porcentajeAhorro}% de tu ingreso</p>
        </div>
      </div>

      {/* Summary table */}
      <div className="overflow-hidden rounded-lg border border-border">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-semibold">Concepto</th>
              <th className="text-right p-4 font-semibold">Monto</th>
              <th className="text-right p-4 font-semibold hidden sm:table-cell">% del Ingreso</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            <tr>
              <td className="p-4">Ingreso Mensual</td>
              <td className="text-right p-4 font-semibold">{formatCurrency(ingresoMensual)}</td>
              <td className="text-right p-4 hidden sm:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <span>100%</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-4">Gastos Fijos</td>
              <td className="text-right p-4 font-semibold text-secondary">{formatCurrency(totalGastosFijos)}</td>
              <td className="text-right p-4 hidden sm:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <Progress value={porcentajeGastosFijos} className="w-20 h-2 bg-transparent border border-slate-900 dark:border-slate-300 [&>div]:bg-secondary" />
                  <span className="w-12 text-right">{formatPercentage(porcentajeGastosFijos)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-4">Gastos Variables</td>
              <td className="text-right p-4 font-semibold text-warning">{formatCurrency(totalGastosVariables)}</td>
              <td className="text-right p-4 hidden sm:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <Progress value={porcentajeGastosVariables} className="w-20 h-2 bg-transparent border border-slate-900 dark:border-slate-300 [&>div]:bg-warning" />
                  <span className="w-12 text-right">{formatPercentage(porcentajeGastosVariables)}</span>
                </div>
              </td>
            </tr>
            <tr>
              <td className="p-4">Ahorro</td>
              <td className="text-right p-4 font-semibold text-success">{formatCurrency(montoAhorro)}</td>
              <td className="text-right p-4 hidden sm:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <Progress value={porcentajeAhorro} className="w-20 h-2 bg-transparent border border-slate-900 dark:border-slate-300 [&>div]:bg-success" />
                  <span className="w-12 text-right">{formatPercentage(porcentajeAhorro)}</span>
                </div>
              </td>
            </tr>
            <tr className="bg-muted/30">
              <td className="p-4 font-semibold">Disponible</td>
              <td className={cn('text-right p-4 font-bold', status === 'positive' ? 'text-success' : status === 'warning' ? 'text-warning' : 'text-destructive')}>
                {formatCurrency(disponible)}
              </td>
              <td className="text-right p-4 hidden sm:table-cell">
                <div className="flex items-center justify-end gap-2">
                  <Progress 
                    value={Math.max(0, porcentajeDisponible)} 
                    className={cn('w-20 h-2 bg-transparent border border-slate-900 dark:border-slate-300', status === 'positive' ? '[&>div]:bg-success' : status === 'warning' ? '[&>div]:bg-warning' : '[&>div]:bg-destructive')} 
                  />
                  <span className="w-12 text-right">{formatPercentage(Math.max(0, porcentajeDisponible))}</span>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  );
}
