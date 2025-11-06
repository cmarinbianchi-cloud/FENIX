import React from 'react';
import { Portal, Dialog, Button, RadioButton, Text } from 'react-native-paper';
import { VentaListItem } from '../../../../domain/entities/VentaListItem';

export const ExportarDialog = ({ visible, onClose, ventas }: { visible: boolean; onClose: () => void; ventas: VentaListItem[] }) => {
  const [formato, setFormato] = React.useState<'CSV' | 'PDF'>('CSV');

  const exportar = () => {
    // TODO lógica real (RNFS, react-native-share)
    console.log(`Exportando ${ventas.length} ventas en ${formato}`);
    onClose();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>Exportar listado</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group onValueChange={v => setFormato(v as any)} value={formato}>
            <RadioButton.Item label="CSV" value="CSV" />
            <RadioButton.Item label="PDF" value="PDF" />
          </RadioButton.Group>
          <Text>{ventas.length} registros</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose}>Cancelar</Button>
          <Button onPress={exportar}>Descargar</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};