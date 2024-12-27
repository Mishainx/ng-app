import winston from 'winston';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const { combine, timestamp, colorize, printf } = winston.format;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Función para crear un transportador con una ruta y formato específicos
function createFileTransport(filename, format) {
  return new winston.transports.File({
    filename: `${__dirname}/../../logs/${filename}`,
    format: format,
  });
}

// Transportadores para diferentes tipos de logs
const signinLog = createFileTransport('signin/signin.log', combine(timestamp(), winston.format.json()));
const generalLog = createFileTransport('general/general.log', combine(timestamp(), winston.format.json()));
const failedSignInLog = createFileTransport('signin/signin.log', combine(timestamp(), winston.format.json()));
const productLog = createFileTransport('products/products.log', combine(timestamp(), winston.format.json()));

// Logger para inicio de sesión
const signinLogger = winston.createLogger({
  level: 'info',  // Nivel de log para inicios de sesión
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    signinLog,  // Log de inicio de sesión (exitoso o fallido)
    failedSignInLog,  // Log de intentos fallidos
  ],
});

// Logger para acciones generales
const generalLogger = winston.createLogger({
  level: 'info',  // Nivel de log para acciones generales
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    generalLog,  // Log general
  ],
});

// Logger para productos
const productLogger = winston.createLogger({
  level: 'info',  // Nivel de log para productos
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    productLog,  // Log de productos
  ],
});

// Logger para consola (con color)
const consoleLogger = winston.createLogger({
  level: 'info',  // Nivel de log para la consola
  format: combine(
    colorize(),  // Agrega colores a los logs en consola
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console(),  // Log en consola con colores
  ],
});

// Función para registrar un inicio de sesión exitoso
export function logSuccessfulLogin(user, ip) {
  signinLogger.info({
    message: 'Inicio de sesión exitoso',
    user: user,
    ip: ip
  });
}

// Función para registrar un inicio de sesión fallido
export function logFailedLogin(user, ip) {
  signinLogger.warn({
    message: 'Inicio de sesión fallido',
    user: user,
    ip: ip
  });
}

// Función para registrar acciones generales (puede ser utilizada para otros eventos)
export function logGeneralAction(action, details) {
  generalLogger.info({
    message: action,
    details: details
  });
}

// Función para registrar acciones relacionadas con productos
export function logProductAction(action,user, productId, details) {
  productLogger.info({
    message: action,
    user: user,
    productId: productId,
    details: details
  });
}

// Exportar el logger de consola para usar en terminal, si es necesario
export { consoleLogger };
