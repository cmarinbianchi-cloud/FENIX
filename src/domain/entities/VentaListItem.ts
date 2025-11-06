export interface VentaListItem {
  id: number;
  fechaVenta: string;          // ISO
  tipo: 'Sepultura' | 'Cinerario' | 'Servicio Adicional';
  unidadNegocio: string;
  valorVenta: number;
  cliente: string;
  rutCliente?: string;
  fallecido?: string;
  funeraria: string;
  devengada: boolean;
  diasSinDevengar?: number;    // solo sepulturas < 8 %
  funerariaExcluyePremio: boolean;
  funerariaExcluyeCinerario: boolean;
  tieneObs: boolean;
  tieneNotif: boolean;
}