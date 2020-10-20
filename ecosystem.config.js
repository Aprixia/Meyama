module.exports = {
    apps: [{
        name: "Meyama",
        script: "index.js",
        // Options reference: https://pm2.keymetrics.io/docs/usage/application-declaration/
        autorestart: true,
        watch: false,
    }, ],
};