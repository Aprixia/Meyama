module.exports = class Command {
    constructor(client, {
        name = null,
        description = "No description provided",
        category = "No category",
        usage = "No specific usage",
        owner = false,
        aliases = new Array()
    }) {
        this.client = client
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