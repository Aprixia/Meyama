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