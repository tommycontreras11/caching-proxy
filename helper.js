import express from "express";

const app = express();
let siteOrigin = "";
let cached = new Map([]);

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

export const removeAllCache = () => cached.clear();

export const getPropertyAndValue = (arg, property) => {
  const inputIndex = arg?.findIndex((a) => a == property);

  return {
    id: arg[inputIndex],
    value: isAProperty(arg[inputIndex + 1]) ? null : arg[inputIndex + 1],
  };
};

export const hasAllRequiredProperties = (arg) => {
  let propertiesTotal = 0
  let propertyMissing = ""

  for(const input of arg) {
    if(inputRules.has(input?.id)) {
      propertiesTotal += 1
    }
  }

  if(propertiesTotal != inputRules.size) {
    console.error("Please you must specify all the properties and values.");
    return false;
  }

  return true
};

const isResourceCached = (url, id) => {
  const resource = cached.get(url);

  if (!resource || !resource.some((r) => r.id == id)) return false;

  return true;
};

const saveToCache = (url, resource, data) => {
  const cache = cached.get(url);

  if (cache) {
    cache.push({
      id: resource,
      data,
    });
  } else {
    cached.set(url, [
      {
        id: resource,
        data,
      },
    ]);
  }
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
    hasError = inputValidation(
      arg[i].id,
      arg[i].value
    );
    if (hasError) return true
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

    let data = "";
    let isCached = false;

    if (!isResourceCached(siteOrigin, origin)) {
      const response = await fetch(`${siteOrigin}/${origin}`);
      data = await response.json();
      if (!data) return;

      saveToCache(siteOrigin, origin, data);
    } else {
      const resource = cached.get(siteOrigin);

      data = resource.find((r) => r.id == origin).data;
      isCached = true;
    }

    res.setHeader("X-Cache", isCached ? "HIT" : "MISS");

    return res.status(200).json({ data });
  } catch (error) {
    return res.status(404).json({
      error: { message: "Sorry the requested resource was not found." },
    });
  }
});
