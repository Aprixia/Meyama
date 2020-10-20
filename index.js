let c = new (require("./src/index"))(require("./config.json").token, {
	shards: [0],
	fetchAllUsers: true,
});
c.on("ready", () => {
	console.log("Ready!");
});
c.on("message", (msg) => {
	c.message(msg);
});
c.on("messageUpdate", (oldMsg, msg) => {
	if (oldMsg.content == msg.content) return;
	c.message(msg);
}); //change the config for prettier in the settings if you want
//done
c.on("roleCreate", (role) => {
	//bruh
	/*
	 * Check if guild has role log on
	 * if yes, get the channel and send some data
	 */
	let logChannel = c.db.get(`${msg.g.id}.config.logChannel`); //returns a channel id
	if (!logChannel) return;
});
c.on("roleDelete", (role) => {
	/*
	 * Check if guild has role log on
	 * if yes, get the channel and send some data
	 */
});
c.on("roleUpdate", (role) => {
	/*
	 * Check if guild has role log on
	 * if yes, get the channel and send some data
	 */
});
c.on("guildMemberUpdate", (oldmember, member) => {
	/*
	 * Check if guild has role log on
	 * if yes, send the role which was added to the user
	 */
});

c.on("messageReactionAdd", (reaction, user) => {
	let r = c.db.get(
		`${
			reaction.message.guild ? reaction.message.guild.id : reaction.guild
		}.rr.${reaction.message.id ? reaction.message.id : reaction.message}.${
			reaction.emoji.id || reaction.emoji.name
		}`
	);
	if (!r) return;
	if (user.bot) return;
	let member = reaction.guild
		? c.guilds.cache.get(reaction.guild).members.cache.get(user.id)
		: reaction.message.guild.members.cache.get(user.id);
	member.roles.add(r);
});

c.on("messageReactionRemove", (reaction, user) => {
	let r = c.db.get(
		`${
			reaction.message.guild ? reaction.message.guild.id : reaction.guild
		}.rr.${reaction.message.id ? reaction.message.id : reaction.message}.${
			reaction.emoji.id || reaction.emoji.name
		}`
	);
	if (!r) return;
	if (!reaction.me) {
		c.db.set(
			`${
				reaction.message.guild ? reaction.message.guild.id : reaction.guild
			}.rr.${reaction.message.id ? reaction.message.id : reaction.message}`,
			undefined
		);
	} else {
		let member = reaction.guild
			? c.guilds.cache.get(reaction.guild).members.cache.get(user.id)
			: reaction.message.guild.members.cache.get(user.id);
		member.roles.remove(r);
	}
});

c.on("messageReactionRemoveAll", (msg) => {
	let r = c.db.get(`${msg.guild.id}.rr.${msg.id}`);
	if (!r) return;
	c.db.set(`${msg.guild.id}.rr.${msg.id}`, undefined);
});

c.on("raw", (p) => {
	switch (p.t) {
		case "MESSAGE_REACTION_ADD":
			c.emit(
				"messageReactionAdd",
				{ message: p.d.message_id, guild: p.d.guild_id, emoji: p.d.emoji },
				c.users.cache.get(p.d.user_id)
			);
			break;
		case "MESSAGE_REACTION_REMOVE":
			c.emit(
				"messageReactionAdd",
				{ message: p.d.message_id, guild: p.d.guild_id, emoji: p.d.emoji },
				c.users.cache.get(p.d.user_id)
			);
			break;
	}
});

c.on("guildMemberRemove", (member) => {
	if (!c.db.get(`${member.guild.id}.config.saveRoles`)) return;
	c.db.set(
		`${member.guild.id}.${member.user.id}.backupRoles`,
		member.roles.cache.map((r) => r.id)
	);
});

c.on("guildMemberAdd", (member) => {
	if (
		!c.db.get(`${member.guild.id}.config.saveRoles`) ||
		!c.db.get(`${member.guild.id}.config.roleAtJoin`)
	)
		return;
	try {
		member.roles.add(c.guilds.get(`${member.guild.id}.config.roleAtJoin`));
	} catch {}
	let roles = c.db.get(`${member.guild.id}.${member.user.id}.backupRoles`);
	if (!roles) return;
	roles.forEach((r) => {
		try {
			member.roles.add(r);
		} catch {}
	});
});
