const cmds = require('../Structures/Commands')
module.exports = class Setup extends cmds {
    constructor() {
        super({
            name: "setup",
            description: "Setups the bot, has to be used at least once the first time it's been added to a server"
        })
    }
    async run(msg) {
        msg.s("Hiya! Thanks for spending some time for my setup! First thing first, what prefix do you want me to have? **Answer with the prefix u want me to have in the next 30 secs**")
        let c1 = msg.c.createMessageCollector((m) => { m.author.id === msg.author.id }, { time: 30000 })
        c1.on("collect", m => {
            msg.client.db.set(`${msg.g.id}.config.prefix`, m.content)
            msg.s(`My prefix has been succesfully set to\n> ${m.content}`)
        })
        c1.on("end", () => {
            msg.s("Woops, looks like nothing has been sent in 30 secs, cancelling...")
            return;
        })
        msg.client.db.set(`${msg.g.id}.setupComplete`, true)
    }
}