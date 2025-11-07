import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PostVentaMenuScreen } from './PostVentaMenuScreen';
import { CuotasScreen } from './CuotasScreen';
import { ProyeccionesScreen } from './ProyeccionesScreen';
import { RecordatoriosScreen } from './RecordatoriosScreen';

const Stack = createNativeStackNavigator();

export const PostVentaStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="PostVentaMenu" component={PostVentaMenuScreen} options={{ title: 'Post-Venta' }} />
    <Stack.Screen name="Cuotas" component={CuotasScreen} />
    <Stack.Screen name="Proyecciones" component={ProyeccionesScreen} />
    <Stack.Screen name="Recordatorios" component={RecordatoriosScreen} />
  </Stack.Navigator>
);