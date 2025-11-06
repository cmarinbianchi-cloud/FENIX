import { Controller, UseFormReturn } from 'react-hook-form';
import { VentaFormValues } from '../ventaSchema';
import { Switch, TextInput, Divider } from 'react-native-paper';

export const FallecidoSection = ({ form }: { form: UseFormReturn<VentaFormValues> }) => {
  const { control, watch, setValue } = form;
  const esVt = watch('esVt');

  return (
    <>
      <Divider bold style={{ marginVertical: 8 }} />
      <Controller
        control={control}
        name="esVt"
        render={({ field: { value, onChange } }) => (
          <Switch value={value} onValueChange={onChange} />
        )}
      />
      {!esVt && (
        <>
          <Controller
            control={control}
            name="rutFallecido"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <TextInput label="RUT Fallecido" value={value} onChangeText={onChange} error={!!error} autoCapitalize="none" />
            )}
          />
          <Controller
            control={control}
            name="nombreFallecido"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Nombre Fallecido" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="fechaNacFallecido"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Fecha Nac. Fallecido" value={value} onChangeText={onChange} />
            )}
          />
          <Controller
            control={control}
            name="fechaDefuncion"
            render={({ field: { onChange, value } }) => (
              <TextInput label="Fecha Defunción" value={value} onChangeText={onChange} />
            )}
          />
        </>
      )}
    </>
  );
};