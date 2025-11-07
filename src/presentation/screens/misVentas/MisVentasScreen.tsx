import React, { useLayoutEffect } from 'react';
import { ScrollView, View, StyleSheet } from 'react-native';
import { Appbar, Button, Searchbar, FAB, Text, ActivityIndicator } from 'react-native-paper';
import { useMisVentas } from './useMisVentas';
import { FiltrosChips } from './components/FiltrosChips';
import { VentaCard } from './components/VentaCard';
import { ExportarDialog } from './components/ExportarDialog';


export const MisVentasScreen = ({ navigation }) => {
  const { ventas, cargando, filtros, setFiltros, setTextoDeb, listar } = useMisVentas();
  const [search, setSearch] = React.useState('');
  const [exportOpen, setExportOpen] = React.useState(false);


  useLayoutEffect(() => {
    navigation.setOptions({
      header: () => (
        <Appbar.Header>
          <Appbar.BackAction onPress={() => navigation.goBack()} />
          <Appbar.Content title="Mis Ventas" />
          <Appbar.Action icon="file-export" onPress={() => setExportOpen(true)} />
        </Appbar.Header>
      ),
    });
  }, [navigation]);


  const onChangeSearch = (q: string) => {
    setSearch(q);
    setTextoDeb(q);
  };


  const onClearFiltros = () => {
    setFiltros({ meses: [], tipos: [], funerarias: [], devengado: null, obsNot: [], texto: '', textoEsRut: true });
    setSearch('');
  };


  return (
    <View style={{ flex: 1 }}>
      <Searchbar placeholder="RUT o Nombre" value={search} onChangeText={onChangeSearch} style={styles.search} />
      <FiltrosChips filtros={filtros} setFiltros={setFiltros} onClear={onClearFiltros} />


      {cargando ? (
        <ActivityIndicator style={{ marginTop: 32 }} />
      ) : (
        <ScrollView contentInsetAdjustmentBehavior="automatic">
          {ventas.length === 0 && <Text style={styles.empty}>Sin ventas para los filtros aplicados</Text>}
          {ventas.map(v => (
            <VentaCard key={v.id} item={v} navigation={navigation} />
          ))}
        </ScrollView>
      )}


      <FAB icon="plus" onPress={() => navigation.navigate('NuevaVenta')} style={styles.fab} />


      <ExportarDialog 
        visible={exportOpen} 
        onClose={() => setExportOpen(false)} 
        filters={filtros}
        ventas={ventas}
      />
    </View>
  );
};


const styles = StyleSheet.create({
  search: { margin: 8 },
  fab: { position: 'absolute', right: 16, bottom: 16 },
  empty: { textAlign: 'center', marginTop: 24 },
});
