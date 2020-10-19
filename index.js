let c = new (require('./src/index'))(require('./config.json').token, { shards: [0] })
c.on("ready", () => {
    console.log("Ready!")
});
c.on("message", (msg) => {
    c.message(msg)
})
c.on("messageUpdate", (oldMsg, msg) => {
    if (oldMsg.content == msg.content) return;
    c.message(msg)
})
c.on("guildMemberRemove", (member) => {
    if (!c.db.get(`${member.guild.id}.config.saveRoles`)) return;
    c.db.set(`${member.guild.id}.${member.user.id}.backupRoles`, member.roles.cache.map(r => r.id))
})
c.on("guildMemberAdd", (member) => {
    if (!c.db.get(`${member.guild.id}.config.saveRoles`)) return;
    let roles = c.db.get(`${member.guild.id}.${member.user.id}.backupRoles`)
    if (!roles) return;
    roles.forEach(r => {
        try {
            member.roles.add(r)
        } catch { }
    })
})
c.on("messageReactionAdd", (reaction, user) => {
    let r = c.db.get(`${reaction.message.guild.id}.rr.${reaction.message.id}.${reaction.emoji.id || reaction.emoji.name}`)
    if (!r) return console.log("not found");
    if (user.bot) return;
    let member = reaction.message.guild.members.cache.get(user.id)
    member.roles.add(r)
})
c.on("messageReactionRemove", (reaction, user) => {
    let r = c.db.get(`${reaction.message.guild.id}.rr.${reaction.message.id}.${reaction.emoji.id || reaction.emoji.name}`)
    if (!r) return;
    if (!reaction.me) {
        c.db.set(`${reaction.message.guild.id}.rr.${reaction.message.id}`, undefined)
    } else {
        let member = reaction.message.guild.members.cache.get(user.id)
        member.roles.remove(r)
    }
})
c.on("messageReactionRemoveAll", (msg) => {
    let r = c.db.get(`${msg.guild.id}.rr.${msg.id}`)
    if (!r) return;
    c.db.set(`${msg.guild.id}.rr.${msg.id}`, undefined)
})
c.on("messageDelete", (m) => {
    let r = c.db.get(`${m.guild.id}.rr.${m.id}`)
    if (!r) return;
    c.db.get(`${m.guild.id}.rr.${m.id}`, undefined)
})
c.on("messageDeleteBulk", (msgs) => {
    msgs.forEach(msg => {
        let r = c.db.get(`${msg.guild.id}.rr.${msg.id}`)
        if (!r) return;
        c.db.get(`${msg.guild.id}.rr.${msg.id}`, undefined)
    })
})