let c = new (require('./src/index'))(require('./config.json').token, { shards: [0], fetchAllUsers: true })
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

c.on("roleCreate", (role) => {
    /*
    * Check if guild has role log on
    * if yes, get the channel and send some data
    */
})
c.on("roleDelete", (role) => {
    /*
    * Check if guild has role log on
    * if yes, get the channel and send some data
    */
})
c.on("roleUpdate", (role) => {
    /*
    * Check if guild has role log on
    * if yes, get the channel and send some data
    */
})
c.on("guildMemberUpdate", (oldmember, member) => {
    /*
    * Check if guild has role log on
    * if yes, send the role which was added to the user
    */
})

function radd(reaction, user) {
    let r = c.db.get(`${reaction.message.guild ? reaction.message.guild.id : reaction.guild}.rr.${reaction.message.id ? reaction.message.id : reaction.message}.${reaction.emoji.id || reaction.emoji.name}`)
    if (!r) return;
    if (user.bot) return;
    let member = reaction.message.guild.members.cache.get(user.id)
    member.roles.add(r)
}

function rrem(reaction, user) {
    let r = c.db.get(`${reaction.message.guild ? reaction.message.guild.id : reaction.guild}.rr.${reaction.message.id ? reaction.message.id : reaction.message}.${reaction.emoji.id || reaction.emoji.name}`)
    if (!r) return;
    if (!reaction.me) {
        c.db.set(`${reaction.message.guild ? reaction.message.guild.id : reaction.guild}.rr.${reaction.message.id ? reaction.message.id : reaction.message}`, undefined)
    } else {
        let member = reaction.message.guild.members.cache.get(user.id) || c.guilds.cache.get(reaction.guild).members.cache.get(user.id)
        member.roles.remove(r)
    }
}
c.on("messageReactionAdd", (reaction, user) => {
    radd(reaction, user)
})
c.on("messageReactionRemove", (reaction, user) => {
    rrem(reaction, user)
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
c.on("raw", (p) => {
    switch (p.t) {
        case "MESSAGE_REACTION_ADD":
            radd({ message: p.d.message_id, guild: p.d.guild_id, emoji: p.d.emoji }, c.users.cache.get(p.d.user_id))
            break;
        case "MESSAGE_REACTION_REMOVE":
            rrem({ message: p.d.message_id, guild: p.d.guild_id, emoji: p.d.emoji }, c.users.cache.get(p.d.user_id))
            break;
    }
})