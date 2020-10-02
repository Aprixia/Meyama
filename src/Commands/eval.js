module.exports = class Eval extends (require('../Structures/Commands')) {
    constructor() {
        super({
            name: "eval",
            description: "Evals some code!",
            usage: "eval <code>",
            owner: true,
            aliases: ["e"]
        })
    }

    async run(msg, args) {
        let evaled;
        try {
            evaled = await eval(args.join(' '))
        } catch (e) {
            evaled = e
        }
        try {
            msg.send(evaled)
        } catch {
            msg.send("undefined")
        }
    }
}