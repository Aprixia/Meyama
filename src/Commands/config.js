const cmds = require("../Structures/Commands");
module.exports = class Config extends cmds {
    constructor() {
        super({
            name: "config",
            description: "Sends my config here!",
            subcommands: [
                "delete",
                "edit prefix <new prefix>",
                "edit roleAtJoin @role",
                "edit backupRoles <yes/no>",
            ],
        });
    }

    async run(msg) {
        let config = msg.client.db.get(`${msg.g.id}.config`);
        if (!msg.args[0]) {
            msg.s({
                embed: {
                    title: "Meyama's config for this server",
                    fields: [
                        {
                            name: "Backup roles?",
                            value: config.saveRoles ? "Yes!!" : "No :(",
                            inline: true,
                        },
                        {
                            name: "Role at join?",
                            value: config.roleAtJoin
                                ? `Yes! Members are currently recerving the ${`<@&${config.roleAtJoin}>`} when joining the server!`
                                : "No :(",
                            inline: true,
                        },
                        { name: "Prefix", value: config.prefix, inline: true },
                    ],
                    footer: {
                        text:
                            "Please check the sub-commands of this command to see how to edit or delete the config",
                    },
                },
            });
        } else {
            if (msg.args[0] == "delete") {
                let code = Math.random().toString(36).substring(4);
                msg.s(
                    `ARE YOU SURE YOU WANT TO DELETE THE CONFIGUWATION!?\nIF YOU ARE? PLEASE TYPE THE CODE BELOW IN THE NEXT 30 SECONDS. TYPE ANYTHING ELSE TO CANCEL\n\n${code}`
                );
                let c1 = msg.c.createMessageCollector(
                    (m) => {
                        return m.author.id === msg.author.id;
                    },
                    { time: 30000 }
                );
                c1.on("collect", async (m) => {
                    if (m.content !== code) {
                        c1.stop();
                    }
                    msg.client.db.set(`${msg.g.id}.config`, {});
                    msg.client.db.set(`${msg.g.id}.setupComplete`, false);
                    msg.s(
                        "Alright, I deleted the configuwation for this server :'("
                    );
                });
                c1.on("end", (c) => {
                    if (c.size === 0)
                        return msg.s(
                            "Woops, looks like nothing has been sent in 30 secs, cancelling..."
                        );
                    return;
                });
            } else if (msg.args[0] == "edit") {
                switch (msg.args[1]) {
                    case "prefix":
                        if (!msg.args[2]) {
                            return msg.s(
                                "Please send the new prefix you want me to have, could be useful~"
                            );
                        }
                        msg.client.db.set(
                            `${msg.g.id}.config.prefix`,
                            msg.args.slice(2).join(" ")
                        );
                        msg.s(
                            `Prefix changed to ${msg.args.slice(2).join(" ")}`
                        );
                        break;
                    case "roleAtJoin":
                        if (!msg.args[2] || !msg.mentions.roles.first()) {
                            return msg.s(
                                "Please mention the role you wanna add to members when they join, would be great~"
                            );
                        }
                        msg.client.db.set(
                            `${msg.g.id}.config.roleAtJoin`,
                            msg.mentions.roles.first().id
                        );
                        msg.s(
                            "Oki doki, members will now receive this role when they'll join!"
                        );
                        break;
                    case "backupRoles":
                        if (["yes", "no"].includes(msg.args[2])) {
                            return msg.s("Pwease say either yes or no!");
                        }
                        msg.client.db.set(
                            `${msg.g.id}.config.roleAtJoin`,
                            msg.args[2] == "yes" ? true : false
                        );
                        msg.s("Oki doki!");
                        break;
                    default:
                        msg.s(
                            "Wrong usage of the command, please check the help menu of this command for a list of sub commands!"
                        );
                        break;
                }
            } else {
                return msg.s(
                    "Wrong usage of the command, please check the help menu of this command for a list of sub commands!"
                );
            }
        }
    }
};
