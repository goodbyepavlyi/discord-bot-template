const { end, log } = require(`../utils/logger.js`);
const slashsync = require(`../utils/slashsync.js`);
const { AutoPoster } = require(`topgg-autoposter`);

module.exports = {
    name: `ready`,
    once: true,

    async run(client) {
        end(`Discord`, `Successfully connected to Discord API! (${client.user.tag}) (${client.user.id})`, `blue`);

        client.user.setPresence({
            activities: [{
                name: client.presenceName,
                type: client.presenceType,
            }],
            status: client.presenceStatus,
        });

        const topgg = AutoPoster(client.topggToken, client);
        topgg.on(`posted`, () => log(`Top.GG`, `Posted bot statistics!`, `pink`))
            .on(`error`, (error) => log(`Top.GG`, `Failed to post bot statistics! ${error.message}`, `red`));

        await slashsync(client);
    },
};
