import SQLite from 'react-native-sqlite-storage';
import { IMesComercialRepository } from './interfaces/IMesComercialRepository';
import { MesComercial } from '../../domain/entities/MesComercial';

export class MesComercialRepository implements IMesComercialRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async create(m: MesComercial): Promise<number> {
    const res = await this.db.executeSql(
      `INSERT INTO MESES_COMERCIALES(nombre, fecha_inicio, fecha_termino, meta)
       VALUES (?, ?, ?, ?)`,
      [m.nombre, m.fechaInicio, m.fechaTermino ?? null, m.meta]
    );
    return res[0].insertId;
  }

  async getCurrent(): Promise<MesComercial | null> {
    const res = await this.db.executeSql(
      `SELECT * FROM MESES_COMERCIALES WHERE fecha_termino IS NULL ORDER BY fecha_inicio DESC LIMIT 1`
    );
    if (res[0].rows.length === 0) return null;
    const r = res[0].rows.item(0);
    return { id: r.id, nombre: r.nombre, fechaInicio: r.fecha_inicio, fechaTermino: r.fecha_termino, meta: r.meta };
  }

  async getAll(): Promise<MesComercial[]> {
    const res = await this.db.executeSql(
      `SELECT * FROM MESES_COMERCIALES ORDER BY fecha_inicio DESC`
    );
    const out: MesComercial[] = [];
    for (let i = 0; i < res[0].rows.length; i++) {
      const r = res[0].rows.item(i);
      out.push({ id: r.id, nombre: r.nombre, fechaInicio: r.fecha_inicio, fechaTermino: r.fecha_termino, meta: r.meta });
    }
    return out;
  }

  async update(m: MesComercial): Promise<void> {
    await this.db.executeSql(
      `UPDATE MESES_COMERCIALES
       SET fecha_inicio = ?, fecha_termino = ?, meta = ?
       WHERE id = ?`,
      [m.fechaInicio, m.fechaTermino ?? null, m.meta, m.id!]
    );
  }

  async cerrarYcrearSiguiente(idActual: number, metaNuevo: number): Promise<void> {
    const hoy = new Date().toISOString().slice(0, 10);
    await this.db.executeSql(`UPDATE MESES_COMERCIALES SET fecha_termino = ? WHERE id = ?`, [hoy, idActual]);

    const inicioSig = new Date();
    inicioSig.setDate(inicioSig.getDate() + 1);
    const nombreSig = inicioSig.toLocaleString('es-CL', { month: 'long', year: 'numeric' }).toUpperCase();
    await this.create({
      nombre: nombreSig,
      fechaInicio: inicioSig.toISOString().slice(0, 10),
      meta: metaNuevo,
    });
  }
}