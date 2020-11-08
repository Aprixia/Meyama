const cmds = require("../Structures/Commands");
module.exports = class Config extends cmds {
	constructor() {
		super({
			name: "config",
			description: "Sends my config here!",
		});
	}

	async run(msg) {
		let config = msg.client.db.get(`${msg.g.id}.config`);
		msg.s({
			embed: {
				title: "Meyama's config for this server",
				fields: [
					{
						name: "Backup roles?",
						value: config.saveRoles ? "Yes!!" : "No :(",
						inline: true,
					},
					{
						name: "Role at join?",
						value: config.roleAtJoin
							? `Yes! Members are currently recerving the ${`<@&${config.roleAtJoin}>`} when joining the server!`
							: "No :(",
						inline: true,
					},
					{ name: "Prefix", value: config.prefix, inline: true },
				],
			},
		});
	}
};
