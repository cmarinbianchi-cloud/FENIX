import { Controller, UseFormReturn } from 'react-hook-form';
import { VentaFormValues } from '../ventaSchema';
import { TextInput, RadioButton, List } from 'react-native-paper';

const UNIDADES = ['PAV', 'PAV2', 'PCO', 'PPH'];

export const VentaGeneralSection = ({ form }: { form: UseFormReturn<VentaFormValues> }) => {
  const { control, watch, setValue } = form;
  const tipo = watch('tipo');

  return (
    <>
      <List.Accordion title="Datos de la Venta" left={props => <List.Icon {...props} icon="file-document-edit" />}>
        <Controller
          control={control}
          name="fechaVenta"
          render={({ field: { onChange, value } }) => (
            <TextInput label="Fecha Venta" value={value} onChangeText={onChange} />
          )}
        />
        <RadioButton.Group onValueChange={v => setValue('tipo', v)} value={tipo}>
          <RadioButton.Item label="Sepultura" value="Sepultura" />
          <RadioButton.Item label="Cinerario" value="Cinerario" />
          <RadioButton.Item label="Servicio Adicional" value="Servicio Adicional" />
        </RadioButton.Group>
        <Controller
          control={control}
          name="unidadNegocio"
          render={({ field: { onChange, value } }) => (
            <RadioButton.Group onValueChange={onChange} value={value}>
              {UNIDADES.map(u => (
                <RadioButton.Item key={u} label={u} value={u} />
              ))}
            </RadioButton.Group>
          )}
        />
        {/* Selector Funeraria se llena desde repo */}
      </List.Accordion>
    </>
  );
};