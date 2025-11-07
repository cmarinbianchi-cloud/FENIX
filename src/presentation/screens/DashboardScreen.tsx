import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Appbar, Card, Text, Button, useTheme } from 'react-native-paper';
import DB from '../../data/db/DatabaseManager';
import { MesComercialRepository } from '../../data/repositories/MesComercialRepository';
import { MesComercial } from '../../domain/entities/MesComercial';


export const DashboardScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const [agente] = useState('CARLOS'); // stub
  const [mesActual, setMesActual] = useState<MesComercial | null>(null);
  const [metrics, setMetrics] = useState({ val1: 0, val4: 0, val8: 0 }); // stubs


  const reloadMetrics = async () => {
    const db = await DB.open();
    const repo = new MesComercialRepository(db);
    // TODO leer ventas reales y recalcular métricas
    setMetrics({ val1: 45000, val4: 7, val8: 3 });
  };


  useEffect(() => {
    (async () => {
      const db = await DB.open();
      const repo = new MesComercialRepository(db);
      let m = await repo.getCurrent();
      if (!m) {
        // Flujo 4.2 – crea mes inicial
        const id = await repo.create({
          nombre: 'SEPTIEMBRE-2025',
          fechaInicio: '2025-09-01',
          meta: 100000,
        });
        m = (await repo.getAll()).find(mm => mm.id === id) ?? null;
      }
      setMesActual(m);
      // TODO leer ventas reales
      setMetrics({ val1: 45000, val4: 7, val8: 3 });
    })();
  }, []);


  useEffect(() => {
    if (route.params?.updated) {
      reloadMetrics();
    }
  }, [route.params]);


  return (
    <>
      <Appbar.Header>
        <Appbar.Action icon="cog" onPress={() => {}} />
        <Appbar.Content title={new Date().toLocaleDateString('es-CL')} />
        <Appbar.Action icon="bell" onPress={() => {}} />
      </Appbar.Header>


      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
        <Text variant="headlineSmall" style={styles.greeting}>HOLA, {agente}</Text>
        <Text variant="titleMedium" style={styles.sub}>MES COMERCIAL ACTUAL</Text>
        <Text variant="headlineMedium" style={styles.month}>{mesActual?.nombre}</Text>


        <Card mode="elevated" style={styles.card}>
          <Card.Title title="Sepulturas" />
          <Card.Content>
            <MetricRow color={theme.colors.primary} label="Sin exclusión" value={metrics.val1} />
            <MetricRow color={theme.colors.tertiary} label="Meta" value={mesActual?.meta ?? 0} />
          </Card.Content>
        </Card>


        <Card mode="elevated" style={styles.card}>
          <Card.Title title="Cinerario" />
          <Card.Content>
            <MetricRow color={theme.colors.primary} label="Ventas (cant)" value={metrics.val4} />
          </Card.Content>
        </Card>


        <Card mode="elevated" style={styles.card}>
          <Card.Title title="Asistencias" />
          <Card.Content>
            <MetricRow color={theme.colors.primary} label="Serv. adic." value={metrics.val8} />
          </Card.Content>
        </Card>


        <View style={styles.actions}>
          <Button mode="contained" onPress={() => navigation.navigate('NuevaVenta')}>NUEVA VENTA</Button>
          <Button mode="outlined" onPress={() => navigation.navigate('MisVentas')}>MIS VENTAS</Button>
          <Button mode="outlined" onPress={() => navigation.navigate('PostVenta')}>POST VENTA</Button>
          <Button mode="text" onPress={() => {}}>SALIR</Button>
        </View>
      </ScrollView>
    </>
  );
};


const MetricRow = ({ color, label, value }: any) => (
  <View style={styles.row}>
    <Text variant="bodyLarge">{label}</Text>
    <Text variant="bodyLarge" style={{ color }}>{value.toLocaleString('es-CL')}</Text>
  </View>
);


const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  greeting: { textAlign: 'center', marginVertical: 4 },
  sub: { textAlign: 'center', marginBottom: 2 },
  month: { textAlign: 'center', marginBottom: 16 },
  card: { marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 4 },
  actions: { marginTop: 16, gap: 8 },
});

