import { useState } from 'react';
import { ExportRow } from '../../../domain/entities/ExportRow';
import { ExportRepository } from '../../../data/repositories/ExportRepository';
import { ExportService } from '../../../domain/services/ExportService';
import DB from '../../../data/db/DatabaseManager';

export function useExport(filters: Parameters<ExportRepository['getRows']>[0]) {
  const [generando, setGenerando] = useState(false);

  const repo = new ExportRepository(DB.db!);
  const svc = new ExportService();

  const exportar = async (tipo: 'CSV' | 'PDF') => {
    setGenerando(true);
    const rows = await repo.getRows(filters);
    const path = tipo === 'CSV' ? await svc.exportarCSV(rows) : await svc.exportarPDF(rows);
    await svc.compartir(path, tipo);
    setGenerando(false);
  };

  return { generando, exportar };
}
