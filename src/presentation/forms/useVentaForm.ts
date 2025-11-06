import { useForm, UseFormReturn } from 'react-hook-form';
import { ventaSchema, VentaFormValues } from './ventaSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useMemo } from 'react';

export function useVentaForm(): UseFormReturn<VentaFormValues> {
  const form = useForm<VentaFormValues>({
    resolver: yupResolver(ventaSchema),
    defaultValues: {
      fechaVenta: new Date().toISOString().slice(0, 10),
      tipo: 'Sepultura',
      esVt: false,
      numCuotas: 0,
      valorCuota: 0,
      pagoInicial: 0,
      valorTotal: 0,
      serviciosIds: [],
    },
    mode: 'onChange',
  });

  const { watch, setValue } = form;
  const tipo = watch('tipo');
  const valorTotal = watch('valorTotal');
  const pagoInicial = watch('pagoInicial');
  const numCuotas = watch('numCuotas');
  const valorCuota = watch('valorCuota');
  const fechaPrimera = watch('fechaPrimeraCuota');

  // Calcula fecha 8 % y día de pago
  const fecha8Porciento = useMemo(() => {
    if (tipo !== 'Sepultura') return null;
    if (pagoInicial >= valorTotal * 0.08) return null;
    const faltante = valorTotal * 0.08 - pagoInicial;
    const cuotasNec = Math.ceil(faltante / valorCuota);
    if (!fechaPrimera) return null;
    const d = new Date(fechaPrimera);
    d.setMonth(d.getMonth() + cuotasNec);
    return d.toISOString().slice(0, 10);
  }, [tipo, pagoInicial, valorTotal, valorCuota, fechaPrimera]);

  // Ajusta valorCuota cuando cambia numCuotas o pagoInicial/valorTotal
  useEffect(() => {
    if (tipo === 'Sepultura' && numCuotas > 0) {
      const restante = valorTotal - pagoInicial;
      const cuota = Math.max(0, restante / numCuotas);
      setValue('valorCuota', Math.round(cuota));
    }
  }, [tipo, numCuotas, pagoInicial, valorTotal, setValue]);

  return { ...form, fecha8Porciento };
}
