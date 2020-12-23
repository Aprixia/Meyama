const cmds = require("../Structures/Commands");
const { MessageEmbed } = require("discord.js");
module.exports = class Role extends cmds {
    constructor() {
        super({
            name: "roleinfo",
            description: "Get the details of a role",
        });
    }

    async run(message) {
        let msg=message;
        if (!msg.args[0])
            return msg.s(
                "<:crossmark:767664506863353877> Woops, you need to provide a role name."
            );
        let role = message.guild.roles.cache.find((r) =>
            r.name.toLowerCase().includes(msg.args.join(" ").toLowerCase())
        );
        if (!role)
            return msg.s(
                "<:crossmark:767664506863353877> Woops, I cannot find that role"
            );
        let perms = role.permissions.serialize();
        let e = new MessageEmbed()
        .setTitle(`${role.name}`).setDescription(
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
