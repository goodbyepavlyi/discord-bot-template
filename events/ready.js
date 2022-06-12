/*
    *IMPORTING NODE CLASSES
*/
const { AutoPoster } = require('topgg-autoposter')

/*
    *IMPORTING FILES
*/
const config = require('../config.json');
const tokens = require('../tokens.json');
const apiServer = require('../api/server');

module.exports = {
    name: 'ready',
    once: true,

    async execute(client) {
        /*
            *CHANGING BOT'S PRESENCE EVERY 20 SECONDS
        */
        let presence = config.bot.presence;
        client.user.setPresence({
            activities: [{
                name: presence.name,
                type: presence.type
            }],
            status: presence.status
        });

        /*
            *STARTING API SERVER
        */
        apiServer.launch(config.server.port, client)

        /*
            *POSTING BOT STATISTICS TO TOP.GG
        */
        if (process.env.NODE_ENVIRONMENT === 'production') {
            const topgg = AutoPoster(tokens[process.env.NODE_ENVIRONMENT].top_gg.api, client);
            try { topgg.on('posted', () => console.log('Top.GG', 'Posted bot statistics!')); }
            catch (error) { console.log('Top.GG', `Failed to post bot statistics! ${error.message}`); }
        }

        console.log('Discord', 'Successfully connected to Discord API!');
        console.log('Discord', `Information - ID: ${client.user.id}, Name: ${client.user.tag}`);

        /*
            *SEPARATE THE ACTIONS IN THE LOG
        */
        console.log('', '');
    },
};
