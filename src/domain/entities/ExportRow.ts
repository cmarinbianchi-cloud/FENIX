export interface ExportRow {
  fechaVenta: string;
  mesComercial: string;
  tipoVenta: string;
  unidadNegocio: string;
  valorVenta: number;
  cliente: string;
  rutCliente: string;
  telefonoCliente?: string;
  emailCliente?: string;
  fallecido?: string;
  rutFallecido?: string;
  funeraria: string;
  estadoDevengo: 'Devengada' | 'Por devengar';
  diasSinDevengar?: number;
}