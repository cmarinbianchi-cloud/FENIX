import * as yup from 'yup';

const RUT_CHILENO = /^[0-9]{1,8}-[0-9kK]$/;

export const ventaSchema = yup.object({
  // CLIENTE
  rutCliente: yup.string().matches(RUT_CHILENO, 'RUT inválido').required(),
  nombreCliente: yup.string().max(100).required(),
  fechaNacCliente: yup.date().max(new Date(), 'Fecha futura').required(),
  telefonoCliente: yup.string().max(50),
  emailCliente: yup.string().email(),

  // FALLECIDO
  esVt: yup.boolean().default(false),
  rutFallecido: yup.string().when('esVt', { is: false, then: s => s.matches(RUT_CHILENO).required() }),
  nombreFallecido: yup.string().when('esVt', { is: false, then: s => s.max(100).required() }),
  fechaNacFallecido: yup.date().when('esVt', { is: false, then: s => s.max(new Date()).required() }),
  fechaDefuncion: yup.date().when('esVt', { is: false, then: s => s.max(new Date()).required() }),

  // VENTA GENERAL
  fechaVenta: yup.date().max(new Date()).required(),
  tipo: yup.string().oneOf(['Sepultura', 'Cinerario', 'Servicio Adicional']).required(),
  unidadNegocio: yup.string().oneOf(['PAV', 'PAV2', 'PCO', 'PPH']).required(),
  funerariaId: yup.number().positive().required(),

  // SEPULTURA
  valorTotal: yup.number().positive().when('tipo', { is: 'Sepultura', then: s => s.required() }),
  pagoInicial: yup.number().min(0).when('tipo', { is: 'Sepultura', then: s => s.required() }),
  numCuotas: yup.number().integer().min(0).max(120).when('tipo', { is: 'Sepultura', then: s => s.required() }),
  valorCuota: yup.number().positive().when('tipo', { is: 'Sepultura', then: s => s.required() }),
  fechaPrimeraCuota: yup.date().when('tipo', { is: 'Sepultura', then: s => s.required() }),
  medioPago: yup.string().oneOf(['PAC', 'PAT', 'Personal']).when('tipo', { is: 'Sepultura', then: s => s.required() }),

  // CINERARIO
  valorVentaCinerario: yup.number().positive().when('tipo', { is: 'Cinerario', then: s => s.required() }),

  // SERVICIOS
  serviciosIds: yup.array(yup.number()).when('tipo', { is: 'Servicio Adicional', then: s => s.min(1) }),
});