const cmds = require("../Structures/Commands");
module.exports = class Info extends cmds {
    constructor() {
        super({
            name: "info",
            description: "Shows some infos on me!",
        });
    }

    async run(msg) {
        msg.s({
            embed: {
                title: "Infos on Meyama",
                fields: [
                    {
                        name: "Who made me?",
                        value: `It's ${
                            (await msg.client.users.fetch("635383782576357407"))
                                .tag
                        }! What a cutie~`,
                        inline: true,
                    },
                    {
                        name: "What am I built in?",
                        value: `Discord.js v${require("discord.js").version}`,
                        inline: true,
                    },
                    {
                        name: "Where am I hosted? (yes thats vewy impowtant)",
                        value: "I'm hosted on Contabo, yay~!",
                        inline: true,
                    },
                    {
                        name: "What am I supposed to do as a bot?",
                        value:
                            "I'm a role manager bot, so i help you manage roles for your server! I hope you enjoy me ^~^",
                        inline: true,
                    },
                ],
            },
        });
    }
};
