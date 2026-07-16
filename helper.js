import express from "express";

const app = express();

let originUrl = "";
const cache = new Map();

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

export const getCommandAndArgsFromInput = (data) => {
  const input = data.toString().trim().split(" ");
  const command = input[0];

  return {
    command,
    arg: input.slice(1),
  };
};

export const getPropertyAndValue = (arg, property) => {
  const inputIndex = arg?.findIndex((a) => a == property);

  return {
    id: arg[inputIndex] ?? null,
    value: isAProperty(arg[inputIndex + 1]) ? null : arg[inputIndex + 1],
  };
};

export const hasAllRequiredProperties = (arg) => {
  let propertiesTotal = 0;

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
    if (isNaN(inputValue)) {
      console.error(`The id ${id} must be a number.`);
      return true;
    }

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

const fetchFromOrigin = async (url, method) => {
  const response = await fetch(url, {
    method,
  });

  return {
    data: await response.json(),
    status: response.status,
  };
};

const getFromCache = (url) => {
  return cache.get(url);
};

const saveToCache = (url, data) => {
  cache.set(url, {
    data: data.data,
    status: data.status,
  });
};

app.use(async (req, res) => {
  try {
    const url = `${originUrl}${req.originalUrl}`;
    const cached = getFromCache(url);

    res.setHeader("X-Cache", cached ? "HIT" : "MISS");

    if (!cached) {
      const response = await fetchFromOrigin(url, req.method);
      saveToCache(url, response);
      return res.status(response.status).json(response.data);
    }

    const dataFromCache = getFromCache(url);

    return res.status(dataFromCache.status).json(dataFromCache.data);
  } catch (error) {
    return res.status(500).json({
      error: { message: "Unable to fetch resource." },
    });
  }
});
