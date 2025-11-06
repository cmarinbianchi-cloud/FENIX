import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button, IconButton, Badge } from 'react-native-paper';
import { VentaListItem } from '../../../../domain/entities/VentaListItem';

const colorDias = (d?: number) => {
  if (!d) return undefined;
  if (d <= 150) return 'green';
  if (d <= 210) return 'orange';
  return 'red';
};

export const VentaCard = ({ item, navigation }: { item: VentaListItem; navigation: any }) => {
  const [expanded, setExpanded] = useState(false);

  const left = () => (
    <View style={{ marginRight: 8 }}>
      <Text variant="labelSmall">{item.fechaVenta}</Text>
      <Text variant="titleSmall">{item.tipo}</Text>
    </View>
  );

  const right = () => (
    <View style={{ alignItems: 'flex-end' }}>
      <Text variant="titleMedium">${item.valorVenta.toLocaleString('es-CL')}</Text>
      {item.diasSinDevengar != null && (
        <Badge style={{ backgroundColor: colorDias(item.diasSinDevengar) }}>{item.diasSinDevengar} d</Badge>
      )}
      {item.funerariaExcluyePremio && <Badge style={{ backgroundColor: '#d32f2f' }}>socia</Badge>}
      {item.tieneObs && <IconButton icon="comment-text" size={16} />}
      {item.tieneNotif && <IconButton icon="bell" size={16} />}
    </View>
  );

  return (
    <Card style={styles.card} onPress={() => setExpanded(!expanded)}>
      <Card.Title title={item.cliente} subtitle={item.fallecido || 'VT'} left={left} right={right} />
      {expanded && (
        <Card.Content>
          <Text>RUT: {item.rutCliente}</Text>
          <Text>Funeraria: {item.funeraria}</Text>
          <Text>Devengada: {item.devengada ? 'Sí' : 'No'}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 8 }}>
            <Button mode="outlined" onPress={() => navigation.navigate('EditarVenta', { id: item.id })}>
              Editar
            </Button>
            <Button mode="contained" onPress={() => navigation.navigate('DetalleVenta', { id: item.id })}>
              Ver
            </Button>
          </View>
        </Card.Content>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({ card: { marginHorizontal: 8, marginVertical: 4 } });
