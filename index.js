process.stdin.on("data", (data) => {
    const input = data.toString().trim().split(" ")
    const command = input[0]

    const arg = input.slice(1)

    switch(command) {
        case "caching-proxy":
            console.log("Caching proxy: ")
            break
        case "exit":
            process.exit()
        default:
            console.log("Command not valid.")
    }
})