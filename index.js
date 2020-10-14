let MeyamaClient = new (require('./src/index'))(require('./config.json').token, { shards: [0] })
MeyamaClient.on("ready", () => {
    console.log("Ready!")
});
MeyamaClient.on("message", (msg) => {
    MeyamaClient.message(msg)
})
MeyamaClient.on("messageUpdate", (oldMsg, msg) => {
    if (oldMsg.content == msg.content) return;
    MeyamaClient.message(msg)
})
