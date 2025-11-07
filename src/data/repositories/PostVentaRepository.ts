export class PostVentaRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async listCuotas(diasAtras: number, diasAdelante: number): Promise<any[]> {
    const hoy = new Date();
    const ini = new Date(hoy);
    ini.setDate(ini.getDate() - diasAtras);
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + diasAdelante);

    const sql = `
      SELECT
        V.id,
        C.nombre AS cliente,
        DATE(S.fecha_primera_cuota, '+' || CAST(CEIL((S.valor_total*0.08 - S.pago_inicial)/S.valor_cuota) AS INTEGER) || ' months') AS fecha8,
        (julianday(DATE(S.fecha_primera_cuota, '+' || CAST(CEIL((S.valor_total*0.08 - S.pago_inicial)/S.valor_cuota) AS INTEGER) || ' months')) - julianday('now')) AS diasPara8,
        CEIL((S.valor_total*0.08 - S.pago_inicial)/S.valor_cuota) AS faltanteCuota
      FROM VENTAS V
      JOIN CLIENTES C ON C.id = V.cliente_id
      JOIN VENTA_SEPULTURAS S ON S.venta_id = V.id
      WHERE V.tipo = 'Sepultura'
        AND V.devengada = 0
        AND S.pago_inicial < S.valor_total * 0.08
        AND DATE(S.fecha_primera_cuota, '+' || CAST(CEIL((S.valor_total*0.08 - S.pago_inicial)/S.valor_cuota) AS INTEGER) || ' months')
            BETWEEN DATE(?) AND DATE(?)
      ORDER BY fecha8 ASC
    `;
    const [res] = await this.db.executeSql(sql, [ini.toISOString().slice(0, 10), fin.toISOString().slice(0, 10)]);
    const out: any[] = [];
    for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
    return out;
  }

  async listProyecciones(diasAtras: number, diasAdelante: number): Promise<any[]> {
    // Devengos día 05 (sepulturas) y día 15 (cinerario/servicios)
    const hoy = new Date();
    const ini = new Date(hoy);
    ini.setDate(ini.getDate() - diasAtras);
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + diasAdelante);

    const sql = `
      SELECT
        V.id,
        V.tipo,
        C.nombre AS cliente,
        CASE
          WHEN V.tipo = 'Sepultura' THEN
            CASE
              WHEN S.pago_inicial >= S.valor_total * 0.08 THEN
                DATE(V.fecha, '+1 month', '05 days')
              ELSE
                DATE(S.fecha_primera_cuota, '+' || CAST(CEIL((S.valor_total*0.08 - S.pago_inicial)/S.valor_cuota) AS INTEGER) || ' months', '05 days')
            END
          ELSE
            DATE(V.fecha, '+1 month', '15 days')
        END AS fechaDevengo,
        CASE
          WHEN V.tipo = 'Sepultura' THEN (S.valor_total * 0.05) + (S.pago_inicial * 0.03)
          WHEN V.tipo = 'Cinerario' THEN CI.valor_venta * 0.04
          ELSE (SELECT SUM(comision_fija) FROM VENTA_SERVICIOS VS JOIN SERVICIOS_ADICIONALES S ON S.id = VS.servicio_id WHERE VS.venta_id = V.id)
        END AS monto
      FROM VENTAS V
      JOIN CLIENTES C ON C.id = V.cliente_id
      LEFT JOIN VENTA_SEPULTURAS S ON S.venta_id = V.id
      LEFT JOIN VENTA_CINERARIOS CI ON CI.venta_id = V.id
      WHERE V.devengada = 0
        AND CASE
              WHEN V.tipo = 'Sepultura' THEN
                CASE
                  WHEN S.pago_inicial >= S.valor_total * 0.08 THEN
                    DATE(V.fecha, '+1 month', '05 days')
                  ELSE
                    DATE(S.fecha_primera_cuota, '+' || CAST(CEIL((S.valor_total*0.08 - S.pago_inicial)/S.valor_cuota) AS INTEGER) || ' months', '05 days')
                END
              ELSE
                DATE(V.fecha, '+1 month', '15 days')
            END BETWEEN DATE(?) AND DATE(?)
      ORDER BY fechaDevengo ASC
    `;
    const [res] = await this.db.executeSql(sql, [ini.toISOString().slice(0, 10), fin.toISOString().slice(0, 10)]);
    const out: any[] = [];
    for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
    return out;
  }

  async listRecordatorios(diasAtras: number, diasAdelante: number): Promise<any[]> {
    const hoy = new Date();
    const ini = new Date(hoy);
    ini.setDate(ini.getDate() - diasAtras);
    const fin = new Date(hoy);
    fin.setDate(fin.getDate() + diasAdelante);

    const sql = `
      SELECT 'CUMPLE_CLIENTE' AS tipo, C.nombre, C.fecha_nacimiento AS fecha, NULL AS fallecido, V.id AS ventaId
      FROM CLIENTES C
      JOIN VENTAS V ON V.cliente_id = C.id
      WHERE strftime('%m-%d', C.fecha_nacimiento) BETWEEN strftime('%m-%d', ?) AND strftime('%m-%d', ?)

      UNION ALL

      SELECT 'CUMPLE_FALLECIDO' AS tipo, F.nombre, F.fecha_nacimiento AS fecha, NULL AS fallecido, V.id AS ventaId
      FROM FALLECIDOS F
      JOIN VENTAS V ON V.fallecido_id = F.id
      WHERE strftime('%m-%d', F.fecha_nacimiento) BETWEEN strftime('%m-%d', ?) AND strftime('%m-%d', ?)

      UNION ALL

      SELECT 'ANIVERSARIO' AS tipo, F.nombre, F.fecha_defuncion AS fecha, NULL AS fallecido, V.id AS ventaId
      FROM FALLECIDOS F
      JOIN VENTAS V ON V.fallecido_id = F.id
      WHERE strftime('%m-%d', F.fecha_defuncion) BETWEEN strftime('%m-%d', ?) AND strftime('%m-%d', ?)

      ORDER BY fecha ASC
    `;
    const iniStr = ini.toISOString().slice(0, 10);
    const finStr = fin.toISOString().slice(0, 10);
    const [res] = await this.db.executeSql(sql, [iniStr, finStr, iniStr, finStr, iniStr, finStr]);
    const out: any[] = [];
    for (let i = 0; i < res.rows.length; i++) out.push(res.rows.item(i));
    return out;
  }
}
