import { useEffect, useState } from 'react';
import { VentaDetalle, Observacion, NotificacionCustom } from '../../../domain/entities/VentaDetalle';
import { VentaDetalleRepository } from '../../../data/repositories/VentaDetalleRepository';
import DB from '../../../data/db/DatabaseManager';

export function useDetalleVenta(ventaId: number) {
  const [detalle, setDetalle] = useState<VentaDetalle | null>(null);
  const [obs, setObs] = useState<Observacion[]>([]);
  const [notifs, setNotifs] = useState<NotificacionCustom[]>([]);
  const [cargando, setCargando] = useState(true);
  const [hayCambios, setHayCambios] = useState(false);

  const repo = new VentaDetalleRepository(DB.db!);

  const cargar = async () => {
    setCargando(true);
    const d = await repo.getById(ventaId);
    if (d) {
      setDetalle(d);
      setObs(await repo.getObservaciones(ventaId));
      setNotifs(await repo.getNotificaciones(ventaId));
    }
    setCargando(false);
  };

  useEffect(() => {
    DB.open().then(() => cargar());
  }, [ventaId]);

  const addObs = async (texto: string) => {
    await repo.saveObservacion(ventaId, texto);
    setHayCambios(true);
    await cargar();
  };

  const addNotif = async (fecha: string, texto: string) => {
    await repo.saveNotificacion(ventaId, fecha, texto);
    setHayCambios(true);
    await cargar();
  };

  return { detalle, obs, notifs, cargando, hayCambios, addObs, addNotif };
}
