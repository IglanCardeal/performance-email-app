const winston = require("winston");
const fs = Promise.promisifyAll(require("fs"));

const { format, transports } = winston;

// Tratamento para gerar arquivos de logs de erros nao tratados.
exports.generateLogErrors = (error, filepath, status = 500) => {
  const logConfiguration = {
    format: format.combine(format.simple()),
    transports: [
      new transports.Console({
        format: format.combine(format.colorize({ all: true }), format.simple())
      }),
      new transports.Stream({
        stream: fs.createWriteStream(filepath, { flags: "a" })
      })
    ]
  };

  const logger = winston.createLogger(logConfiguration);

  logger.info(
    `\n================================= BEGIN =============================================`
  );
  logger.info(`Date: ${new Date().toISOString()}`);
  logger.error("Status: " + status, "\n");
  logger.error("Error: ", error, "\n");
  logger.info(
    `\n================================== END ==============================================\n`
  );
};
