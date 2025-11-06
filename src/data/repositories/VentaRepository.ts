import { VentaFormValues } from '../../presentation/forms/ventaSchema';
import { ClienteRepository } from './ClienteRepository';
import { FallecidoRepository } from './FallecidoRepository';
import { MesComercialRepository } from './MesComercialRepository';

export class VentaRepository {
  constructor(private db: SQLite.SQLiteDatabase) {}

  async crearVentaCompleta(data: VentaFormValues): Promise<number> {
    return this.db.transaction(async tx => {
      // 1. Cliente
      const clienteRepo = new ClienteRepository(this.db);
      let clienteId = (await clienteRepo.getByRut(data.rutCliente))?.id;
      if (!clienteId) {
        const res = await tx.executeSql(
          `INSERT INTO CLIENTES(rut,nombre,fecha_nacimiento,telefono,email)
           VALUES (?,?,?,?,?)`,
          [data.rutCliente, data.nombreCliente, data.fechaNacCliente, data.telefonoCliente, data.emailCliente]
        );
        clienteId = res.insertId;
      }

      // 2. Fallecido
      let fallecidoId: number | null = null;
      if (!data.esVt) {
        const fallRepo = new FallecidoRepository(this.db);
        const res = await tx.executeSql(
          `INSERT INTO FALLECIDOS(rut,nombre,fecha_nacimiento,fecha_defuncion,es_vt)
           VALUES (?,?,?,?,0)`,
          [data.rutFallecido, data.nombreFallecido, data.fechaNacFallecido, data.fechaDefuncion]
        );
        fallecidoId = res.insertId;
      }

      // 3. Mes comercial
      const mesRepo = new MesComercialRepository(this.db);
      const mesActual = await mesRepo.getCurrent();
      if (!mesActual) throw new Error('No hay mes comercial abierto');

      // 4. Venta padre
      const resV = await tx.executeSql(
        `INSERT INTO VENTAS(fecha,tipo,unidad_negocio,cliente_id,fallecido_id,funeraria_id,mes_comercial_id)
         VALUES (?,?,?,?,?,?,?)`,
        [data.fechaVenta, data.tipo, data.unidadNegocio, clienteId, fallecidoId, data.funerariaId, mesActual.id!]
      );
      const ventaId = resV.insertId;

      // 5. Tabla hija
      if (data.tipo === 'Sepultura') {
        await tx.executeSql(
          `INSERT INTO VENTA_SEPULTURAS(venta_id,valor_total,pago_inicial,num_cuotas,valor_cuota,fecha_primera_cuota,medio_pago)
           VALUES (?,?,?,?,?,?,?)`,
          [ventaId, data.valorTotal, data.pagoInicial, data.numCuotas, data.valorCuota, data.fechaPrimeraCuota, data.medioPago]
        );
      } else if (data.tipo === 'Cinerario') {
        await tx.executeSql(
          `INSERT INTO VENTA_CINERARIOS(venta_id,valor_venta) VALUES (?,?)`,
          [ventaId, data.valorVentaCinerario]
        );
      } else if (data.tipo === 'Servicio Adicional') {
        for (const sid of data.serviciosIds) {
          await tx.executeSql(`INSERT INTO VENTA_SERVICIOS(venta_id,servicio_id) VALUES (?,?)`, [ventaId, sid]);
        }
      }
      return ventaId;
    });
  }
}