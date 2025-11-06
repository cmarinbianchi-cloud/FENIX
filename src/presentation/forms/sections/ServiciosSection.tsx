import { useEffect, useState } from 'react';
import { Checkbox, List } from 'react-native-paper';
import { UseFormReturn } from 'react-hook-form';
import { VentaFormValues } from '../ventaSchema';
import { ServiciosAdicionalesRepository } from '../../../data/repositories/ServiciosAdicionalesRepository';
import DB from '../../../data/db/DatabaseManager';

export const ServiciosSection = ({ form }: { form: UseFormReturn<VentaFormValues> }) => {
  const { watch, setValue } = form;
  const [servicios, setServicios] = useState<{ id: number; nombre: string }[]>([]);
  const seleccionados = watch('serviciosIds');

  useEffect(() => {
    (async () => {
      const db = await DB.open();
      const repo = new ServiciosAdicionalesRepository(db);
      setServicios(await repo.getAll());
    })();
  }, []);

  const toggle = (id: number) => {
    const arr = seleccionados.includes(id) ? seleccionados.filter((x: number) => x !== id) : [...seleccionados, id];
    setValue('serviciosIds', arr);
  };

  return (
    <List.Section title="Servicios Adicionales">
      {servicios.map(s => (
        <Checkbox.Item key={s.id} label={s.nombre} status={seleccionados.includes(s.id) ? 'checked' : 'unchecked'} onPress={() => toggle(s.id)} />
      ))}
    </List.Section>
  );
};
