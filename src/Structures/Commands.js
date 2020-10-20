module.exports = class Command {
    constructor({
        name = null,
        description = "No description provided",
        usage = "No specific usage",
        owner = false,
        aliases = new Array(),
    }) {
        this.help = {
            name,
            description,
            usage,
            owner,
            aliases,
        };
    }
};