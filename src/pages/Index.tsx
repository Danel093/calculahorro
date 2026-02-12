import { useFinanceData } from '@/hooks/useFinanceData';
import { Header } from '@/components/Header';
import { IngresoSection } from '@/components/IngresoSection';
import { GastosFijosSection } from '@/components/GastosFijosSection';
import { GastosVariablesSection } from '@/components/GastosVariablesSection';
import { AhorroSection } from '@/components/AhorroSection';
import { ResumenSection } from '@/components/ResumenSection';
import { ProyeccionesSection } from '@/components/ProyeccionesSection';
import { GraficosSection } from '@/components/GraficosSection';
import { ConsejosSection } from '@/components/ConsejosSection';
import { ExportSection } from '@/components/ExportSection';
import { Footer } from '@/components/Footer';

const Index = () => {
  const finance = useFinanceData();

  if (!finance.isLoaded) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-muted-foreground">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Section 1: Income */}
        <IngresoSection
          ingresoMensual={finance.ingresoMensual}
          onChange={finance.setIngresoMensual}
        />

        {/* Section 2: Fixed Expenses */}
        <GastosFijosSection
          gastosFijos={finance.gastosFijos}
          totalGastosFijos={finance.totalGastosFijos}
          onAdd={finance.addGastoFijo}
          onUpdate={finance.updateGastoFijo}
          onRemove={finance.removeGastoFijo}
        />

        {/* Section 3: Variable Expenses */}
        <GastosVariablesSection
          categoriasGastosVariables={finance.categoriasGastosVariables}
          gastosVariablesConTotales={finance.gastosVariablesConTotales}
          egresosDiarios={finance.egresosDiarios}
          totalGastosVariables={finance.totalGastosVariables}
          onAddCategoria={finance.addCategoriaGastoVariable}
          onUpdateCategoria={finance.updateCategoriaGastoVariable}
          onRemoveCategoria={finance.removeCategoriaGastoVariable}
          onAddEgreso={finance.addEgresoDiario}
          onRemoveEgreso={finance.removeEgresoDiario}
        />

        {/* Section 4: Savings Goal */}
        <AhorroSection
          porcentajeAhorro={finance.porcentajeAhorro}
          montoAhorro={finance.montoAhorro}
          ingresoMensual={finance.ingresoMensual}
          metas={finance.metas}
          onPorcentajeChange={finance.setPorcentajeAhorro}
          onAddMeta={finance.addMeta}
          onRemoveMeta={finance.removeMeta}
          getMetaViability={finance.getMetaViability}
        />

        {/* Section 5: Financial Summary */}
        <ResumenSection
          ingresoMensual={finance.ingresoMensual}
          totalGastosFijos={finance.totalGastosFijos}
          totalGastosVariables={finance.totalGastosVariables}
          montoAhorro={finance.montoAhorro}
          porcentajeAhorro={finance.porcentajeAhorro}
          disponible={finance.disponible}
          gastoDiario={finance.gastoDiario}
          porcentajeGastosFijos={finance.porcentajeGastosFijos}
          porcentajeGastosVariables={finance.porcentajeGastosVariables}
          porcentajeDisponible={finance.porcentajeDisponible}
          getDisponibleStatus={finance.getDisponibleStatus}
        />

        {/* Section 6: Projections */}
        <ProyeccionesSection proyecciones={finance.proyecciones} />

        {/* Section 7: Charts */}
        <GraficosSection
          totalGastosFijos={finance.totalGastosFijos}
          totalGastosVariables={finance.totalGastosVariables}
          montoAhorro={finance.montoAhorro}
          disponible={finance.disponible}
          ingresoMensual={finance.ingresoMensual}
        />

        {/* Section 8: Tips */}
        <ConsejosSection
          porcentajeAhorro={finance.porcentajeAhorro}
          porcentajeGastosFijos={finance.porcentajeGastosFijos}
          porcentajeGastosVariables={finance.porcentajeGastosVariables}
          disponible={finance.disponible}
          ingresoMensual={finance.ingresoMensual}
        />

        {/* Section 9: Export */}
        <ExportSection
          ingresoMensual={finance.ingresoMensual}
          gastosFijos={finance.gastosFijos}
          totalGastosFijos={finance.totalGastosFijos}
          gastosVariablesConTotales={finance.gastosVariablesConTotales}
          egresosDiarios={finance.egresosDiarios}
          totalGastosVariables={finance.totalGastosVariables}
          porcentajeAhorro={finance.porcentajeAhorro}
          montoAhorro={finance.montoAhorro}
          disponible={finance.disponible}
          metas={finance.metas}
        />
      </main>

      <Footer onReset={finance.resetData} />
    </div>
  );
};

export default Index;
