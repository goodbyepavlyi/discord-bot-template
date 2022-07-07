const { request, response } = require(`express`);
const client = require(`../app`);

module.exports = [{
    path: `/goodbyepavlyi`,
    method: `get`,

    /**
     * @param {request} req 
     * @param {response} res 
     */
    run: async (req, res) => {
        const user = await client.users.fetch(`755473025209466950`, { force: true });
        const guilduser = await (await client.guilds.fetch(`967398604992049153`))?.members.fetch(`755473025209466950`);

        if (!guilduser?.user?.id || !user?.id) return res.status(500).json({
            status: 500,
            message: `Cannot fetch goodbyepavlyi.`
        });

        let color = `#747F8D`;
        switch (guilduser.presence?.status) {
            case `online`: { color = `#57F287`; break; }
            case `dnd`: { color = `#ED4245`; break; }
            case `idle`: { color = `#FEE75C`; break; }
        };

        let emote, text;
        if (guilduser.presence?.activities.find(activity => activity.type === `CUSTOM`)) {
            const status = guilduser.presence?.activities.find(activity => activity.type === `CUSTOM`);

            if (status.emoji?.id) emote = `https://cdn.discordapp.com/emojis/${status.emoji.id}.${status.emoji.animated ? `gif` : `png`}?size=2048`;
            if (status.state) text = status.state;
        };

        let status = { state: { text: guilduser.presence?.status, color: color }, emote: emote, text: text };

        let activities = [];
        guilduser.presence?.activities?.forEach(activity => {
            if (activity.name == `Spotify`) {
                activities.push({
                    applicationId: activity.applicationId,
                    name: activity.name,
                    url: activity.url,
                    details: activity.details,
                    state: activity.state,
                    createdTimestamp: activity.createdTimestamp,
                    timestamps: {
                        start: activity.timestamps?.start ? new Date(activity.timestamps?.start).getTime() : null,
                        end: activity.timestamps?.end ? new Date(activity.timestamps?.end).getTime() : null
                    },
                    assets: {
                        large: {
                            text: activity.assets?.largeText,
                            image: (activity.assets?.largeImage ? (activity.assets.largeImage.startsWith(`spotify:`) ? `https://i.scdn.co/image/${activity.assets.largeImage.replace(/spotify:/, ``)}` : `https://i.scdn.co/image/${activity.assets.largeImage}.png`) : null)
                        },
                        small: {
                            text: activity.assets?.smallText,
                            image: activity.assets?.smallImage ? `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png` : `https://upload.wikimedia.org/wikipedia/commons/thumb/1/19/Spotify_logo_without_text.svg/1200px-Spotify_logo_without_text.svg.png`
                        }
                    }
                });
            } else if (activity.name != `Custom Status`) {
                activities.push({
                    applicationId: activity.applicationId,
                    name: activity.name,
                    url: activity.url,
                    details: activity.details,
                    state: activity.state,
                    createdTimestamp: activity.createdTimestamp,
                    timestamps: {
                        start: activity.timestamps?.start ? new Date(activity.timestamps?.start).getTime() : null,
                        end: activity.timestamps?.end ? new Date(activity.timestamps?.end).getTime() : null
                    },
                    assets: {
                        large: {
                            text: activity.assets?.largeText,
                            image: (activity.assets?.largeImage ? (activity.assets.largeImage.startsWith(`mp:external`) ? `https://media.discordapp.net/${activity.assets.largeImage.replace(/mp:/, ``)}` : `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.largeImage}.png`) : null)
                        },
                        small: {
                            text: activity.assets?.smallText,
                            image: activity.assets?.smallImage ? (activity.assets.smallImage.startsWith(`mp:external`) ? `https://media.discordapp.net/${activity.assets.smallImage.replace(/mp:/, ``)}` : `https://cdn.discordapp.com/app-assets/${activity.applicationId}/${activity.assets.smallImage}.png`) : null
                        }
                    }
                });
            }
        });

        return res.status(200).json({
            status: 200,
            message: `OK`,
            content: {
                id: guilduser.user.id,
                username: guilduser.user.username,
                discriminator: guilduser.user.discriminator,
                nickname: guilduser.nickanme || guilduser.user.username,
                nickavatar: guilduser.avatar ? `https://cdn.discordapp.com/guilds/${guilduser.guild.id}/users/${guilduser.id}/avatars/${guilduser.avatar}.${guilduser.avatar?.startsWith(`a_`) ? `gif` : `png`}?size=2048` : null,
                status,
                activities,
                createdTimestamp: guilduser.user.createdTimestamp,
                avatar: guilduser.user.avatar ? `https://cdn.discordapp.com/avatars/${guilduser.user.id}/${guilduser.user.avatar}.${guilduser.user.avatar?.startsWith(`a_`) ? `gif` : `png`}?size=2048` : null,
                banner: user.banner ? `https://cdn.discordapp.com/banners/${guilduser.user.id}/${user.banner}.${user.banner?.startsWith(`a_`) ? `gif` : `png`}?size=600` : null,
                accentColor: `#${parseInt(user.accentColor, 10).toString(16)}`
            }
        });
    }
}];