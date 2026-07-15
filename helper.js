const inputRules = new Map([
  [
    "--port",
    {
      type: "number",
      isRequired: true,
      nonNegativeValue: true
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

const inputValidation = (input, value) => {
    console.log(`input: ${input}, value: ${value}`)
}

export const inputValidations = (arg) => {
    if(arg.length != 4) {
        console.log("Please you must specify all the properties and values, for example: --port 3000 --origin http://dummyjson.com")
        return false
    }

    const propertiesCount = arg.length / 2
    for(let i = 0; i < propertiesCount; i++) {
        inputValidation((i == 0 ? arg[i] : arg[i + 1]), (i == 0 ? arg[i+1] : arg[i + 2]))
    }
}