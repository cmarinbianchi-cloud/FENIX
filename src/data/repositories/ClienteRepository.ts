export class ClienteRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}
  async getByRut(rut: string): Promise<Cliente | null> {
    const res = await this.db.executeSql('SELECT * FROM CLIENTES WHERE rut = ?', [rut]);
    return res[0].rows.length ? res[0].rows.item(0) : null;
  }
  async create(c: Cliente): Promise<number> { ... }
}
