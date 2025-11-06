import { Controller, UseFormReturn } from 'react-hook-form';
import { VentaFormValues } from '../ventaSchema';
import { TextInput, RadioButton } from 'react-native-paper';

const MEDIOS = ['PAC', 'PAT', 'Personal'];

export const SepulturaSection = ({ form }: { form: UseFormReturn<VentaFormValues> }) => {
  const { control, watch } = form;
  const valorTotal = watch('valorTotal');
  const pagoInicial = watch('pagoInicial');
  const numCuotas = watch('numCuotas');
  const valorCuota = watch('valorCuota');
  const fechaPrimera = watch('fechaPrimeraCuota');

  const cumple8 = pagoInicial >= valorTotal * 0.08;

  return (
    <>
      <Controller
        control={control}
        name="valorTotal"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Valor Total Sepultura" value={String(value)} onChangeText={v => onChange(Number(v))} keyboardType="numeric" />
        )}
      />
      <Controller
        control={control}
        name="pagoInicial"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Pago Inicial" value={String(value)} onChangeText={v => onChange(Number(v))} keyboardType="numeric" />
        )}
      />
      <Controller
        control={control}
        name="numCuotas"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Número Cuotas" value={String(value)} onChangeText={v => onChange(Number(v))} keyboardType="numeric" />
        )}
      />
      <TextInput label="Valor Cuota" value={String(valorCuota)} disabled />
      <Controller
        control={control}
        name="fechaPrimeraCuota"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Fecha Primera Cuota (día 04, 15 o 25)" value={value} onChangeText={onChange} />
        )}
      />
      <RadioButton.Group onValueChange={v => form.setValue('medioPago', v)} value={watch('medioPago')}>
        {MEDIOS.map(m => (
          <RadioButton.Item key={m} label={m} value={m} />
        ))}
      </RadioButton.Group>
      {cumple8 && <Text>✅ Pago inicial ≥ 8 % – devengo inmediato</Text>}
      {!cumple8 && fechaPrimera && <Text>📅 8 % se alcanzará el: {form.fecha8Porciento}</Text>}
    </>
  );
};