/*
    *IMPORTING NODE CLASSES
*/
const { AutoPoster } = require('topgg-autoposter')
const { Client } = require('statcord.js');

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
            *POSTING BOT STATISTICS TO TOP.GG AND STATCORD.COM
        */
        if (process.env.NODE_ENVIRONMENT === 'production') {
            const topGG = AutoPoster(tokens[process.env.NODE_ENVIRONMENT].top_gg.api, client);
            try { topGG.on('posted', () => console.log('[Top.GG] Posted bot statistics!')); }
            catch (error) { console.log(`[Top.GG] Failed to post bot statistics! ${error.message}`); }

            const statcord = new Client({ client, key: tokens[process.env.NODE_ENVIRONMENT].statcord_api });
            statcord.autopost();
            statcord.on('post', error => {
                if (error) return console.log(`[Statcord.com] Failed to post bot statistics! ${error}`);

                console.log('[Statcord.com] Posted bot statistics!')
            });
        }

        console.log('[Client] Successfully connected to Discord API!');
        console.log(`[Client] Information - ID: ${client.user.id}, Name: ${client.user.tag}`);

        /*
            *SEPARATE THE ACTIONS IN THE LOG
        */
        console.log('--------------------------------');
    },
};
