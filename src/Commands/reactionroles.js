const cmds = require("../Structures/Commands");
module.exports = class ReactionRoles extends cmds {
	constructor() {
		super({
			name: "reationroles",
			description: "Creates a reaction role!",
			usage: "reactionroles",
			aliases: ["rr", "reaction-roles"],
		});
	}

	async run(msg) {
		if (!msg.m.permissions.has("MANAGE_GUILD"))
			return msg.s("Woops, you need the Manage Server permission to do this!");
		if (
			!msg.g.me.permissions.has("MANAGE_MESSAGES") ||
			!msg.g.me.permissions.has("ADD_REACTIONS")
		)
			return msg.s(
				"To be able to do reaction roles, i need the following permissions: ``MANAGE_MESSAGES``, ``ADD_REACTIONS``"
			);
		if (!msg.g.me.permissions.has("ADMINISTRATOR")) {
			msg.c
				.send(
					"**IMPORTANT:**To be sure that reaction roles works fine, please make sure that I have the highest role on this server, else I will not be able to give roles to members that have a role higher than me!"
				)
				.then((msh) => msh.delete({ timeout: 20000 }));
		}
		msg.s(
			"Hai! So, you wanna setup a reaction role with me? Nice! First of all, I need a channel so i'll be able to fetch a messge from it. **Please provide a channel ID in the next minute**"
		);
		let c0 = msg.c.createMessageCollector(
			(m) => {
				return m.author.id === msg.author.id;
			},
			{ time: 60000 }
		);
		c0.on("collect", (m0) => {
			if (!msg.guild.channels.cache.get(m0.content))
				return msg.s(
					"Woopsie doopsie, I can not find this channel! Cancelling..."
				);
			m0.delete();
			this.c1(msg, m0.content);
			c0.stop();
		});
		c0.on("end", (m0) => {
			if (m0.size === 0)
				return msg.s(
					"Looks like nothing has been sent in 60 secs, cancelling..."
				);
		});
	}

	async c1(msg, c) {
		msg.s(
			"Okay, found it! Now, you have to give me a message ID in the next 60 seconds so i'll be able to listen to reactions on it!\n\nHow to grab an ID: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
		);
		let c1 = msg.c.createMessageCollector(
			(m) => {
				return m.author.id === msg.author.id;
			},
			{ time: 60000 }
		);
		c1.on("collect", async (m1) => {
			let collectedmessage;
			collectedmessage =
				(await msg.guild.channels.cache.get(c).messages.fetch(m1.content)) ||
				(await msg.guild.channels.cache.get(c).messages.cache.get(m1.content));
			if (!collectedmessage)
				return msg.s("I am unable to get this message, sorry...");
			m1.delete();
			this.c2(msg, collectedmessage);
			c1.stop();
		});
		c1.on("end", (m) => {
			if (m.size === 0)
				return msg.s(
					"Looks like nothing has been sent in 60 secs, cancelling..."
				);
		});
	}
	async c2(msg, collectedmessage) {
		msg.s(
			"Perfect, i found the message! Now, you have to tell me the emoji you want and the role you want me to assign to members when they click the emoji, in this order: ``:emoji: @role`` or ``:emoji: roleid`` in the next 60 seconds. If you wanna add multiple reactions to this message, you will have to re run this command."
		);
		let c2 = msg.c.createMessageCollector(
			(m) => {
				return m.author.id === msg.author.id;
			},
			{ time: 60000 }
		);
		c2.on("collect", (m2) => {
			if (m2.content.split(" ").length !== 2)
				return msg.s("Make sure you used the right format! Cancelling...");
			try {
				let emoji = require("discord.js").Util.parseEmoji(
					m2.content.split(" ")[0]
				);
				if (!emoji.id) msg.client.emojis.cache.get(emoji.id);
			} catch {
				msg.s(
					"Woopsie doopsie, it looks like that im unable to access this emoji! Please try with another, or put me in the server this emoji is from! Cancelling..."
				);
				return;
			}
			let r;
			try {
				if (m2.mentions.roles.first()) {
					r = m2.mentions.roles.first().id;
				} else {
					r = m2.content.split(" ")[1];
				}
				if (!m2.g.roles.cache.get(r)) throw Error("1");
			} catch {
				msg.s("Woops, this role seems to be invalid! Canelling...");
				return;
			}
			let emoji = require("discord.js").Util.parseEmoji(
				m2.content.split(" ")[0]
			);
			collectedmessage.react(emoji.id ? emoji.id : emoji.name);
			msg.client.db.set(
				`${msg.guild.id}.rr.${collectedmessage.id}.${
					emoji.id ? emoji.id : emoji.name
				}`,
				r
			);
			m2.delete();
			msg.s("The reaction role for this message has been succesfully setup!");
			c2.stop();
		});
		c2.on("end", (m) => {
			if (m.size === 0)
				return msg.s(
					"Looks like nothing has been sent in 60 secs, cancelling..."
				);
		});
	}
};
