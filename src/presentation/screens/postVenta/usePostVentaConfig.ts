import { useEffect, useState } from 'react';
import { PostVentaConfig } from '../../../domain/entities/PostVentaConfig';
import { ConfigRepository } from '../../../data/repositories/ConfigRepository';
import DB from '../../../data/db/DatabaseManager';

export function usePostVentaConfig(): PostVentaConfig {
  const [cfg, setCfg] = useState<PostVentaConfig>({
    cuotasDiasAtras: 7,
    cuotasDiasAdelante: 30,
    proyeccionesDiasAtras: 15,
    proyeccionesDiasAdelante: 45,
    recordatoriosDiasAtras: 0,
    recordatoriosDiasAdelante: 30,
  });

  useEffect(() => {
    DB.open().then(async db => {
      const repo = new ConfigRepository(db);
      const c = await repo.getPostVenta();
      if (c) setCfg(c);
    });
  }, []);

  return cfg;
}