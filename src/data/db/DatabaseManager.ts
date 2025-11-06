import SQLite from 'react-native-sqlite-storage';
import initialMigration from './initial_migration.sql'; // string raw

class DatabaseManager {
  private static instance: DatabaseManager;
  private db?: SQLite.SQLiteDatabase;

  static getInstance(): DatabaseManager {
    if (!DatabaseManager.instance) DatabaseManager.instance = new DatabaseManager();
    return DatabaseManager.instance;
  }

  async open(): Promise<SQLite.SQLiteDatabase> {
    if (this.db) return this.db;
    this.db = await SQLite.openDatabase({ name: 'GrupoEmergencias.db', location: 'default' });
    await this.migrate();
    return this.db;
  }

  private async migrate() {
    await this.db!.transaction(tx => tx.executeSql(initialMigration));
  }
}

export default DatabaseManager.getInstance();
