module.exports = class Command {
    constructor({
        name,
        description = "No description provided",
        subcommands = new Array(),
        owner = false,
        aliases = new Array(),
    }) {
        this.help = {
            name,
            description,
            subcommands,
            owner,
            aliases,
        };
    }
};
