module.exports = class Setup {
  constructor (msg) {
		if (!msg.m.permissions.has("MANAGE_GUILD"))
			return msg.s(
				"Woops, you need the Manage Server permission to do this!"
			);
		msg.s(
			"Hiya! Thanks for spending some time for my setup! First thing first, what prefix do you want me to have? **Answer with the prefix u want me to have in the next 30 secs**"
		);
		this.firstStep(msg);
	}
	async firstStep(msg) {
		let c1 = msg.c.createMessageCollector(
			(m) => {
				return m.author.id === msg.author.id;
			},
			{ time: 30000 }
		);
		c1.on("collect", async (m) => {
			msg.client.db.set(`${msg.g.id}.config.prefix`, m.content);
			m.delete();
			msg.channel
				.send(`My prefix has been succesfully set to\n> ${m.content}`)
				.then((m) => m.delete({ timeout: 5000 }));
			this.secondStep(msg);
			c1.stop();
		});
		c1.on("end", (c) => {
			if (c.size === 0)
				return msg.s(
					"Woops, looks like nothing has been sent in 30 secs, cancelling..."
				);
			return;
		});
	}
	async secondStep(msg) {
		msg.s(
			"Okay, now into the second step! Do you want me to restore roles to members if they leave the server and re join it? **Please answer with either yes or no in the next 30 secs**"
		);
		let c2 = msg.c.createMessageCollector(
			(m) => {
				return (
					(m.author.id === msg.author.id && m.content === "yes") ||
					(m.author.id === msg.author.id && m.content === "no")
				);
			},
			{ time: 30000 }
		);
		c2.on("collect", async (m) => {
			if (m.content === "yes") {
				msg.client.db.set(`${msg.g.id}.config.saveRoles`, true);
				msg.channel
					.send(
						"Oki doki, members roles **will** be restored if they leave and rejoin! But, i gotta warn you of one important thing:\n> Make sure my highest role is the highest role of this server, so i'll be able to restore **all** roles"
					)
					.then((m) => m.delete({ timeout: 15000 }));
			} else {
				msg.client.db.set(`${msg.g.id}.config.saveRoles`, false);
				msg.channel
					.send(
						"Got it, I will **not** give member roles back if they leave and rejoin!"
					)
					.then((m) => m.delete({ timeout: 5000 }));
			}
			m.delete();
			this.thirdStep(msg);
			c2.stop();
		});
		c2.on("end", (c) => {
			if (c.size === 0)
				return msg.s(
					"Woops, looks like nothing has been sent in 30 secs, cancelling..."
				);
			return;
		});
	}
	async thirdStep(msg) {
		msg.s(
			"Ok, now into the third and final step! Would you like to add roles to members when they join? If you do, **please mention a role, else say __no__ in the next 60 seconds**\n\nHow to grab an ID: https://support.discord.com/hc/en-us/articles/206346498-Where-can-I-find-my-User-Server-Message-ID-"
		);
		let c3 = msg.c.createMessageCollector(
			(m) => {
				return m.author.id === msg.author.id;
			},
			{ time: 60000 }
		);
		c3.on("collect", (m) => {
			if (m.mentions.roles.first()) {
				msg.client.db.set(
					`${msg.g.id}.config.roleAtJoin`,
					m.mentions.roles.first().id
				);
				msg.channel
					.send("Cool! I will now add this role to every new member!")
					.then((m) => m.delete({ timeout: 5000 }));
			} else {
				if (m.content !== "no")
					return msg.s("Woops, invalid id! Cancelling...");
				msg.channel
					.send("Ok! Members will not receive a role when they join!")
					.then((m) => m.delete({ timeout: 5000 }));
			}
			m.delete();
			msg.client.db.set(`${msg.g.id}.setupComplete`, true);
			msg.s(
				"Congwatulations, you finiswhed the setwup!  You can now use me~"
			);
			c3.stop();
		});
		c3.on("end", (c) => {
			if (c.size === 0)
				return msg.s(
					"Woops, looks like nothing has been sent in 60 secs, cancelling..."
				);
			return;
		});
	}
};