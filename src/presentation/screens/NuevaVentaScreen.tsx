import { useVentaForm } from '../forms/useVentaForm';
import { ClienteSection } from '../forms/sections/ClienteSection';
import { FallecidoSection } from '../forms/sections/FallecidoSection';
import { VentaGeneralSection } from '../forms/sections/VentaGeneralSection';
import { SepulturaSection } from '../forms/sections/SepulturaSection';
import { CinerarioSection } from '../forms/sections/CinerarioSection';
import { ServiciosSection } from '../forms/sections/ServiciosSection';
import { Button, ScrollView } from 'react-native-paper';
import { VentaRepository } from '../../data/repositories/VentaRepository';
import DB from '../../data/db/DatabaseManager';

export const NuevaVentaScreen = ({ navigation }) => {
  const form = useVentaForm();
  const { handleSubmit, watch } = form;
  const tipo = watch('tipo');

  const onGuardar = handleSubmit(async data => {
    const db = await DB.open();
    const ventaRepo = new VentaRepository(db);
    await ventaRepo.crearVentaCompleta(data); // transaccional
    navigation.replace('Dashboard');
  });

  return (
    <>
      <ScrollView>
        <ClienteSection form={form} />
        <FallecidoSection form={form} />
        <VentaGeneralSection form={form} />
        {tipo === 'Sepultura' && <SepulturaSection form={form} />}
        {tipo === 'Cinerario' && <CinerarioSection form={form} />}
        {tipo === 'Servicio Adicional' && <ServiciosSection form={form} />}
        <Button mode="contained" onPress={onGuardar} style={{ margin: 16 }}>
          Guardar Venta
        </Button>
      </ScrollView>
    </>
  );
};