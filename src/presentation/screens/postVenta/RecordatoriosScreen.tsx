import React, { useEffect, useState } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Appbar, Text, List, Divider, Button } from 'react-native-paper';
import { PostVentaRepository } from '../../../data/repositories/PostVentaRepository';
import DB from '../../../data/db/DatabaseManager';
import { usePostVentaConfig } from './usePostVentaConfig';

export const RecordatoriosScreen = ({ navigation }) => {
  const [recordatorios, setRecordatorios] = useState<any>({});
  const config = usePostVentaConfig(); // hook lee ajustes
  const repo = new PostVentaRepository(DB.db!);

  useEffect(() => {
    DB.open().then(async () => {
      const data = await repo.listRecordatorios(config.recordatoriosDiasAtras, config.recordatoriosDiasAdelante);
      // Agrupar por fecha
      const agrupados = data.reduce((acc: any, item: any) => {
        if (!acc[item.fecha]) {
          acc[item.fecha] = [];
        }
        acc[item.fecha].push(item);
        return acc;
      }, {});
      setRecordatorios(agrupados);
    });
  }, [config]);

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Recordatorios" />
        <Appbar.Action icon="filter" onPress={() => {}} />
      </Appbar.Header>

      <ScrollView>
        {Object.keys(recordatorios).length === 0 && (
          <Text style={styles.empty}>Sin recordatorios en el rango</Text>
        )}
        {Object.entries(recordatorios).map(([fecha, items]: [string, any]) => (
          <View key={fecha}>
            <Text variant="titleMedium" style={styles.fechaHeader}>{fecha}</Text>
            {items.map((r: any) => (
              <List.Item
                key={r.id}
                title={r.cliente}
                description={`${r.tipo} | ${r.descripcion}`}
                right={() => (
                  <Button mode="text" onPress={() => navigation.navigate('DetalleVenta', { id: r.id })}>
                    Ver
                  </Button>
                )}
              />
            ))}
            <Divider />
          </View>
        ))}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  empty: { textAlign: 'center', marginTop: 32 },
  fechaHeader: { marginHorizontal: 16, marginTop: 12, marginBottom: 8, fontWeight: 'bold' },
});
