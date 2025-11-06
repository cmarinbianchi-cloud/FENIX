export interface VentaDetalle extends VentaListItem {
  rutCliente: string;
  telefonoCliente?: string;
  emailCliente?: string;
  rutFallecido?: string;
  // Sepultura
  pagoInicial?: number;
  fechaPrimeraCuota?: string;
  fecha8PorCiento?: string;
  medioPago?: string;
  comisionBaseMonto?: number;
  comisionBaseFecha?: string;
  ingresoCajaMonto?: number;
  ingresoCajaFecha?: string;
  premioProdMonto?: number;
  premioProdFecha?: string;
  // Cinerario
  valorVentaCinerario?: number;
  comisionCinerarioMonto?: number;
  comisionCinerarioFecha?: string;
  // Servicios
  servicios?: { nombre: string; comision: number }[];
  comisionServiciosTotal?: number;
  comisionServiciosFecha?: string;
}

export interface Observacion {
  id?: number;
  ventaId: number;
  texto: string;
  creadoEn?: string;
}

export interface NotificacionCustom {
  id?: number;
  ventaId: number;
  fecha: string;   // ISO
  texto: string;   // máx 15
  activa: boolean;
}