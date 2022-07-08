const { Collection } = require('discord.js');
const path = require('path');
const { walk } = require(`../utils/filesystem.js`);

module.exports = (client) => {
    const files = walk(path.join(__dirname, '../interactions')).filter(file => file.endsWith('.js'));

    for (const file of files) {
        const interaction = require(file);

        const type = interaction?.type;
        if (!type) return;

        const identifier = interaction?.name || interaction?.id;
        (client.interactions[type] ??= new Collection()).set(identifier, interaction);
    }
};