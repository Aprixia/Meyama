const cmds = require('../Structures/Commands')
module.exports = class ReactionRoles extends cmds {
    constructor() {
        super({
            name: "reationroles",
            description: "Creates a reaction role!",
            usage: "reactionroles",
            aliases: ["rr", "reaction-roles"]
        })
    }

    async run(msg) {
        if (!msg.m.permissions.has("MANAGE_GUILD")) return msg.s("Woops, you need the Manage Server permission to do this!")
        msg.s("Hai! So, you wanna setup a reaction role with me? Nice! First of all, I need a channel ID so i'll be able to fetch a messge from it. **Please provide one in the next minute**\n\nHow to grab a message ID: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-")
        let c0 = msg.c.createMessageCollector((m) => { return m.author.id === msg.author.id }, { time: 60000 })
        c0.on("collect", (m0) => {
            if (!msg.guild.channels.cache.get(m0.content)) return msg.s("Woopsie doopsie, I can not find this channel! Cancelling...")
            this.c1(msg, m0)
            c0.stop()
        })
        c0.on("end", (m0) => {
            if (m0.size === 0) return sg.s("Looks like nothing has been sent in 60 secs, cancelling...");
        })
    }

    async c1(msg, m0) {
        msg.s("Okay, found it! Now, you have to give me a message ID in the next 60 seconds so i'll be able to listen to reactions on it!")
        let c1 = msg.c.createMessageCollector((m) => { return m.author.id === msg.author.id }, { time: 60000 })
        c1.on("collect", async m1 => {
            let collectedmessage;
            collectedmessage = await msg.guild.channels.cache.get(m0.content).messages.fetch(m1.content) || await msg.guild.channels.cache.get(m0.content).messages.cache.get(m1.content)
            if (!collectedmessage) return msg.s("I am unable to get this message, sorry...")
            this.c2(msg, collectedmessage)
            c1.stop()
        })
        c1.on("end", m => {
            if (m.size === 0) return msg.s("Looks like nothing has been sent in 60 secs, cancelling...")
        })
    }
    async c2(msg, collectedmessage) {
        msg.s("Perfect, i found the message! Now, you have to tell me, in this order: ``:emoji: roleid`` in the next 60 seconds. If you wanna add multiple reactions to this message, you will have to re run this command.")
        let c2 = msg.c.createMessageCollector((m) => { return m.author.id === msg.author.id }, { time: 60000 })
        c2.on("collect", m => {
            if (m.content.split(" ").length !== 2) return msg.s("Make sure you used the right format! Cancelling...")
            try {
                let emoji = require('discord.js').Util.parseEmoji(m.content.split(" ")[0])
                if (!emoji.id) return;
                msg.client.emojis.cache.get(emoji.id)
            } catch {
                msg.s("Woopsie doopsie, it looks like that im unable to access this emoji! Please try with another, or put me in the server this emoji is from! Cancelling...")
                return;
            }
            try {
                m.g.roles.cache.get(m.content.split(" ")[1])
            } catch {
                msg.s("Woops, this role id seems to be invalid! Canelling...")
                return;
            }
            let emoji = require('discord.js').Util.parseEmoji(m.content.split(" ")[0])
            collectedmessage.react(emoji.id ? emoji.id : emoji.name)
            if (!msg.client.db.get(`${msg.guild.id}.rr.${collectedmessage.id}.${emoji.id ? emoji.id : emoji.name}`)) {
                msg.client.db.set(`${msg.guild.id}.rr.${collectedmessage.id}.${emoji.id ? emoji.id : emoji.name}`, [])
            }
            msg.client.db.set(`${msg.guild.id}.rr.${collectedmessage.id}.${emoji.id ? emoji.id : emoji.name}`, m.content.split(" ")[1])
            msg.s("The reaction role for this message has been succesfully setup!")
            c2.stop()
        })
        c2.on("end", m => {
            if (m.size === 0) return msg.s("Looks like nothing has been sent in 60 secs, cancelling...")
        })
    }
}