const cmds = require('../Structures/Commands')
module.exports = class Support extends cmds {
    constructor() {
        super({
            name: "suppport",
            description: "Sends a link to my support server!"
        })
    }

    async run(msg) {
        msg.s("https://discord.gg/xNKa5Mr")
    }
}