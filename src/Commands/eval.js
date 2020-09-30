module.exports = class Eval extends (require('../Structures/Commands')) {
    constructor(client) {
        super(client, {
            name: "eval",
            description: "Evals some code!",
            usage: "eval <code>",
            owner: true
        })
    }

    async run(msg, args) {
        let evaled;
        try {
            evaled = await eval(args.join(' '))
        } catch (e) {
            evaled = e
        }
        msg.send(evaled ? evaled : "undefined")
    }
}