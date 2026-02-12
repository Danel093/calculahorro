import { useState, useEffect, useCallback } from 'react';

export interface GastoFijo {
  id: string;
  nombre: string;
  monto: number;
}

export interface GastoVariable {
  id: string;
  categoria: string;
  monto: number;
}

export interface EgresoDiario {
  id: string;
  descripcion: string;
  monto: number;
  categoriaId: string;
  fecha: Date;
}

export interface MetaAhorro {
  id: string;
  nombre: string;
  montoObjetivo: number;
  fechaObjetivo: Date | null;
}

export interface FinanceData {
  ingresoMensual: number;
  gastosFijos: GastoFijo[];
  categoriasGastosVariables: GastoVariable[];
  egresosDiarios: EgresoDiario[];
  porcentajeAhorro: number;
  metas: MetaAhorro[];
}

const defaultGastosFijos: GastoFijo[] = [
  { id: '1', nombre: 'Renta/Hipoteca', monto: 0 },
  { id: '2', nombre: 'Servicios (luz, agua, gas)', monto: 0 },
  { id: '3', nombre: 'Internet/Teléfono', monto: 0 },
  { id: '4', nombre: 'Transporte', monto: 0 },
];

const defaultCategoriasGastosVariables: GastoVariable[] = [
  { id: '1', categoria: 'Comida y Supermercado', monto: 0 },
  { id: '2', categoria: 'Transporte adicional', monto: 0 },
  { id: '3', categoria: 'Entretenimiento', monto: 0 },
  { id: '4', categoria: 'Salud y cuidado personal', monto: 0 },
  { id: '5', categoria: 'Ropa y shopping', monto: 0 },
  { id: '6', categoria: 'Otros gastos', monto: 0 },
];

const defaultData: FinanceData = {
  ingresoMensual: 0,
  gastosFijos: defaultGastosFijos,
  categoriasGastosVariables: defaultCategoriasGastosVariables,
  egresosDiarios: [],
  porcentajeAhorro: 20,
  metas: [],
};

const STORAGE_KEY = 'calculadora-ahorro-data';

function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}

