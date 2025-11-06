import { MesComercial } from '../../../domain/entities/MesComercial';

export interface IMesComercialRepository {
  create(mes: MesComercial): Promise<number>;
  getCurrent(): Promise<MesComercial | null>;
  getAll(): Promise<MesComercial[]>;
  update(mes: MesComercial): Promise<void>;
  cerrarYcrearSiguiente(idActual: number, metaNuevo: number): Promise<void>;
}