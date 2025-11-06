import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from './src/presentation/screens/DashboardScreen';
import { NuevaVentaScreen } from './src/presentation/screens/NuevaVentaScreen'; // ← NUEVA IMPORTACIÓN


const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NuevaVenta" component={NuevaVentaScreen} options={{ title: 'Nueva Venta' }} /> {/* ← NUEVA PANTALLA */}
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}
