const cmds = require('../Structures/Commands')
module.exports = class Setup extends cmds {
    constructor() {
        super({
            name: "setup",
            description: "Redo the setup"
        })
    }
    async run(msg) {
        msg.s("Hiya! Thanks for spending some time for my setup! First thing first, what prefix do you want me to have? **Answer with the prefix u want me to have in the next 30 secs**")
        let c1 = msg.c.createMessageCollector((m) => { return m.author.id === msg.author.id }, { time: 30000 })
        c1.on("collect", async m => {
            msg.client.db.set(`${msg.g.id}.config.prefix`, m.content)
            m.delete()
            msg.channel.send(`My prefix has been succesfully set to\n> ${m.content}`).then(m => m.delete({ timeout: 5000 }))
            c1.stop()
        })
        c1.on("end", (c) => {
            if (c.size === 0) {
                msg.s("Woops, looks like nothing has been sent in 30 secs, cancelling...")
                return;
            } else {
                msg.s("Okay, now into the second step! Do you want me to restore roles to members if they leave the server and re join it? **Please answer with either yes or no int he next 30 secs**")
                let c2 = msg.c.createMessageCollector((m) => { return m.author.id === msg.author.id && m.content === "yes" || m.author.id === msg.author.id && m.content === "no" }, { time: 30000 })
                c2.on("collect", async m => {
                    if (m.content === "yes") {
                        msg.client.db.set(`${msg.g.id}.config.saveRoles`, true)
                        msg.channel.send("Oki doki, members roles **will** be restored if they leave and rejoin! But, i gotta warn you of one important thing:\n> Make sure my highest role is the highest role of this server, so i'll be able to restore **all** roles").then(m => m.delete({ timeout: 15000 }))
                    } else {
                        msg.client.db.set(`${msg.g.id}.config.saveRoles`, false)
                        msg.channel.send("Got it, I will **not** give member roles back if they leave and rejoin!").then(m => m.delete({ timeout: 5000 }))
                    }
                    m.delete()
                    msg.s("Congrats, you finished the setup! You're now able to use me!")
                    c2.stop()
                })
                c2.on("end", (c) => {
                    if (c.size === 0) return msg.s("Woops, looks like nothing has been sent in 30 secs, cancelling...");
                    return;
                })

            }
        })
        msg.client.db.set(`${msg.g.id}.setupComplete`, true)
    }
}