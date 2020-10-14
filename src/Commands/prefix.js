const cmds = require('../Structures/Commands')
module.exports = class Ping extends cmds {
    constructor() {
        super({
            name: "prefix",
            description: "Changes the prefix of Meyama! (requires Manage Server permissions)"
        })
    }

    async run(msg, args) {
        if (!msg.member.permissions.has("MANAGE_SERVER")) return msg.send("Woops, you need Manage Server permissions to change my pwefix...")
        if (!args.join(' ')) return msg.send("Oh no, you didnt provided a new prefix for me! ~~Am I a good bot?~~")
        msg.client.db.set(`prefix.${msg.g.id}`, args.join(' '))
        msg.send(`Looks like my prefix was succesfully changed to\n> ${args.join(' ')}\nnow!`)
    }
}