const cmds = require("../Structures/Commands");
module.exports = class Eval extends cmds {
    constructor() {
        super({
            name: "eval",
            description: "Evals some code!",
            usage: "eval <code>",
            owner: true,
            aliases: ["e"],
        });
    }

    async run(msg, args) {
        try {
            let evaled = await eval(args.join(" "));
            msg.s(evaled, { code: "js" });
        } catch (e) {
            msg.s(e);
        }
    }
};