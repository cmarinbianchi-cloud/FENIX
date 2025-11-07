import { ExportRow } from '../../domain/entities/ExportRow';
import { VentaListRepository } from './VentaListRepository';

export class ExportRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getRows(filters: Parameters<VentaListRepository['list']>[0]): Promise<ExportRow[]> {
    const repo = new VentaListRepository(this.db);
    const items = await repo.list(filters);

    return items.map(v => ({
      fechaVenta: v.fechaVenta,
      mesComercial: '', // TODO join
      tipoVenta: v.tipo,
      unidadNegocio: v.unidadNegocio,
      valorVenta: v.valorVenta,
      cliente: v.cliente,
      rutCliente: v.rutCliente || '',
      telefonoCliente: v.telefonoCliente,
      emailCliente: v.emailCliente,
      fallecido: v.fallecido,
      rutFallecido: v.rutFallecido,
      funeraria: v.funeraria,
      estadoDevengo: v.devengada ? 'Devengada' : 'Por devengar',
      diasSinDevengar: v.diasSinDevengar,
    }));
  }
}