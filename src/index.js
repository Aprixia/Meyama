const Discord = require("discord.js");
module.exports = class MeyamaClient extends Discord.Client {
	/**
	 * Constructs the client
	 * @param {String} token Your bot token
	 * @param {Object} opts Your client options
	 */
	constructor(token, opts = {}) {
		super(opts);
		this.setup();
		this.login(token);
	}
	setup() {
		require("./setup/Message")();
		this.config = require("../config.json");
		(this.commands = new Map()), (this.aliases = new Map());
		this.db = new (require("quick.db-plus").db)("Meyama");
		new (require("./setup/loadCommands"))(this);
	}
	getGuild(id) {
		return this.guilds.cache.get(id);
	}
	getStats() {
		const guildStats = {
			guilds: this.guilds.cache.size,
		};
		return guildStats;
	}
	message(m) {
		m.g = m.guild;
		m.m = m.member;
		m.c = m.channel;
		if (m.author.bot || m.webhookId || !m.guild) return;
		if (
			m.content === `<@${m.client.user.id}>` ||
			m.content === `<@!${m.client.user.id}>`) {
			if (!this.db.get(`${m.g.id}.setupComplete`)) {
				m.s("Looks like I'm not ready to be used here, launching  one-time setup...").then((msg) => m.delete({ timeout: 5000 }));
				new (require("./setup/setup"))(m)
			} else {
				m.s(`My prefix here is \`${this.db.get(m.guild.id + ".config.prefix")}\``);
			}
		}
		const p = this.db.get(m.guild.id + ".config.prefix");
		if (!m.content.toLowerCase().startsWith(p)) return;
		const cont = m.content.slice(p.length).trim().split(" ");
		const c =
			this.commands.get(cont[0]) ||
			this.commands.get(this.aliases.get(cont[0]));
		if (!c) return;
		if (c.help.owner) {
			if (m.author.id !== m.client.config.ownerID) return;
		}
		const args = cont.slice(1);
		try {
			c.run(m, args);
		} catch (e) {
			console.error(e);
		}
	}
};
