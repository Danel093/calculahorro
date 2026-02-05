import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ChartPie, BarChart3 } from 'lucide-react';
import { formatCurrency } from '@/lib/formatters';

interface GraficosSectionProps {
  totalGastosFijos: number;
  totalGastosVariables: number;
  montoAhorro: number;
  disponible: number;
  ingresoMensual: number;
}

const COLORS = {
  fixed: 'hsl(217, 91%, 60%)',
  variable: 'hsl(25, 95%, 53%)',
  savings: 'hsl(160, 84%, 39%)',
  available: 'hsl(263, 70%, 50%)',
};

export function GraficosSection({
  totalGastosFijos,
  totalGastosVariables,
  montoAhorro,
  disponible,
  ingresoMensual,
}: GraficosSectionProps) {
  const pieData = [
    { name: 'Gastos Fijos', value: totalGastosFijos, color: COLORS.fixed },
    { name: 'Gastos Variables', value: totalGastosVariables, color: COLORS.variable },
    { name: 'Ahorro', value: montoAhorro, color: COLORS.savings },
    { name: 'Disponible', value: Math.max(0, disponible), color: COLORS.available },
  ].filter(item => item.value > 0);

  // Bar chart data for 12 months projection
  const barData = Array.from({ length: 12 }, (_, i) => ({
    mes: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'][i],
    ahorro: montoAhorro * (i + 1),
  }));

  const customTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number; payload: { color: string } }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium" style={{ color: payload[0].payload.color }}>
            {payload[0].name}
          </p>
          <p className="text-lg font-bold">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const barTooltip = ({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number }>; label?: string }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-card border border-border rounded-lg shadow-lg p-3">
          <p className="font-medium text-muted-foreground">{label}</p>
          <p className="text-lg font-bold text-success">{formatCurrency(payload[0].value)}</p>
        </div>
      );
    }
    return null;
  };

  const hasData = ingresoMensual > 0;

  return (
    <section className="card-finance animate-slide-up" style={{ animationDelay: '0.6s' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-accent/10 rounded-lg">
          <ChartPie className="w-6 h-6 text-accent" />
        </div>
        <h2 className="section-title">¿Cómo se Distribuye tu Dinero?</h2>
      </div>

      {!hasData ? (
        <div className="text-center py-12 text-muted-foreground">
          <ChartPie className="w-16 h-16 mx-auto mb-4 opacity-30" />
          <p>Ingresa tu información financiera para ver los gráficos</p>
        </div>
      ) : (
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Pie Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <ChartPie className="w-5 h-5 text-muted-foreground" />
              Distribución Mensual
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    animationBegin={0}
                    animationDuration={800}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip content={customTooltip} />
                  <Legend
                    verticalAlign="bottom"
                    height={36}
                    formatter={(value, entry) => (
                      <span style={{ color: entry.color }} className="text-sm font-medium">
                        {value}
                      </span>
                    )}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bar Chart */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-muted-foreground" />
              Proyección Anual de Ahorro
            </h3>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis 
                    dataKey="mes" 
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <YAxis 
                    tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                    tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
                    axisLine={{ stroke: 'hsl(var(--border))' }}
                  />
                  <Tooltip content={barTooltip} />
                  <Bar 
                    dataKey="ahorro" 
                    fill={COLORS.savings} 
                    radius={[4, 4, 0, 0]}
                    animationBegin={0}
                    animationDuration={800}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
