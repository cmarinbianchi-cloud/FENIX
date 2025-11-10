import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DashboardScreen } from './presentation/screens/DashboardScreen';
import { MisVentasScreen } from './presentation/screens/misVentas/MisVentasScreen';
import { NuevaVentaScreen } from './presentation/screens/NuevaVentaScreen';
import { DetalleVentaScreen } from './presentation/screens/detalleVenta/DetalleVentaScreen';
import { EditarVentaScreen } from './presentation/screens/editarVenta/EditarVentaScreen';
import { PostVentaStack } from './presentation/screens/postVenta/PostVentaStack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Dashboard">
          <Stack.Screen name="Dashboard" component={DashboardScreen} options={{ headerShown: false }} />
          <Stack.Screen name="MisVentas" component={MisVentasScreen} options={{ headerShown: false }} />
          <Stack.Screen name="NuevaVenta" component={NuevaVentaScreen} />
          <Stack.Screen name="DetalleVenta" component={DetalleVentaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="EditarVenta" component={EditarVentaScreen} options={{ headerShown: false }} />
          <Stack.Screen name="PostVenta" component={PostVentaStack} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}



