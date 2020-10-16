const cmds = require('../Structures/Commands')
module.exports = class Ping extends cmds {
    constructor() {
        super({
            name: "ping",
            description: "Shows a ping!"
        })
    }

    async run(msg) {
        msg.s(`${msg.client.ws.ping}ms!`)
    }
}