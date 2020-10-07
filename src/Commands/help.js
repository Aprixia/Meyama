module.exports = class Help extends (require('../Structures/Commands')) {
    constructor() {
        super({
            name: "help",
            description: "Evals some code!",
            usage: "eval <code>",
            owner: true,
            aliases: ["e"]
        })
    }

    async run(msg) {
        let emb = new (require('../Utils/Embeds'))()
        emb.author("Role Manager", msg.client.user.avatarURL())
            .title("Help Command")
        msg.send(emb)
    }
}