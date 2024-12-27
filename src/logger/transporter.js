import winston from 'winston';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from 'util';

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
const failedSignInLog =  createFileTransport('signin/signin.log', combine(timestamp(), winston.format.json()));




const logger = winston.createLogger({
  level: 'info',
  format: combine(
    timestamp(),
    printf(({ level, message, timestamp }) => {
      return `${timestamp} ${level}: ${message}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      format: combine(
        colorize(),
        printf(({ level, message, timestamp }) => {
          return `${timestamp} ${level}: ${message}`;
        })
      )
    }),
    signinLog,
    failedSignInLog,
    generalLog
  ],
});

// Función para registrar un inicio de sesión exitoso (manteniendo el código anterior)
function logSuccessfulLogin(user, ip) {
  logger.info({
    message: 'Inicio de sesión exitoso',
    user: user,
    ip: ip
  });
}

function logFailedlLogin(user, ip) {
  logger.warn({
    message: 'Inicio de sesión fallido',
    user: user,
    ip: ip
  });
}



export default logger;
export { logSuccessfulLogin,logFailedlLogin };