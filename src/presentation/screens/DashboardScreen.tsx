import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { Appbar, Button, Card, Text, useTheme } from 'react-native-paper';
import DB from '../../data/db/DatabaseManager';
import { MesComercialRepository } from '../../data/repositories/MesComercialRepository';

export const DashboardScreen = ({ navigation, route }: any) => {
  const theme = useTheme();
  const [agente] = useState('CARLOS');
  const [mesActual, setMesActual] = useState<any>(null);
  const [metrics, setMetrics] = useState({ val1: 0, val4: 0, val8: 0 });

  const reloadMetrics = async () => {
    const db = await DB.open();
    const repo = new MesComercialRepository(db);
    const m = await repo.getCurrent();
    if (m) setMesActual(m);
    setMetrics({ val1: 45000, val4: 7, val8: 3 });
  };

  useEffect(() => {
    reloadMetrics();
    if (route.params?.updated) reloadMetrics();
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
            <Text style={{ color: theme.colors.primary }}>Sin exclusión: ${metrics.val1.toLocaleString('es-CL')}</Text>
            <Text>Meta: ${mesActual?.meta ?? 0}</Text>
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.card}>
          <Card.Title title="Cinerario" />
          <Card.Content>
            <Text style={{ color: theme.colors.primary }}>Ventas (cant): {metrics.val4}</Text>
          </Card.Content>
        </Card>

        <Card mode="elevated" style={styles.card}>
          <Card.Title title="Asistencias" />
          <Card.Content>
            <Text style={{ color: theme.colors.primary }}>Serv. adic.: {metrics.val8}</Text>
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

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  greeting: { textAlign: 'center', marginVertical: 4 },
  sub: { textAlign: 'center', marginBottom: 2 },
  month: { textAlign: 'center', marginBottom: 16 },
  card: { marginBottom: 12 },
  actions: { marginTop: 16, gap: 8 },
});

