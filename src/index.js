const Discord = require('discord.js')
module.exports = class MeyamaClient extends Discord.Client {
    /**
    * Constructs the client
    * @param {String} token Your bot token
    * @param {Object} opts Your client options
    */
    constructor(token, opts = {}) {
        super(opts)
        this.setup()
        this.login(token)
    }
    setup() {
        require("./setup/Message")()
        this.config = require('../config.json')
        this.commands = new Map(), this.aliases = new Map()
        this.db = new (require("quick.db-plus")).db("Meyama")
        new (require("./setup/loadCommands"))(this)
    }
    getGuild(id) {
        return this.guilds.cache.get(id)
    }
    getStats() {
        const guildStats = {
            guilds: this.guilds.cache.size
        }
        return guildStats
    }
    message(m) {
        if (m.author.bot || m.webhookId || !m.guild) return;
        const p = this.db.get("prefix." + m.guild.id) || ".";
        if (!m.content.toLowerCase().startsWith(p));
        const cont = m.content.slice(p.length).trim().split(' ')
        const c = this.commands.get(cont[0]) || this.commands.get(this.aliases.get(cont[0]))
        if (!c) return;
        if (c.owner) {
            if (m.author.id !== this.config.ownerID) return;
        }
        const args = cont.slice(1)
        try {
            c.run(m, args)
        } catch (e) {
            console.error(e)
        }
    }
}
