import winston from "winston";


const getContextFromLog = (info: winston.Logform.TransformableInfo) =>
  Object.entries(info)
    .filter(([ key, value ]) => !['label', 'timestamp', 'environment', 'vercel', 'level', 'message'].includes(key))
    .reduce((context, [key, value] ) => ({ ...context, [key]: value }), {})

export const logger = winston.createLogger({
  level: 'debug',
  // format: winston.format.combine(
  //   // winston.format.colorize({ all: false }),
  //   winston.format.label({ label: "[LOGGER]" }),
  //   winston.format.timestamp({ format: "MM-DD-YYYY HH:mm:SS.SSS" }),
  //   winston.format.printf(
  //     info => `${info.label} ${info.level} ${info.timestamp} : ${info.message} \n Context: ${JSON.stringify(getContextFromLog(info), null, 2)}`
  //   )
  // ),
  transports: [ new winston.transports.Console() ]
})