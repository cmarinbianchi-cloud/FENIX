import { VentaFormValuesEdit } from '../../presentation/forms/ventaSchema';
import { VentaDetalleRepository } from './VentaDetalleRepository';

export class VentaEditRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async actualizarVentaCompleta(data: VentaFormValuesEdit): Promise<void> {
    return this.db.transaction(async tx => {
      const id = data.ventaId;

      // 1. Cliente
      await tx.executeSql(
        `UPDATE CLIENTES
         SET nombre = ?, fecha_nacimiento = ?, telefono = ?, email = ?
         WHERE rut = ?`,
        [data.nombreCliente, data.fechaNacCliente, data.telefonoCliente, data.emailCliente, data.rutCliente]
      );

      // 2. Fallecido (si existe)
      if (!data.esVt) {
        const [[fall]] = await tx.executeSql(`SELECT id FROM FALLECIDOS WHERE rut = ?`, [data.rutFallecido]);
        if (fall) {
          await tx.executeSql(
            `UPDATE FALLECIDOS
             SET nombre = ?, fecha_nacimiento = ?, fecha_defuncion = ?
             WHERE id = ?`,
            [data.nombreFallecido, data.fechaNacFallecido, data.fechaDefuncion, fall.id]
          );
        }
      }

      // 3. Venta padre (solo datos que pueden cambiar)
      await tx.executeSql(
        `UPDATE VENTAS
         SET fecha = ?, unidad_negocio = ?, funeraria_id = ?
         WHERE id = ?`,
        [data.fechaVenta, data.unidadNegocio, data.funerariaId, id]
      );

      // 4. Tabla hija (borramos y re-insertamos por simplicidad)
      await tx.executeSql(`DELETE FROM VENTA_SEPULTURAS WHERE venta_id = ?`, [id]);
      await tx.executeSql(`DELETE FROM VENTA_CINERARIOS WHERE venta_id = ?`, [id]);
      await tx.executeSql(`DELETE FROM VENTA_SERVICIOS WHERE venta_id = ?`, [id]);

      if (data.tipo === 'Sepultura') {
        await tx.executeSql(
          `INSERT INTO VENTA_SEPULTURAS(venta_id,valor_total,pago_inicial,num_cuotas,valor_cuota,fecha_primera_cuota,medio_pago)
           VALUES (?,?,?,?,?,?,?)`,
          [id, data.valorTotal, data.pagoInicial, data.numCuotas, data.valorCuota, data.fechaPrimeraCuota, data.medioPago]
        );
      } else if (data.tipo === 'Cinerario') {
        await tx.executeSql(
          `INSERT INTO VENTA_CINERARIOS(venta_id,valor_venta) VALUES (?,?)`,
          [id, data.valorVentaCinerario]
        );
      } else if (data.tipo === 'Servicio Adicional') {
        for (const sid of data.serviciosIds) {
          await tx.executeSql(`INSERT INTO VENTA_SERVICIOS(venta_id,servicio_id) VALUES (?,?)`, [id, sid]);
        }
      }
    });
  }
}
