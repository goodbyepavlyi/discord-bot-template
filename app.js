const { start, log } = require(`./utils/logger.js`);
start(`App`, `Connecting to WebSocket..`, `blue`);

const { Client, Intents } = require(`discord.js`);
const client = new Client({
    allowedMentions: {
        parse: [ `users`, `roles` ],
    },
    presence: {
        status: `invisible`,
        activities: [{
            name: `starting up..`,
            type: `PLAYING`,
        }],
    },
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.GUILD_PRESENCES,
        Intents.FLAGS.DIRECT_MESSAGES,
    ],
    partials: [ `MESSAGE`, `CHANNEL` ],
});

//* Importing Config
const config = require(`./config.js`);
Object.keys(config).forEach(async (key) => client[key] = config[key]);

//* Creating Wait Function
client.wait = (time) => new Promise(resolve => setTimeout(resolve, time));

module.exports = client;

//* Handlers
client.interactions = {};
const { readdirSync } = require(`fs`);
const names = readdirSync(`./handlers/`).filter(file => file.endsWith(`.js`));
names.forEach(name => {
    require(`./handlers/${name}`)(client);
});

client.login(client.discordToken);

//* Web server
const express = require(`express`);
const path = require(`path`);
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.setHeader(`Access-Control-Allow-Origin`, `*`);
    res.setHeader(`Access-Control-Allow-Methods`, `GET, POST, PUT, DELETE, PATCH`);
    res.setHeader(`Access-Control-Allow-Headers`, `Content-Type, authorization `);
    res.setHeader(`Access-Control-Allow-Credentials`, true);

    next();
});

app.get(`*`, (req, res, next) => {
    if (!client.user) return res.status(500).send({
        status: 500,
        message: `The client is not available`,
    });

    next();
});

app.get(`*`, (req, res, next) => {
    const token = client.serverToken;
    const userToken = req.headers.authorization;

    if (token != userToken) return res.status(403).send({
        status: 403,
        message: `The token you provided does not match!`,
    });

    next();
});

const { walk } = require(`./utils/filesystem.js`);
walk(path.join(__dirname, `api`)).forEach(file => {
    const relativePath = file.replace(path.join(__dirname, `routes`), ``);
    const routePath = relativePath.split(`\\`).join("/").replace(".js", ``);
    const routes = require(file);

    routes.forEach(route => {
        if (route.method) app[route.method](route.path ? route.path : routePath, route.run);
    });
});

app.get(`*`, (req, res) => {
    res.status(404).json({
        status: 404,
        message: `You have entered an invalid route!`,
    });
});

app.listen(client.serverPort, (error) => {
    if (error) log(`API`, JSON.stringify(error), `red`);

    log(`API`, `Listening to http://localhost:${client.serverPort}`, `green`);
});