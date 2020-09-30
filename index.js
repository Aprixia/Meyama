RoleManagerClient = new (require('./src/index'))(require('./config.json').token, { shards: [0] })
RoleManagerClient.on("ready", () => {
    console.log("Ready!")
})
RoleManagerClient.on("message", (msg) => {
    RoleManagerClient.message(msg)
})
RoleManagerClient.on("messageUpdate", (oldMsg, msg) => {
    if (oldMsg.content == msg.content) return;
    RoleManagerClient.message(msg)
})