import SQLite from 'react-native-sqlite-storage';
import { VentaListItem } from '../../domain/entities/VentaListItem';

export class VentaListRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async list(filters: {
    meses?: number[];
    tipos?: string[];
    funerarias?: number[];
    devengado?: 'devengadas' | 'porDevengar' | null;
    diasDevengado?: number;   // hacia atrás o adelante
    obsNot?: ('obs' | 'not')[];
    texto?: string;           // búsqueda libre
    textoEsRut: boolean;
  }): Promise<VentaListItem[]> {
    let where = '1=1';
    const args: any[] = [];

    if (filters.meses?.length) {
      where += ` AND V.mes_comercial_id IN (${filters.meses.map(() => '?').join(',')})`;
      args.push(...filters.meses);
    }
    if (filters.tipos?.length) {
      where += ` AND V.tipo IN (${filters.tipos.map(() => '?').join(',')})`;
      args.push(...filters.tipos);
    }
    if (filters.funerarias?.length) {
      where += ` AND V.funeraria_id IN (${filters.funerarias.map(() => '?').join(',')})`;
      args.push(...filters.funerarias);
    }
    if (filters.devengado) {
      const col = filters.devengado === 'devengadas' ? 'V.devengada=1' : 'V.devengada=0';
      where += ` AND ${col}`;
      if (filters.diasDevengado) {
        const op = filters.devengado === 'devengadas' ? '<=' : '>=';
        const fecha = new Date();
        fecha.setDate(fecha.getDate() + (filters.devengado === 'devengadas' ? -filters.diasDevengado : filters.diasDevengado));
        where += ` AND DATE(V.fecha) ${op} DATE(?)`;
        args.push(fecha.toISOString().slice(0, 10));
      }
    }
    if (filters.obsNot?.length) {
      const cond: string[] = [];
      if (filters.obsNot.includes('obs')) cond.push('obs.id IS NOT NULL');
      if (filters.obsNot.includes('not')) cond.push('notif.id IS NOT NULL');
      where += ` AND (${cond.join(' OR ')})`;
    }
    if (filters.texto) {
      const like = `%${filters.texto}%`;
      if (filters.textoEsRut) {
        where += ` AND (C.rut LIKE ? OR F.rut LIKE ?)`;
        args.push(like, like);
      } else {
        where += ` AND (C.nombre LIKE ? OR F.nombre LIKE ?)`;
        args.push(like, like);
      }
    }

    const sql = `
      SELECT
        V.id,
        V.fecha                                   AS fechaVenta,
        V.tipo,
        V.unidad_negocio                          AS unidadNegocio,
        COALESCE(S.valor_total, C.valor_venta, 0) AS valorVenta,
        C.nombre                                  AS cliente,
        C.rut                                     AS rutCliente,
        F.nombre                                  AS fallecido,
        FUN.nombre                                AS funeraria,
        FUN.es_socia                              AS funerariaExcluyePremio,
        FUN.es_socia                              AS funerariaExcluyeCinerario,
        V.devengada,
        CASE
          WHEN V.tipo='Sepultura' AND V.devengada=0 AND S.num_cuotas>0 AND S.pago_inicial < S.valor_total*0.08
          THEN (julianday('now') - julianday(V.fecha))
          ELSE NULL
        END                                       AS diasSinDevengar,
        (SELECT 1 FROM OBSERVACIONES_VENTAS  O WHERE O.venta_id=V.id LIMIT 1) AS tieneObs,
        (SELECT 1 FROM NOTIFICACIONES_VENTAS N WHERE N.venta_id=V.id LIMIT 1) AS tieneNotif
      FROM VENTAS V
      JOIN CLIENTES C ON C.id = V.cliente_id
      LEFT JOIN FALLECIDOS F ON F.id = V.fallecido_id
      JOIN FUNERARIAS FUN ON FUN.id = V.funeraria_id
      LEFT JOIN VENTA_SEPULTURAS S ON S.venta_id = V.id
      LEFT JOIN VENTA_CINERARIOS CI ON CI.venta_id = V.id
      LEFT JOIN OBSERVACIONES_VENTAS  obs  ON obs.venta_id  = V.id
      LEFT JOIN NOTIFICACIONES_VENTAS notif ON notif.venta_id = V.id
      WHERE ${where}
      ORDER BY V.fecha DESC, V.id DESC
    `;

    const res = await this.db.executeSql(sql, args);
    const out: VentaListItem[] = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      const r = res[0].rows.item(i);
      out.push({
        id: r.id,
        fechaVenta: r.fechaVenta,
        tipo: r.tipo,
        unidadNegocio: r.unidadNegocio,
        valorVenta: r.valorVenta,
        cliente: r.cliente,
        rutCliente: r.rutCliente,
        fallecido: r.fallecido,
        funeraria: r.funeraria,
        devengada: Boolean(r.devengada),
        diasSinDevengar: r.diasSinDevengar,
        funerariaExcluyePremio: Boolean(r.funerariaExcluyePremio),
        funerariaExcluyeCinerario: Boolean(r.funerariaExcluyeCinerario),
        tieneObs: Boolean(r.tieneObs),
        tieneNotif: Boolean(r.tieneNotif),
      });
    }
    return out;
  }
}
