module.exports = class Command {
    constructor({
        name = null,
        description = "No description provided",
        category = "No category",
        usage = "No specific usage",
        owner = false,
        aliases = new Array()
    }) {
        Object.assign({ name, description, category, usage, owner, aliases }, this)
    }
}