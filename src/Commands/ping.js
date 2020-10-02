module.exports = class Ping extends (require('../Structures/Commands')) {
    constructor() {
        super({
            name: "ping",
            description: "Shows a ping!"
        })
    }

    async run(msg) {
        msg.send(`${msg.client.ws.ping}ms!`)
    }
}