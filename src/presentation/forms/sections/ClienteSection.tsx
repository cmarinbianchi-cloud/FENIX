import { Control, Controller, UseFormReturn } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import { VentaFormValues } from '../ventaSchema';
import { useState } from 'react';
import debounce from 'lodash.debounce';
import DB from '../../../data/db/DatabaseManager';
import { ClienteRepository } from '../../../data/repositories/ClienteRepository';

export const ClienteSection = ({ form }: { form: UseFormReturn<VentaFormValues> }) => {
  const { control, setValue } = form;
  const [loading, setLoading] = useState(false);

  const buscarRut = debounce(async (rut: string) => {
    if (!rut || rut.length < 3) return;
    setLoading(true);
    const db = await DB.open();
    const repo = new ClienteRepository(db);
    const c = await repo.getByRut(rut);
    if (c) {
      setValue('nombreCliente', c.nombre);
      setValue('fechaNacCliente', c.fecha_nacimiento);
      setValue('telefonoCliente', c.telefono ?? '');
      setValue('emailCliente', c.email ?? '');
    }
    setLoading(false);
  }, 400);

  return (
    <>
      <Controller
        control={control}
        name="rutCliente"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <TextInput
            label="RUT Cliente"
            value={value}
            onChangeText={t => {
              onChange(t);
              buscarRut(t);
            }}
            error={!!error}
            autoCapitalize="none"
          />
        )}
      />
      <Controller
        control={control}
        name="nombreCliente"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Nombre Completo" value={value} onChangeText={onChange} disabled={loading} />
        )}
      />
      {/* fechaNac, tel, email idem */}
    </>
  );
};