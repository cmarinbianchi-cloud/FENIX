import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Appbar, Text, List, Badge, Button } from 'react-native-paper';
import { PostVentaRepository } from '../../../data/repositories/PostVentaRepository';
import DB from '../../../data/db/DatabaseManager';
import { usePostVentaConfig } from './usePostVentaConfig';

export const ProyeccionesScreen = ({ navigation }) => {
  const [rows, setRows] = useState<any[]>([]);
  const config = usePostVentaConfig(); // hook lee ajustes
  const repo = new PostVentaRepository(DB.db!);

  useEffect(() => {
    DB.open().then(async () => {
      const data = await repo.listProyecciones(config.proyeccionesDiasAtras, config.proyeccionesDiasAdelante);
      setRows(data);
    });
  }, [config]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Proyecciones" />
        <Appbar.Action icon="filter" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView>
        {rows.length === 0 && <Text style={styles.empty}>Sin proyecciones en el rango</Text>}
        {rows.map(r => (
          <List.Item
            key={r.id}
            title={r.cliente}
            description={`Fecha proyección: ${r.fechaProyeccion} | Monto: ${r.monto}`}
            left={() => <Badge style={{ alignSelf: 'center' }}>{r.diasPara} d</Badge>}
            right={() => (
              <Button mode="text" onPress={() => navigation.navigate('DetalleVenta', { id: r.id })}>
                Ver
              </Button>
            )}
          />
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({ empty: { textAlign: 'center', marginTop: 32 } });
