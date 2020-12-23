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
        if (msg.args[0] == "-s") {
            var silent = true;
            delete msg.args[0];
            msg.args = msg.args.filter((h) => h);
        }
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
            if (!silent) await msg.c.send(evaled, options);
        } catch (err) {
            console.log(err);
            await msg.c.send(err, { code: "js" });
        }
    }
};
