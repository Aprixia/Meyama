const cmds = require('../Structures/Commands')
module.exports = class Invite extends cmds {
    constructor() {
        super({
            name: "invite",
            description: "invite Meyama!",
            aliases: ["inv"]
        })
    }

    async run(msg) {
        msg.s(`To invite me, click this link:\nhttps://discord.com/api/oauth2/authorize?client_id=760125006428241952&permissions=268462144&scope=bot`);
    }
} 
