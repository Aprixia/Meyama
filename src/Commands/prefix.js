const cmds = require('../Structures/Commands')
module.exports = class Prefix extends cmds {
    constructor() {
        super({
            name: "prefix",
            description: "Changes the prefix of Meyama! (requires Manage Server permissions)"
        })
    }

    async run(msg, args) {
        if (!msg.member.permissions.has("MANAGE_SERVER")) return msg.s("Woops, you need Manage Server permissions to change my pwefix...")
        if (!args.join(' ')) return msg.s("Oh no, you didnt provided a new prefix for me! ~~Am I a good bot?~~")
        msg.client.db.set(`${msg.g.id}.config.prefix`, args.join(' '))
        msg.s(`Looks like my prefix was succesfully changed to\n> ${args.join(' ')}\nnow!`)
    }
}