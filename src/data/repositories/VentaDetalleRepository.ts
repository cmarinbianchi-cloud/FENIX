export class VentaDetalleRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async getById(id: number): Promise<VentaDetalle | null> {
    const sql = `
      SELECT
        V.*,
        C.rut AS rutCliente, C.telefono AS telefonoCliente, C.email AS emailCliente,
        F.rut AS rutFallecido,
        S.valor_total, S.pago_inicial, S.num_cuotas, S.valor_cuota,
        S.fecha_primera_cuota, S.medio_pago,
        CI.valor_venta AS valorVentaCinerario,
        M.meta
      FROM VENTAS V
      JOIN CLIENTES C ON C.id = V.cliente_id
      LEFT JOIN FALLECIDOS F ON F.id = V.fallecido_id
      LEFT JOIN VENTA_SEPULTURAS S ON S.venta_id = V.id
      LEFT JOIN VENTA_CINERARIOS CI ON CI.venta_id = V.id
      LEFT JOIN MESES_COMERCIALES M ON M.id = V.mes_comercial_id
      WHERE V.id = ?
    `;
    const [res] = await this.db.executeSql(sql, [id]);
    if (!res.rows.length) return null;
    const r = res.rows.item(0);

    // Calcula montos y fechas
    const det: VentaDetalle = {
      id: r.id,
      fechaVenta: r.fecha,
      tipo: r.tipo,
      unidadNegocio: r.unidad_negocio,
      valorVenta: r.valor_total || r.valorVentaCinerario || 0,
      cliente: r.cliente,
      rutCliente: r.rutCliente,
      telefonoCliente: r.telefonoCliente,
      emailCliente: r.emailCliente,
      fallecido: r.fallecido,
      rutFallecido: r.rutFallecido,
      funeraria: r.funeraria,
      devengada: Boolean(r.devengada),
      funerariaExcluyePremio: Boolean(r.es_socia),
      funerariaExcluyeCinerario: Boolean(r.es_socia),
      tieneObs: false,
      tieneNotif: false,

      // Sepultura
      pagoInicial: r.pago_inicial,
      fechaPrimeraCuota: r.fecha_primera_cuota,
      fecha8PorCiento: this.calcularFecha8(r),
      medioPago: r.medio_pago,
      comisionBaseMonto: this.calcComisionBase(r),
      comisionBaseFecha: this.fechaDevengoSepultura(r),
      ingresoCajaMonto: this.calcIngresoCaja(r),
      ingresoCajaFecha: this.fechaDevengoSepultura(r),
      premioProdMonto: 0, // se calcula después
      premioProdFecha: this.fechaPremioProd(r),

      // Cinerario
      valorVentaCinerario: r.valorVentaCinerario,
      comisionCinerarioMonto: this.calcComisionCinerario(r),
      comisionCinerarioFecha: this.fechaDevengoCinerario(r),

      // Servicios
      servicios: await this.getServicios(id),
      comisionServiciosTotal: 0,
      comisionServiciosFecha: this.fechaDevengoServicios(r),
    };

    // servicios
    det.comisionServiciosTotal = det.servicios.reduce((s, x) => s + x.comision, 0);
    return det;
  }

  private calcularFecha8(r: any): string | null {
    if (r.tipo !== 'Sepultura') return null;
    if (r.pago_inicial >= r.valor_total * 0.08) return null;
    const faltante = r.valor_total * 0.08 - r.pago_inicial;
    const cuotasNec = Math.ceil(faltante / r.valor_cuota);
    const d = new Date(r.fecha_primera_cuota);
    d.setMonth(d.getMonth() + cuotasNec);
    return d.toISOString().slice(0, 10);
  }

  private fechaDevengoSepultura(r: any): string {
    if (r.pago_inicial >= r.valor_total * 0.08) {
      const d = new Date(r.fecha);
      d.setMonth(d.getMonth() + 1);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-05`;
    }
    const f8 = this.calcularFecha8(r);
    if (!f8) return '';
    const d = new Date(f8);
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-05`;
  }

  private fechaPremioProd(r: any): string {
    const d = new Date(r.fecha);
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-05`;
  }

  private fechaDevengoCinerario(r: any): string {
    const d = new Date(r.fecha);
    d.setMonth(d.getMonth() + 1);
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-15`;
  }

  private fechaDevengoServicios(r: any): string {
    return this.fechaDevengoCinerario(r);
  }

  private calcComisionBase(r: any): number {
    // stub – leer % de configuración
    return (r.valor_total || 0) * 0.05;
  }

  private calcIngresoCaja(r: any): number {
    // stub – leer % de configuración
    return (r.pago_inicial || 0) * 0.03;
  }

  private calcComisionCinerario(r: any): number {
    // stub – leer tramos
    return (r.valorVentaCinerario || 0) * 0.04;
  }

  private async getServicios(ventaId: number): Promise<{ nombre: string; comision: number }[]> {
    const [res] = await this.db.executeSql(
      `SELECT S.nombre, S.comision_fija
       FROM VENTA_SERVICIOS VS
       JOIN SERVICIOS_ADICIONALES S ON S.id = VS.servicio_id
       WHERE VS.venta_id = ?`,
      [ventaId]
    );
    const out: { nombre: string; comision: number }[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      const r = res.rows.item(i);
      out.push({ nombre: r.nombre, comision: r.comision_fija });
    }
    return out;
  }

  // Observaciones
  async getObservaciones(ventaId: number): Promise<Observacion[]> {
    const [res] = await this.db.executeSql(
      `SELECT id, texto, created_at AS creadoEn
       FROM OBSERVACIONES_VENTAS
       WHERE venta_id = ?
       ORDER BY created_at DESC`,
      [ventaId]
    );
    const out: Observacion[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      const r = res.rows.item(i);
      out.push({ id: r.id, ventaId, texto: r.texto, creadoEn: r.creadoEn });
    }
    return out;
  }

  async saveObservacion(ventaId: number, texto: string): Promise<void> {
    await this.db.executeSql(
      `INSERT INTO OBSERVACIONES_VENTAS(venta_id, texto, created_at)
       VALUES (?, ?, datetime('now'))`,
      [ventaId, texto]
    );
  }

  // Notificaciones custom
  async getNotificaciones(ventaId: number): Promise<NotificacionCustom[]> {
    const [res] = await this.db.executeSql(
      `SELECT id, fecha, texto, activa
       FROM NOTIFICACIONES_VENTAS
       WHERE venta_id = ?
       ORDER BY fecha ASC`,
      [ventaId]
    );
    const out: NotificacionCustom[] = [];
    for (let i = 0; i < res.rows.length; i++) {
      const r = res.rows.item(i);
      out.push({ id: r.id, ventaId, fecha: r.fecha, texto: r.texto, activa: Boolean(r.activa) });
    }
    return out;
  }

  async saveNotificacion(ventaId: number, fecha: string, texto: string): Promise<void> {
    await this.db.executeSql(
      `INSERT INTO NOTIFICACIONES_VENTAS(venta_id, fecha, texto, activa)
       VALUES (?, ?, ?, 1)`,
      [ventaId, fecha, texto]
    );
  }
}
