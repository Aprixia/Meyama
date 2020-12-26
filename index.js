let c = new (require("./src/index"))(require("./config.json").token, {
    shards: [0],
    fetchAllMembers: true,
});
c.on("ready", () => {
    if (c.user.id === "760125006428241952") require("./src/setup/dbl")(c);
    console.log("Ready!");
    c.user.setPresence({
        status: "online",
        activity: {
            name: `${c.users.cache.size} cuties in ${c.guilds.cache.size} servers~`,
            type: "WATCHING",
        },
    });
    setInterval(() => {
        c.user.setPresence({
            status: "online",
            activity: {
                name: `${c.users.cache.size} cuties in ${c.guilds.cache.size} servers~`,
                type: "WATCHING",
            },
        });
    }, 180000);
});

c.on("guildCreate", (_) => {
    c.user.setPresence({
        status: "online",
        activity: {
            name: `${c.users.cache.size} cuties in ${c.guilds.cache.size} servers~`,
            type: "WATCHING",
        },
    });
});
c.on("guildDelete", (_) => {
    c.user.setPresence({
        status: "online",
        activity: {
            name: `${c.users.cache.size} cuties in ${c.guilds.cache.size} servers~`,
            type: "WATCHING",
        },
    });
});
c.on("message", (msg) => {
    c.message(msg);
});
c.on("messageUpdate", (oldMsg, msg) => {
    if (oldMsg.content == msg.content) return;
    c.message(msg);
});

c.on("messageReactionAdd", (reaction, user) => {
    let r = c.db.get(
        `${reaction.message.guild.id}.rr.${reaction.message.id}.${reaction.emoji.id || reaction.emoji.name
        }`
    );
    if (!r) return;
    if (user.bot) return;
    let member = c.guilds.cache
        .get(reaction.message.guild.id)
        .members.cache.get(user.id);
    member.roles.add(r);
});

c.on("messageReactionRemove", (reaction, user) => {
    let r = c.db.get(
        `${reaction.message.guild.id}.rr.${reaction.message.id}.${reaction.emoji.id || reaction.emoji.name
        }`
    );
    if (!r) return;
    if (user.bot) return;
    let member = c.guilds.cache
        .get(reaction.message.guild.id)
        .members.cache.get(user.id);
    member.roles.remove(r);
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
                {
                    message: {
                        id: p.d.message_id,
                        guild: { id: p.d.guild_id },
                    },
                    emoji: p.d.emoji,
                },
                c.users.cache.get(p.d.user_id)
            );
            break;
        case "MESSAGE_REACTION_REMOVE":
            c.emit(
                "messageReactionRemove",
                {
                    message: {
                        id: p.d.message_id,
                        guild: { id: p.d.guild_id },
                    },
                    emoji: p.d.emoji,
                },
                c.users.cache.get(p.d.user_id)
            );
            break;
        case "MESSAGE_REACTION_REMOVE_ALL":
            c.emit("messageReactionRemoveAll", {
                id: p.d.message_id,
                guild: {
                    id: p.d.guild_id,
                },
            });
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
        !c.db.get(`${member.guild.id}.config.saveRoles`)
    )
        return;
    let roles = c.db.get(`${member.guild.id}.${member.user.id}.backupRoles`);
    if (!roles) return;
    member.roles.add(roles.filter(c => member.guild.roles.cache.has(c)))
});

c.on("guildMemberUpdate",async (_,newMember) => {
    if (newMember.bot) return;
    if (newMember.roles.cache.size !== 0) return;
    if (newMember.guild.ownerID === newMember.user.id) return;d
    if (!newMember.guild.me.hasPermission("MANAGE_ROLES")) return;
    if (!c.db.get(`${newMember.guild.id}.config.roleAtJoin`)) return;
    if (newMember.guild.roles.cache.get(c.db.get(`${newMember.guild.id}.config.roleAtJoin`)).comparePositionTo(newMember.guild.me.roles.highest) >= 0) return;
    let mem = await c.api.guilds[newMember.guild.id].members[newMember.user.id].get()
    if (!mem.pending) {
        if (newMember.roles.cache.has(c.db.get(`${newMember.guild.id}.config.roleAtJoin`))) return;
        try {
            newMember.roles.add(c.db.get(`${newMember.guild.id}.config.roleAtJoin`))
        } catch { }
    }
})
