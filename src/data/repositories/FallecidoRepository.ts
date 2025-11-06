export class FallecidoRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}
  async getByRut(rut: string): Promise<Fallecido | null> {
    const res = await this.db.executeSql('SELECT * FROM FALLECIDOS WHERE rut = ?', [rut]);
    return res[0].rows.length ? res[0].rows.item(0) : null;
  }
  async create(f: Fallecido): Promise<number> { ... }
}