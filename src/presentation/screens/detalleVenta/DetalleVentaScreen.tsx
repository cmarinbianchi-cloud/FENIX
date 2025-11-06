import React, { useLayoutEffect } from 'react';
import { ScrollView, View, StyleSheet, Linking } from 'react-native';
import { Appbar, Text, List, Button, TextInput, FAB, Snackbar } from 'react-native-paper';
import { useDetalleVenta } from './useDetalleVenta';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export const DetalleVentaScreen = ({ navigation, route }) => {
  const ventaId = route.params.id;
  const { detalle, obs, notifs, cargando, hayCambios, addObs, addNotif } = useDetalleVenta(ventaId);
  const [obsText, setObsText] = React.useState('');
  const [notifDate, setNotifDate] = React.useState('');
  const [notifText, setNotifText] = React.useState('');
  const [snack, setSnack] = React.useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `Venta #${ventaId}`,
      headerLeft: () => (
        <Appbar.BackAction
          onPress={() => {
            if (hayCambios) setSnack(true);
            else navigation.goBack();
          }}
        />
      ),
    });
  }, [navigation, hayCambios]);

  const llamar = () => detalle?.telefonoCliente && Linking.openURL(`tel:${detalle.telefonoCliente}`);
  const whatsapp = () => detalle?.telefonoCliente && Linking.openURL(`https://wa.me/56${detalle.telefonoCliente}`);
  const mail = () => detalle?.emailCliente && Linking.openURL(`mailto:${detalle.emailCliente}`);

  const guardarObs = () => {
    if (!obsText.trim()) return;
    addObs(obsText.trim());
    setObsText('');
  };

  const guardarNotif = () => {
    if (!notifDate || !notifText.trim()) return;
    addNotif(notifDate, notifText.trim().slice(0, 15));
    setNotifText('');
  };

  if (cargando) return <Text>Cargando...</Text>;

  return (
    <>
      <ScrollView>
        {/* Cabecera */}
        <List.Section title="Datos generales">
          <List.Item title="Fecha" description={detalle?.fechaVenta} />
          <List.Item title="Cliente" description={`${detalle?.cliente} (${detalle?.rutCliente})`} />
          {detalle?.telefonoCliente && (
            <List.Item
              title="Teléfono"
              description={detalle.telefonoCliente}
              left={props => <List.Icon {...props} icon="phone" />}
              onPress={llamar}
            />
          )}
          {detalle?.emailCliente && (
            <List.Item
              title="Email"
              description={detalle.emailCliente}
              left={props => <List.Icon {...props} icon="email" />}
              onPress={mail}
            />
          )}
          <List.Item title="Funeraria" description={detalle?.funeraria} />
          <List.Item title="Tipo" description={detalle?.tipo} />
          <List.Item title="Unidad" description={detalle?.unidadNegocio} />
          <List.Item title="Valor" description={`$${detalle?.valorVenta.toLocaleString('es-CL')}`} />
        </List.Section>

        {/* Sepultura */}
        {detalle?.tipo === 'Sepultura' && (
          <List.Section title="Sepultura">
            <List.Item title="Pago inicial" description={`$${detalle.pagoInicial}`} />
            <List.Item title="Primera cuota" description={detalle.fechaPrimeraCuota} />
            <List.Item title="8 % se alcanza" description={detalle.fecha8PorCiento || 'Ya cumplido'} />
            <List.Item title="Medio pago" description={detalle.medioPago} />
            <List.Item title="Comisión base" description={`$${detalle.comisionBaseMonto} ( ${detalle.comisionBaseFecha} )`} />
            <List.Item title="Ingreso caja" description={`$${detalle.ingresoCajaMonto} ( ${detalle.ingresoCajaFecha} )`} />
            <List.Item title="Premio producción" description={`$${detalle.premioProdMonto} ( ${detalle.premioProdFecha} )`} />
          </List.Section>
        )}

        {/* Cinerario */}
        {detalle?.tipo === 'Cinerario' && (
          <List.Section title="Cinerario">
            <List.Item title="Valor venta" description={`$${detalle.valorVentaCinerario}`} />
            <List.Item title="Comisión" description={`$${detalle.comisionCinerarioMonto} ( ${detalle.comisionCinerarioFecha} )`} />
          </List.Section>
        )}

        {/* Servicios */}
        {detalle?.tipo === 'Servicio Adicional' && (
          <List.Section title="Servicios adicionales">
            {detalle.servicios?.map(s => (
              <List.Item key={s.nombre} title={s.nombre} description={`Comisión fija $${s.comision}`} />
            ))}
            <List.Item title="Total comisiones servicios" description={`$${detalle.comisionServiciosTotal} ( ${detalle.comisionServiciosFecha} )`} />
          </List.Section>
        )}

        {/* Observaciones */}
        <List.Section title="Observaciones">
          {obs.map(o => (
            <List.Item key={o.id} title={o.texto} description={format(new Date(o.creadoEn!), 'PPp', { locale: es })} />
          ))}
          <TextInput
            label="Nueva observación"
            value={obsText}
            onChangeText={setObsText}
            right={<TextInput.Icon icon="send" onPress={guardarObs} />}
          />
        </List.Section>

        {/* Notificaciones */}
        <List.Section title="Notificaciones custom">
          {notifs.map(n => (
            <List.Item
              key={n.id}
              title={n.texto}
              description={format(new Date(n.fecha), 'PPP', { locale: es })}
              left={props => <List.Icon {...props} icon="bell" />}
            />
          ))}
          <TextInput
            label="Fecha"
            value={notifDate}
            onChangeText={setNotifDate}
            placeholder="AAAA-MM-DD"
          />
          <TextInput
            label="Texto (máx 15)"
            value={notifText}
            onChangeText={t => setNotifText(t.slice(0, 15))}
            right={<TextInput.Icon icon="send" onPress={guardarNotif} />}
          />
        </List.Section>
      </ScrollView>

      {/* Botones rápidos */}
      <FAB.Group
        open={false}
        icon="phone"
        actions={[
          { icon: 'whatsapp', label: 'WhatsApp', onPress: whatsapp },
          { icon: 'email', label: 'Email', onPress: mail },
        ]}
        onStateChange={() => {}}
      />

      <Snackbar visible={snack} onDismiss={() => setSnack(false)} duration={3000} action={{ label: 'Salir', onPress: () => navigation.goBack() }}>
        Hay cambios sin guardar
      </Snackbar>
    </>
  );
};

const styles = StyleSheet.create({ container: { padding: 16 } });
