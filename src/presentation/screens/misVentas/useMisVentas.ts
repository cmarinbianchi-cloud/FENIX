import { useState, useEffect, useCallback } from 'react';
import { VentaListItem } from '../../../domain/entities/VentaListItem';
import { VentaListRepository } from '../../../data/repositories/VentaListRepository';
import DB from '../../../data/db/DatabaseManager';
import debounce from 'lodash.debounce';

export type Filtros = {
  meses: number[];
  tipos: string[];
  funerarias: number[];
  devengado: 'devengadas' | 'porDevengar' | null;
  diasDevengado?: number;
  obsNot: ('obs' | 'not')[];
  texto: string;
  textoEsRut: boolean;
};

export function useMisVentas() {
  const [ventas, setVentas] = useState<VentaListItem[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtros, setFiltros] = useState<Filtros>({
    meses: [],
    tipos: [],
    funerarias: [],
    devengado: null,
    obsNot: [],
    texto: '',
    textoEsRut: true,
  });

  const repo = new VentaListRepository(DB.db!); // abriremos antes

  const listar = useCallback(async () => {
    setCargando(true);
    const data = await repo.list(filtros);
    setVentas(data);
    setCargando(false);
  }, [filtros]);

  useEffect(() => {
    DB.open().then(() => listar());
  }, [listar]);

  // búsqueda en tiempo real
  const setTextoDeb = debounce((t: string) => setFiltros(p => ({ ...p, texto: t })), 400);

  return { ventas, cargando, filtros, setFiltros, setTextoDeb, listar };
}