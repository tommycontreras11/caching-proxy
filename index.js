import {
  getCommandAndArgsFromInput,
  getPropertyAndValue,
  hasAllRequiredProperties,
  inputValidations,
  initServer,
  removeAllCache,
} from "./helper.js";

process.stdin.on("data", (data) => {
  const input = getCommandAndArgsFromInput(data);

  switch (input.command) {
    case "caching-proxy":
      if (input.arg?.includes("--clear-cache")) {
        removeAllCache();
        return;
      }

      const port = getPropertyAndValue(input.arg, "--port");
      const origin = getPropertyAndValue(input.arg, "--origin");

      const isInputCompleted = hasAllRequiredProperties([port, origin]);
      if (!isInputCompleted) return;

      const hasError = inputValidations([port, origin]);
      if (hasError) return;

      initServer(port.value, origin.value);
      break;
    case "exit":
      process.exit();
    default:
      console.log("Command not valid.");
  }
});
