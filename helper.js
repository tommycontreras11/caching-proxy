import express from "express";

const app = express();
let originUrl = "";
let cache = new Map();

const inputRules = new Map([
  [
    "--port",
    {
      type: "number",
      nonNegativeValue: true,
    },
  ],
  [
    "--origin",
    {
      type: "string",
      isNotANumber: true,
    },
  ],
]);

const getInputById = (id) => inputRules.get(id);

const isAProperty = (property) => property?.startsWith("--");

export const removeAllCache = () => cache.clear();

export const getPropertyAndValue = (arg, property) => {
  const inputIndex = arg?.findIndex((a) => a == property);

  return {
    id: arg[inputIndex] ?? null,
    value: isAProperty(arg[inputIndex + 1]) ? null : arg[inputIndex + 1],
  };
};

export const hasAllRequiredProperties = (arg) => {
  let propertiesTotal = 0;
  let propertyMissing = "";

  for (const input of arg) {
    if (inputRules.has(input?.id)) {
      propertiesTotal += 1;
    }
  }

  if (propertiesTotal != inputRules.size) {
    console.error("Please you must specify all the properties and values.");
    return false;
  }

  return true;
};

const inputValidation = (id, value) => {
  const input = getInputById(id);

  if (!input) {
    console.error(
      `The id ${id} is not a valid property, the properties valid are ${[...inputRules.keys()].join(", ")}.`,
    );
    return true;
  }

  if (!value) {
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
  let hasError = false;

  for (let i = 0; i < arg.length; i++) {
    hasError = inputValidation(arg[i].id, arg[i].value);
    if (hasError) return true;
  }

  return hasError;
};

export const initServer = (port, origin) => {
  originUrl = origin;
  app.listen(port, () =>
    console.log(`The server is listening on port ${port}`),
  );
};

app.use(async (req, res) => {
  try {
    if (!originUrl)
      return res
        .status(404)
        .json({ error: { message: "No original url defined." } });

    let data = "";

    const url = `${originUrl}${req.originalUrl}`;
    let isCached = cache.has(url);

    if (!isCached) {
      const response = await fetch(url, {
        method: req.method
      });
      res.status(response.status);

      data = await response.json();
      cache.set(url, data);
    } else {
      data = cache.get(url);
      isCached = true;
    }

    res.setHeader("X-Cache", isCached ? "HIT" : "MISS");

    return res.json(data);
  } catch (error) {
    return res.status(500).json({
      error: { message: "Unable to fetch resource." },
    });
  }
});
