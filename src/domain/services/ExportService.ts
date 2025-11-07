import RNFS from 'react-native-fs';
import Share from 'react-native-share';
import { ExportRow } from '../entities/ExportRow';

export class ExportService {
  async exportarCSV(rows: ExportRow[]): Promise<string> {
    const header = Object.keys(rows[0]).join(';');
    const body = rows.map(r => Object.values(r).join(';')).join('\n');
    const csv = `${header}\n${body}`;
    const fileName = `Ventas_${new Date().toISOString().slice(0, 10)}_${Date.now()}.csv`;
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, csv, 'utf8');
    return path;
  }

  async exportarPDF(rows: ExportRow[]): Promise<string> {
    // stub – librería sugerida: react-native-pdf-lib o pdfmake + rn-fetch-blob
    // por simplicidad generamos **CSV con extensión .pdf** y compartimos
    // (opcional) más adelante PDF real
    const csv = this.convertToPDFTable(rows); // texto plano tabular
    const fileName = `Ventas_${new Date().toISOString().slice(0, 10)}_${Date.now()}.pdf`;
    const path = `${RNFS.DownloadDirectoryPath}/${fileName}`;
    await RNFS.writeFile(path, csv, 'utf8');
    return path;
  }

  private convertToPDFTable(rows: ExportRow[]): string {
    // texto tabular simple
    const header = Object.keys(rows[0]).join('\t');
    const body = rows.map(r => Object.values(r).join('\t')).join('\n');
    return `${header}\n${body}`;
  }

  async compartir(path: string, tipo: 'CSV' | 'PDF'): Promise<void> {
    await Share.open({
      url: `file://${path}`,
      type: tipo === 'CSV' ? 'text/csv' : 'application/pdf',
      failOnCancel: false,
    });
  }
}