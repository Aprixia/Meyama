const cmds = require("../Structures/Commands");
module.exports = class Help extends cmds {
    constructor() {
        super({
            name: "help",
            description: "ends the help menu of Meyama!",
            usage: "help [command name]",
            aliases: ["h"],
        });
    }

    async run(msg) {
        let help = "";
        msg.client.commands.forEach((c) => {
            if (c.help.owner) {
            } else {
                help += `**${c.help.name}**:\n> **Description:** ${c.help.description
                    }\n> **Subcommands:** ${c.help.subcommands.join(", ") || "None"
                    }\n> **Aliases:** ${c.help.aliases.join(", ") || "None"}\n\n`;
            }
        });
        msg.s("Heya! I'm Meyama, a cute role manager bot! I'll help you manage roles in your server and make your life easier! Here are all my commands:\n" + help);
    }
};
