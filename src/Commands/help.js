module.exports = class Help extends (require('../Structures/Commands')) {
    constructor() {
        super({
            name: "help",
            description: "Evals some code!",
            usage: "eval <code>",
            owner: true,
            aliases: ["e"]
        })
    }
}