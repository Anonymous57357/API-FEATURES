// winston prodution level error logging (scalability)
require("./loggers");
const winston = require("winston");

const orderLogger = winston.loggers.get("OrderLogger");
const paymentLogger = winston.loggers.get("PaymentLogger");

let requestHandler = (path) => {
  const profiler = paymentLogger.startTimer();

  // request processing

  const ONE_BILLION = 1000000000;
  for (i = 0; i < ONE_BILLION; i++) {
    // do something
    j = i + 2;
  }

  profiler.done({ message: `Request to ${path} proceed` });
};

requestHandler("/payment");

orderLogger.info("An Order was placed");
