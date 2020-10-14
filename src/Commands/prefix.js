const cmds = require('../Structures/Commands')
module.exports = class Ping extends cmds {
    constructor() {
        super({
            name: "prefix",
            description: "Changes the prefix of Meyama! (requires Manage Server permissions)"
        })
    }

    async run(msg) {
        if (!msg.member.permissions.has("MANAGE_SERVER")) return msg.send("Woops, you need Manage Server permissions to change my pwefix...")
    }
}