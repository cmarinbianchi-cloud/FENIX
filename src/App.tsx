import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from './src/presentation/screens/DashboardScreen';
import { NuevaVentaScreen } from './src/presentation/screens/NuevaVentaScreen';
import { MisVentasScreen } from './src/presentation/screens/MisVentasScreen';
import { DetalleVentaScreen } from './src/presentation/screens/DetalleVentaScreen'; // ← NUEVA IMPORTACIÓN


const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NuevaVenta" component={NuevaVentaScreen} options={{ title: 'Nueva Venta' }} />
          <Stack.Screen name="MisVentas" component={MisVentasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} options={{ headerShown: false }} /> {/* ← NUEVA PANTALLA */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

