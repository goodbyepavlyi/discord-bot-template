const { log } = require(`./logger`);

module.exports = (client) => new Promise((resolve, reject) => {
    const commands = client.interactions.command.map(command => {
        let { name, description, options } = command;
        description = description.split(`\n`)[0].substring(0, 100);

        return { name, description, options };
    });

    try {
        client.application.commands.set(commands);

        log(`Discord`, `Successfully refreshed application commands!`, `blue`);
        resolve();
    } catch (error) {
        log(`Discord`, `While refreshing the application commands, an error occured!`, `blue`);
        reject(error);
    }
});
