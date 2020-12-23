module.exports = function (client) {
    const DBL = require("dblapi.js");
    const dbl = new DBL(client.config.DBL, client);

    dbl.on("posted", () => {
        console.log("Server count posted!");
    });

    dbl.on("error", (e) => {
        console.log(`Oops! ${e}`);
    });
}