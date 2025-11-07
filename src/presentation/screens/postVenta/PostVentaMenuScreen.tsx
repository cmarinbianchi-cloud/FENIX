import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Card, Title } from 'react-native-paper';

export const PostVentaMenuScreen = ({ navigation }) => (
  <View style={styles.container}>
    <Card style={styles.card}>
      <Card.Content>
        <Title>Cuotas 8 %</Title>
        <Button mode="contained" onPress={() => navigation.navigate('Cuotas')}>
          Ver listado
        </Button>
      </Card.Content>
    </Card>
    <Card style={styles.card}>
      <Card.Content>
        <Title>Proyecciones de devengo</Title>
        <Button mode="contained" onPress={() => navigation.navigate('Proyecciones')}>
          Ver listado
        </Button>
      </Card.Content>
    </Card>
    <Card style={styles.card}>
      <Card.Content>
        <Title>Recordatorios</Title>
        <Button mode="contained" onPress={() => navigation.navigate('Recordatorios')}>
          Ver listado
        </Button>
      </Card.Content>
    </Card>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: { marginBottom: 12 },
});