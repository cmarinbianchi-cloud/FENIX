import { Controller } from 'react-hook-form';
import { TextInput } from 'react-native-paper';
import { UseFormReturn } from 'react-hook-form';
import { VentaFormValues } from '../ventaSchema';

export const CinerarioSection = ({ form }: { form: UseFormReturn<VentaFormValues> }) => (
  <Controller
    control={form.control}
    name="valorVentaCinerario"
    render={({ field: { onChange, value } }) => (
      <TextInput label="Valor Venta Cinerario" value={String(value)} onChangeText={v => onChange(Number(v))} keyboardType="numeric" />
    )}
  />
);
