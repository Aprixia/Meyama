const cmds = require("../Structures/Commands");
module.exports = class Support extends cmds {
	constructor() {
		super({
			name: "support",
			description: "Sends a link to my support server!",
		});
	}

	async run(msg) {
		msg.s({
			embed: {
				description:
					"Wanna join my support server? Nice~ Please click [this link](https://discord.gg/xNKa5Mr)",
			},
		});
	}
};
