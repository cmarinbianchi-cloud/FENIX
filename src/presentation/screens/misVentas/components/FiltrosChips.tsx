import React from 'react';
import { ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { Filtros } from '../useMisVentas';

export const FiltrosChips = ({ filtros, setFiltros, onClear }: { filtros: Filtros; setFiltros: any; onClear: () => void }) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 8, marginVertical: 4 }}>
    <Chip mode={filtros.devengado === null ? 'flat' : 'outlined'} onPress={() => setFiltros({ ...filtros, devengado: null })}>
      Todas
    </Chip>
    <Chip mode={filtros.devengado === 'devengadas' ? 'flat' : 'outlined'} onPress={() => setFiltros({ ...filtros, devengado: 'devengadas' })}>
      Devengadas
    </Chip>
    <Chip mode={filtros.devengado === 'porDevengar' ? 'flat' : 'outlined'} onPress={() => setFiltros({ ...filtros, devengado: 'porDevengar' })}>
      Por devengar
    </Chip>
    <Chip onPress={onClear}>Limpiar</Chip>
  </ScrollView>
);