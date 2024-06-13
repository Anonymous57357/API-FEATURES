const dotenv = require("dotenv");
dotenv.config({ path: "./../config/config.env" });
const winston = require("winston");
const { json, errors, prettyPrint, timestamp, combine } = winston.format;

const token = process.env.LOGTAIL_TOKEN;
const { Logtail } = require("@logtail/node");
const { LogtailTransport } = require("@logtail/winston");

// Create a Logtail client
const logtail = new Logtail(token);

// Create a Winston logger - passing in the Logtail transport
// const logger = winston.createLogger({
//   transports: [new LogtailTransport(logtail)],
// });

winston.loggers.add("OrderLogger", {
  level: "debug",
  // formatting
  format: combine(errors({ stack: true }), timestamp(), prettyPrint(), json()),
  // transporting
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "../logs/Order.log" }),
    new LogtailTransport(logtail),
  ],
  defaultMeta: { service: "OrderService" },
});

winston.loggers.add("PaymentLogger", {
  level: "debug",
  // formatting
  format: json(),

  // transporting
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "../logs/payments.log" }),
    new LogtailTransport(logtail),
  ],
  defaultMeta: { servive: "PaymentService" },
});
