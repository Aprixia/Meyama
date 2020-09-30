const Discord = require('discord.js')
module.exports = class RoleManagerClient extends Discord.Client {
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
    findCommand(c) {
        try {
            this.commands.get(c)
            return true
        } catch {
            return false
        }
    }
    message(m) {
        if (m.author.bot || m.webhookId || !m.guild) return;
        const p = "rm-";
        if (!m.content.toLowerCase().startsWith(p.toLowerCase())) return;
        const cont = m.content.slice(p.length).trim().split(' ')
        if (!this.findCommand(cont[0].toLowerCase())) return;
        const c = this.commands.get(cont[0].toLowerCase())
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