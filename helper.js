import express from "express";

const app = express();
let siteOrigin = "";

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
      isNotANumber: true,
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

  if (input.type == "string") {
    if (input.isNotANumber && !isNaN(value)) {
      console.error(`The id ${id} must be a string.`);
      return true;
    }
  }

  return false;
};

export const inputValidations = (arg) => {
  const properties = arg?.filter((arg) => arg.startsWith("--"));
  const hasAllRequiredProperties = inputRules?.size == properties.length;

  if (!arg.length || !hasAllRequiredProperties) {
    console.error("Please you must specify all the properties and values.");
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

export const initServer = (port, origin) => {
  siteOrigin = origin;
  app.listen(port, () =>
    console.log(`The server is listening on port ${port}`),
  );
};

app.get("/:origin", async (req, res) => {
  try {
    if (!siteOrigin)
      return res
        .status(404)
        .json({ error: { message: "No site origin defined." } });

    const { origin } = req.params;

    const response = await fetch(`${siteOrigin}/${origin}`);
    const data = await response.json();

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(404).json({ error: { message: "Sorry the requested resource was not found." } })
  }
});
