import { useEffect } from 'react';
import { useVentaForm } from './useVentaForm';
import { VentaFormValuesEdit } from './ventaSchema';
import { VentaDetalleRepository } from '../../../data/repositories/VentaDetalleRepository';
import DB from '../../../data/db/DatabaseManager';

export function useVentaFormEdit(ventaId: number) {
  const form = useVentaForm(); // mismo form base
  const { reset } = form;

  useEffect(() => {
    (async () => {
      const db = await DB.open();
      const repo = new VentaDetalleRepository(db);
      const det = await repo.getById(ventaId);
      if (!det) return;

      // Mapeo a formValues
      const values: VentaFormValuesEdit = {
        ventaId,
        rutCliente: det.rutCliente,
        nombreCliente: det.cliente,
        fechaNacCliente: det.rutCliente, // ya viene ISO
        telefonoCliente: det.telefonoCliente || '',
        emailCliente: det.emailCliente || '',
        esVt: !det.fallecido,
        rutFallecido: det.rutFallecido || '',
        nombreFallecido: det.fallecido || '',
        fechaNacFallecido: '', // no tenemos – dejar vacío
        fechaDefuncion: '', // no tenemos
        fechaVenta: det.fechaVenta,
        tipo: det.tipo as any,
        unidadNegocio: det.unidadNegocio,
        funerariaId: 1, // TODO lookup
        // Sepultura
        valorTotal: det.pagoInicial ? det.valorVenta : 0,
        pagoInicial: det.pagoInicial || 0,
        numCuotas: 0,
        valorCuota: 0,
        fechaPrimeraCuota: det.fechaPrimeraCuota || '',
        medioPago: det.medioPago || 'PAC',
        // Cinerario
        valorVentaCinerario: det.valorVentaCinerario || 0,
        // Servicios
        serviciosIds: det.servicios?.map(s => s.id) || [],
      };
      reset(values);
    })();
  }, [ventaId, reset]);

  return { ...form, isEdit: true as const };
}
