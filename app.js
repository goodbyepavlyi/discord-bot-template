/*
    *LOGGING TO FILE
*/
require('./classes/LogToFile.js')('./logs/');

/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs');
const path = require('path');
const { Client, Intents, Collection } = require('discord.js');

/*
    *CHECKING IF REQUIRED FILES EXIST
*/
if (!process.env.NODE_ENVIRONMENT) throw Error('NODE_ENVIRONMENT is undefined, refusing to start!')
if (!fs.existsSync('./tokens.json') ) throw Error('File with tokens is missing!');
if (!fs.existsSync('./config.json') ) throw Error('Config file is missing!');

/*
    *IMPORTING FILES
*/
const tokens = require('./tokens.json');

/*
    *INITIALIZING DISCORD.JS CLIENT
*/
const client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.GUILD_MEMBERS],
    partials: ['MESSAGE', 'CHANNEL', 'REACTION'],
});

client.data = {};
client.cooldowns = new Map();
module.exports = client;

/*
    *SEPARATE THE ACTIONS IN THE LOG
*/
console.log('--------------------------------');

/*
    *READING AND IMPORTING EVENT LISTENERS
*/
let eventFiles = fs.readdirSync('./events').filter(file => (path.extname(file) == '.js' && !file.startsWith('.')) );
for (let file of eventFiles) {
    let event = require(`./events/${file}`);

    if (event.once) client.once(event.name, (...args) => event.execute(...args));
    else client.on(event.name, (...args) => event.execute(...args));

    console.log(`[Event] Event ${event.name} loaded`);
};

/*
    *SEPARATE THE ACTIONS IN THE LOG
*/
console.log('--------------------------------');

/*
    *READING AND IMPORTING COMMANDS
*/
client.commands = new Collection();
for (let file of fs.readdirSync('./commands').filter(file => (path.extname(file) === '.js' && !file.startsWith('.')))) {
    let command = require(`./commands/${file}`);
    client.commands.set(command.data.name, command);

    console.log(`[Command] Command ${command.data.name} loaded`);
}
/*
    *SEPARATE THE ACTIONS IN THE LOG
*/
console.log('--------------------------------');

/*
    *READING AND IMPORTING BUTTONS
*/
client.interactionButtons = new Collection();
let buttonFiles = fs.readdirSync('./buttons').filter(file => (path.extname(file) === '.js' && !file.startsWith('.')) );
for (let file of buttonFiles) {
    let button = require(`./buttons/${file}`);
    client.interactionButtons.set(button.id, button);

    console.log(`[Button] Button ${button.id} loaded`);
};

/*
    *SEPARATE THE ACTIONS IN THE LOG
*/
console.log('--------------------------------');

client.login(tokens[process.env.NODE_ENVIRONMENT].discord.token);

process.on('unhandledRejection', console.error);
process.on('uncaughtException', console.error);
