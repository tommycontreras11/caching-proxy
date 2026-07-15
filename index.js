import { getPropertyAndValue, hasAllRequiredProperties, inputValidations, initServer, removeAllCache } from "./helper.js"

process.stdin.on("data", (data) => {
    const input = data.toString().trim().split(" ")
    const command = input[0]

    const arg = input.slice(1)

    switch(command) {
        case "caching-proxy":
            const isArgumentToCleanCache = arg?.includes("--clear-cache")
            if(isArgumentToCleanCache) {
                removeAllCache()
                return
            }

            const port = getPropertyAndValue(arg, "--port")
            const origin = getPropertyAndValue(arg, "--origin")

            const isInputCompleted = hasAllRequiredProperties([port, origin])
            if(!isInputCompleted) return

            const hasError = inputValidations([port, origin])
            if(hasError) return 

            initServer(arg[1], arg[3])
            break
        case "exit":
            process.exit()
        default:
            console.log("Command not valid.")
    }
})