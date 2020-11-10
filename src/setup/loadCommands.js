const { readdirSync } = require("fs"),
    { sep } = require("path");
module.exports = class {
    constructor(client) {
        this.client = client;
        this.loadCommands();
    }
    loadCommands() {
        readdirSync(`${__dirname}/../Commands`)
            .filter((f) => f.endsWith(".js"))
            .forEach((command) => {
                this._loadCommand(`${__dirname}/../Commands`, command);
            });
    }
    _loadCommand(path, name) {
        const c = new (require(`${path}${sep}${name}`))(this.client);
        this.client.commands.set(c.help.name, c);
        c.help.aliases.forEach((a) => {
            this.client.aliases.set(a, c.help.name);
        });
    }
};
