const tag = "Accounting";
export const dev = {
  log: function (message: any, ...optionalParams: any[]) {
    if (optionalParams.length != 0) {
      console.log(
        "L(" + tag + ")\t" + new Date() + "\t" + message,
        optionalParams.join(" ")
      );
    } else {
      console.log("L(" + tag + ")\t" + new Date() + "\t" + message);
    }
  },
  info: function (message: any, ...optionalParams: any[]) {
    if (optionalParams.length != 0) {
      console.info(
        "I(" + tag + ")\t" + new Date() + "\t" + message,
        optionalParams.join(" ")
      );
    } else {
      console.info("I(" + tag + ")\t" + new Date() + "\t" + message);
    }
  },
  warn: function (message: any, ...optionalParams: any[]) {
    if (optionalParams.length != 0) {
      console.warn(
        "W(" + tag + ")\t" + new Date() + "\t" + message,
        optionalParams.join(" ")
      );
    } else {
      console.warn("W(" + tag + ")\t" + new Date() + "\t" + message);
    }
  },
  error: function (message: any, ...optionalParams: any[]) {
    if (optionalParams.length != 0) {
      console.error(
        "E(" + tag + ")\t" + new Date() + "\t" + message,
        optionalParams.join(" ")
      );
    } else {
      console.error("E(" + tag + ")\t" + new Date() + "\t" + message);
    }
  },
};
