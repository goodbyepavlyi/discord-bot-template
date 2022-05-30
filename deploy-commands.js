if (!process.env.NODE_ENVIRONMENT) throw Error('NODE_ENVIRONMENT is undefined, refusing to start!')

/*
    *IMPORTING NODE CLASSES
*/
const fs = require('fs');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');

/*
    *CREATING VARIABLES
*/
let tokens = require('./tokens.json');

/*
    *READING COMMANDS
*/
let commandsPath = './commands';
let commands = [];

for (let file of fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'))) {
    let command = require(`${commandsPath}/${file}`);
    if (command.data) commands.push(command.data.toJSON());
}

/*
    *INITIALIZING DISCORD API
*/
const rest = new REST({ version: '9' });
rest.setToken(tokens[process.env.NODE_ENVIRONMENT].discord.token);

(async() => {
    try {
		console.log('Started refreshing application commands.');

        let clientId = tokens[process.env.NODE_ENVIRONMENT].discord.clientId;

        await rest.put(Routes.applicationCommands(clientId), { body: commands });

        if (process.env.NODE_ENVIRONMENT == 'development') {
            let developmentServerId = tokens[process.env.NODE_ENVIRONMENT].discord.developmentServerId;
            await rest.put(Routes.applicationGuildCommands(clientId, developmentServerId), { body: commands });
        }

        console.log('Successfully reloaded application commands.');
    } catch (error) {
        throw Error(error);
    }
})();
