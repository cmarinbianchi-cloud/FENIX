import React from 'react';
import { ScrollView } from 'react-native';
import { Appbar, Button, Text, Divider } from 'react-native-paper';
import { useForm, SubmitHandler } from 'react-hook-form';
import { VentaFormValuesEdit, ventaSchema } from '../../forms/ventaSchema';
import { yupResolver } from '@hookform/resolvers/yup';
import { useVentaFormEdit } from '../../forms/useVentaFormEdit';
import { EditarVentaRepository } from '../../../data/repositories/EditarVentaRepository';
import DB from '../../../data/db/DatabaseManager';


export const EditarVentaScreen = ({ navigation, route }) => {
  const ventaId = route.params.id;
  const form = useVentaFormEdit(ventaId);
  const { handleSubmit, formState, getValues } = useForm<VentaFormValuesEdit>({
    resolver: yupResolver(ventaSchema),
    defaultValues: getValues(),
  });


  const onGuardar: SubmitHandler<VentaFormValuesEdit> = async data => {
    const db = await DB.open();
    const repo = new EditarVentaRepository(db);
    await repo.actualizarVentaCompleta({ ...data, ventaId });
    navigation.navigate('Dashboard', { updated: true });
  };


  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Editar Venta" />
        <Appbar.Action icon="check" onPress={handleSubmit(onGuardar)} />
      </Appbar.Header>


      <ScrollView>
        {/* Deshabilitamos cambio de tipo */}
        <Text variant="labelMedium" style={{ marginHorizontal: 16, marginTop: 8 }}>
          Tipo: {getValues('tipo')} (no editable)
        </Text>


        {/* Reutilizamos las mismas secciones */}
        <ClienteSection form={form} />
        <FallecidoSection form={form} />
        <VentaGeneralSection form={form} />


        {getValues('tipo') === 'Sepultura' && <SepulturaSection form={form} />}
        {getValues('tipo') === 'Cinerario' && <CinerarioSection form={form} />}
        {getValues('tipo') === 'Servicio Adicional' && <ServiciosSection form={form} />}


        <Button mode="contained" onPress={handleSubmit(onGuardar)} style={{ margin: 16 }}>
          Guardar cambios
        </Button>
      </ScrollView>
    </>
  );
};

