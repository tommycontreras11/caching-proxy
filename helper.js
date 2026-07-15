const inputRules = new Map([
  [
    "--port",
    {
      type: "number",
      isRequired: true,
      nonNegativeValue: true,
    },
  ],
  [
    "--origin",
    {
      type: "string",
      isRequired: true,
    },
  ],
]);

const getInputById = (id) => inputRules.get(id);

const isAProperty = (property) => property?.startsWith("--");

const inputValidation = (id, value) => {
  const input = getInputById(id);

  if (!input) {
    console.error(
      `The id ${id} is not a valid property, the properties valid are ${[...inputRules.keys()].join(", ")}.`,
    );
    return true;
  }

  if (input.isRequired && (!value || isAProperty(value))) {
    console.error(`The id ${id} must have a value.`);
    return true;
  }

  if (input.type == "number") {
    const inputValue = Number(value);
    if (input.nonNegativeValue && inputValue < 0) {
      console.error(`The id ${id} must be a positive number.`);
      return true;
    }
  }

  return false;
};

export const inputValidations = (arg) => {
  const properties = arg?.filter((arg) => arg.startsWith("--"));
  const hasAllRequiredProperties = inputRules?.size == properties.length;

  if (!arg.length || !hasAllRequiredProperties) {
    console.error(
      "Please you must specify all the properties and values.",
    );
    return false;
  }

  let hasError = false;

  for (let i = 0; i < properties.length; i++) {
    hasError = inputValidation(
      i == 0 ? arg[i] : arg[i + 1],
      i == 0 ? arg[i + 1] : arg[i + 2],
    );
    if (hasError) break;
  }

  return hasError;
};
