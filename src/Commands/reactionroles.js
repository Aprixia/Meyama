const cmds = require("../Structures/Commands");
module.exports = class ReactionRoles extends cmds {
    constructor() {
        super({
            name: "reactionroles",
            description: "Creates a reaction role!",
            usage: "reactionroles",
            aliases: ["rr", "reaction-roles"],
        });
    }

    async run(msg) {
        if (!msg.m.permissions.has("MANAGE_GUILD"))
            return msg.s("Woops, you need the Manage Server permission to do this!");
        if (!msg.g.me.permissions.has("MANAGE_MESSAGES") || !msg.g.me.permissions.has("ADD_REACTIONS"))
            return msg.s("To be able to do reaction roles, i need the following permissions: ``MANAGE_MESSAGES``, ``ADD_REACTIONS``");
        msg.s("Hiya! So, it's time to setup reaction roles? Yay! First off, I need a channel, to be able to read the message from it. Please give me a channel (example: #channel or channel ID) in the next 60 seconds.");
        const c0 = msg.c.createMessageCollector((m) => {
            return m.author.id === msg.author.id;
        }, { time: 60000 }
        )
            .on("collect", (m0) => {
                let channel;
                if (m0.mentions.channels.first()) channel = m0.mentions.channels.first().id //channel mention
                if (msg.g.channels.cache.get(m0.content)) channel = m0.content //channel id
                if (!channel) return msg.s("Oh no, I could not find any channel :(")
                m0.delete();
                this.c1(msg, channel);
                c0.stop();
            })
            .on("end", (m0) => {
                if (m0.size === 0)
                    return msg.s(
                        "Looks like nothing has been sent in 60 secs, cancelling..."
                    );
            });
    }

    async c1(msg, channelid) {
        msg.s("Alright, I found it! Now, you have to give me a message ID in the next 60 seconds so I'll be able to listen to reactions on it!\n\nHow to grab an ID: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-");
        const c1 = msg.c.createMessageCollector(
            (m) => {
                return m.author.id === msg.author.id;
            },
            { time: 60000 }
        )
            .on("collect", async (m1) => {
                let collectedmessage = await msg.guild.channels.cache.get(channelid).messages.fetch(m1.content)
                if (!collectedmessage)
                    return msg.s("I am unable to get this message, sorry...");
                m1.delete();
                this.c2(msg, collectedmessage);
                c1.stop();
            })
            .on("end", (m) => {
                if (m.size === 0)
                    return msg.s(
                        "Looks like nothing has been sent in 60 secs, cancelling..."
                    );
            });
    }
    async c2(msg, collectedmessage) {
        msg.s("Found the message!!! Alright, so it's now time for the main part of the setup: the reaction roles. Please respect this format for me to be able to do my work: ```\n:emoji: @role\n:emoji: @role\n:emoji: @role...```If nothing has been sent in the next two moinutes, I will cancel the process.");
        const c2 = msg.c.createMessageCollector(
            (m) => {
                return m.author.id === msg.author.id;
            },
            { time: 120000 }
        )
            .on("collect", (m2) => {
                function rr(message) {
                    let emoji = require("discord.js").Util.parseEmoji(message[0]);
                    if (!emoji)
                        return msg.s("Woops, it looks like that I am unable to access the following emoji: " + emoji.name);
                    let role;
                    if (m2.mentions.roles.first()) role = m2.mentions.roles.first().id
                    if (msg.g.roles.cache.get(m2.content)) role = m2.content
                    collectedmessage.react(emoji.id ? emoji.id : emoji.name);
                    msg.client.db.set(
                        `${msg.guild.id}.rr.${collectedmessage.id}.${emoji.id ? emoji.id : emoji.name
                        }`, role
                    );
                }
                m2.content.split("\n").forEach(line => { rr(line.split(" ")) })
                m2.delete();
                msg.s(
                    "The reaction role for this message has been succesfully setup!"
                );
                c2.stop();
            })
            .on("end", (m) => {
                if (m.size === 0)
                    return msg.s(
                        "Looks like nothing has been sent in 60 secs, cancelling..."
                    );
            });
    }
};
