const cmds = require("../Structures/Commands");
const { MessageEmbed } = require("discord.js");
module.exports = class Ping extends cmds {
    constructor() {
        super({
            name: "role",
            description: "Get the details of a role",
        });
    }

    async run(message, args) {
        if (!args[0])
            return msg.s(
                "<:crossmark:767664506863353877> Woops, you need to provide a role name."
            );
        let role = message.guild.roles.cache.find((r) =>
            r.name.toLowerCase().includes(args.join(" ").toLowerCase())
        );
        if (!role)
            return msg.s(
                "<:crossmark:767664506863353877> Woops, I cannot find that role"
            );
        let perms = role.permissions.serialize();
        let e = new MessageEmbed();
        e.setTitle(`${role.name}`).setDescription(
            `**ID:** ${role.id}\n**Member Count:** ${
                role.members.size
            }\n**Hex Color:** #${role.color.toString(16)}`
        );

        let permlist = Object.keys(perms);
        permlist.forEach((p) => {
            e.addField(
                p,
                perms[p]
                    ? "<:checkmark:767664519643791381>"
                    : "<:crossmark:767664506863353877>",
                true
            );
        });
        message.s(e);
    }
};
