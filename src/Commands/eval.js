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

    async run(msg) {
        if (!msg.args.join(" ")) return await msg.send(`I can't eval the air!`);
        try {
            let evaled = require("util").inspect(
                await eval(msg.args.join(" "))
            );
            let options = {};
            if (evaled) {
                if (evaled.length > 2000) evaled = evaled.sliceEvery(2000)[0];
                if (!evaled.toString().startsWith("```js\n"))
                    options = { code: "js" };
            }
            await msg.c.send(evaled, options);
        } catch (err) {
            console.log(err);
            await msg.c.send(err, { code: "js" });
        }
    }
};
