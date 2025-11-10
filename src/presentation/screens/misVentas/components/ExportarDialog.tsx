import React from 'react';
import { Portal, Dialog, Button, RadioButton, Text } from 'react-native-paper';
import { useExport } from '../screens/export/useExport';

type Props = {
  visible: boolean;
  onClose: () => void;
  filters: any;
};

export const ExportarDialog = ({ visible, onClose, filters }: Props) => {
  const [formato, setFormato] = React.useState<'CSV' | 'PDF'>('CSV');
  const { generando, exportar } = useExport(filters);

  const iniciar = async () => {
    await exportar(formato);
    onClose();
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onClose}>
        <Dialog.Title>Exportar listado</Dialog.Title>
        <Dialog.Content>
          <RadioButton.Group onValueChange={v => setFormato(v as any)} value={formato}>
            <RadioButton.Item label="CSV" value="CSV" />
            <RadioButton.Item label="PDF (texto)" value="PDF" />
          </RadioButton.Group>
          {generando && <Text>Generando…</Text>}
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onClose} disabled={generando}>
            Cancelar
          </Button>
          <Button onPress={iniciar} loading={generando} disabled={generando}>
            Exportar y compartir
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};