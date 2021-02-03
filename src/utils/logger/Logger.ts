import winston from "winston";

const logger = winston.createLogger({
  format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
  transports: [
    new winston.transports.File({
      filename: "./logs/combined.log",
      level: "verbose",
    }),
    new winston.transports.File({
      level: "error",
      filename: "./logs/error.log",
    }),
  ],
});

if (process.env.NODE_ENV !== "production") {
  const consoleLogFormat = winston.format.printf((info) => {
    return `${new Date().toISOString()} [${info.level}] ${info.message}`;
  });

  logger.add(
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize(), consoleLogFormat),
    })
  );
}

export default logger;