export function useFinanceData() {
  const [data, setData] = useState<FinanceData>(defaultData);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Convert date strings back to Date objects
        if (parsed.metas) {
          parsed.metas = parsed.metas.map((meta: MetaAhorro) => ({
            ...meta,
            fechaObjetivo: meta.fechaObjetivo ? new Date(meta.fechaObjetivo) : null,
          }));
        }
        if (parsed.egresosDiarios) {
          parsed.egresosDiarios = parsed.egresosDiarios.map((egreso: EgresoDiario) => ({
            ...egreso,
            fecha: egreso.fecha ? new Date(egreso.fecha) : new Date(),
          }));
        }
        // Migrate old gastosVariables to new structure
        if (parsed.gastosVariables && !parsed.categoriasGastosVariables) {
          parsed.categoriasGastosVariables = parsed.gastosVariables;
          delete parsed.gastosVariables;
        }
        setData({ ...defaultData, ...parsed });
      }
    } catch (error) {
      console.error('Error loading data from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (error) {
        console.error('Error saving data to localStorage:', error);
      }
    }
  }, [data, isLoaded]);

  // Calculated values
  const totalGastosFijos = data.gastosFijos.reduce((sum, g) => sum + g.monto, 0);
  
  // Calculate totals per category from egresos diarios
  const gastosVariablesConTotales = data.categoriasGastosVariables.map(cat => {
    const totalFromEgresos = data.egresosDiarios
      .filter(e => e.categoriaId === cat.id)
      .reduce((sum, e) => sum + e.monto, 0);
    return { ...cat, monto: totalFromEgresos };
  });
  
  const totalGastosVariables = gastosVariablesConTotales.reduce((sum, g) => sum + g.monto, 0);
  const montoAhorro = Math.round((data.ingresoMensual * data.porcentajeAhorro) / 100);
  const disponible = data.ingresoMensual - totalGastosFijos - totalGastosVariables - montoAhorro;
  const gastoDiario = Math.round(disponible / 30);

  // Percentages
  const porcentajeGastosFijos = data.ingresoMensual > 0 ? (totalGastosFijos / data.ingresoMensual) * 100 : 0;
  const porcentajeGastosVariables = data.ingresoMensual > 0 ? (totalGastosVariables / data.ingresoMensual) * 100 : 0;
  const porcentajeDisponible = data.ingresoMensual > 0 ? (disponible / data.ingresoMensual) * 100 : 0;

  // Status calculation
  const getDisponibleStatus = useCallback(() => {
    if (data.ingresoMensual === 0) return 'neutral';
    const percentage = (disponible / data.ingresoMensual) * 100;
    if (percentage > 20) return 'positive';
    if (percentage >= 10) return 'warning';
    return 'negative';
  }, [disponible, data.ingresoMensual]);

  // Projections
  const proyecciones = {
    sesMeses: montoAhorro * 6,
    unAno: montoAhorro * 12,
    dosAnos: montoAhorro * 24,
    cincoAnos: montoAhorro * 60,
  };

  // Actions
  const setIngresoMensual = useCallback((value: number) => {
    setData(prev => ({ ...prev, ingresoMensual: Math.max(0, value) }));
  }, []);

  const setPorcentajeAhorro = useCallback((value: number) => {
    setData(prev => ({ ...prev, porcentajeAhorro: Math.min(100, Math.max(0, value)) }));
  }, []);

  // Gastos Fijos
  const addGastoFijo = useCallback(() => {
    setData(prev => ({
      ...prev,
      gastosFijos: [...prev.gastosFijos, { id: generateId(), nombre: '', monto: 0 }],
    }));
  }, []);

  const updateGastoFijo = useCallback((id: string, field: keyof GastoFijo, value: string | number) => {
    setData(prev => ({
      ...prev,
      gastosFijos: prev.gastosFijos.map(g =>
        g.id === id ? { ...g, [field]: field === 'monto' ? Math.max(0, Number(value)) : value } : g
      ),
    }));
  }, []);

  const removeGastoFijo = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      gastosFijos: prev.gastosFijos.filter(g => g.id !== id),
    }));
  }, []);

  // Categorías de Gastos Variables
  const addCategoriaGastoVariable = useCallback(() => {
    setData(prev => ({
      ...prev,
      categoriasGastosVariables: [...prev.categoriasGastosVariables, { id: generateId(), categoria: '', monto: 0 }],
    }));
  }, []);

  const updateCategoriaGastoVariable = useCallback((id: string, field: keyof GastoVariable, value: string | number) => {
    setData(prev => ({
      ...prev,
      categoriasGastosVariables: prev.categoriasGastosVariables.map(g =>
        g.id === id ? { ...g, [field]: field === 'monto' ? Math.max(0, Number(value)) : value } : g
      ),
    }));
  }, []);

  const removeCategoriaGastoVariable = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      categoriasGastosVariables: prev.categoriasGastosVariables.filter(g => g.id !== id),
      // Also remove egresos associated with this category
      egresosDiarios: prev.egresosDiarios.filter(e => e.categoriaId !== id),
    }));
  }, []);

  // Egresos Diarios
  const addEgresoDiario = useCallback((descripcion: string, monto: number, categoriaId: string) => {
    setData(prev => ({
      ...prev,
      egresosDiarios: [...prev.egresosDiarios, { 
        id: generateId(), 
        descripcion, 
        monto: Math.max(0, monto), 
        categoriaId, 
        fecha: new Date() 
      }],
    }));
  }, []);

  const removeEgresoDiario = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      egresosDiarios: prev.egresosDiarios.filter(e => e.id !== id),
    }));
  }, []);

  // Metas
  const addMeta = useCallback((meta: Omit<MetaAhorro, 'id'>) => {
    setData(prev => ({
      ...prev,
      metas: [...prev.metas, { ...meta, id: generateId() }],
    }));
  }, []);

  const updateMeta = useCallback((id: string, updates: Partial<MetaAhorro>) => {
    setData(prev => ({
      ...prev,
      metas: prev.metas.map(m => (m.id === id ? { ...m, ...updates } : m)),
    }));
  }, []);

  const removeMeta = useCallback((id: string) => {
    setData(prev => ({
      ...prev,
      metas: prev.metas.filter(m => m.id !== id),
    }));
  }, []);

  // Calculate meta viability
  const getMetaViability = useCallback((meta: MetaAhorro) => {
    if (!meta.fechaObjetivo || montoAhorro <= 0) {
      return { status: 'unknown', monthlyNeeded: 0, message: 'Configura tu ahorro' };
    }

    const now = new Date();
    const monthsRemaining = Math.max(1,
      (meta.fechaObjetivo.getFullYear() - now.getFullYear()) * 12 +
      (meta.fechaObjetivo.getMonth() - now.getMonth())
    );

    const monthlyNeeded = Math.ceil(meta.montoObjetivo / monthsRemaining);
    const ratio = monthlyNeeded / montoAhorro;

    if (ratio <= 1) {
      return { status: 'achievable', monthlyNeeded, message: '¡Puedes lograrlo!' };
    } else if (ratio <= 1.5) {
      return { status: 'challenging', monthlyNeeded, message: 'Requiere esfuerzo extra' };
    } else {
      return { status: 'ambitious', monthlyNeeded, message: 'Meta muy ambiciosa' };
    }
  }, [montoAhorro]);

  // Reset data
  const resetData = useCallback(() => {
    setData(defaultData);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return {
    // Data
    ...data,
    isLoaded,
    gastosVariablesConTotales,

    // Calculated
    totalGastosFijos,
    totalGastosVariables,
    montoAhorro,
    disponible,
    gastoDiario,
    porcentajeGastosFijos,
    porcentajeGastosVariables,
    porcentajeDisponible,
    proyecciones,

    // Status
    getDisponibleStatus,
    getMetaViability,

    // Actions
    setIngresoMensual,
    setPorcentajeAhorro,
    addGastoFijo,
    updateGastoFijo,
    removeGastoFijo,
    addCategoriaGastoVariable,
    updateCategoriaGastoVariable,
    removeCategoriaGastoVariable,
    addEgresoDiario,
    removeEgresoDiario,
    addMeta,
    updateMeta,
    removeMeta,
    resetData,
  };
}
