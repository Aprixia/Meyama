module.exports = class Command {
    constructor({
        name = null,
        description = "No description provided",
        category = "No category",
        usage = "No specific usage",
        owner = false,
        aliases = new Array()
    }) {
        this.owner = owner
        this.help = {
            name,
            description,
            category,
            usage,
            aliases
        }
    }
}