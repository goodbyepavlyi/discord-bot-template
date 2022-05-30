module.exports = {
  apps : [{
    name: "BOTNAME - discord bot",
    script: "./app.js",
    watch: false,
    env: {
      "NODE_ENVIRONMENT": "production",
    }
  }]
}
