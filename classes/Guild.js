/*
    *IMPORTING NODE CLASSES
*/
const db = require('quick.db');

async function createGuild(guildId) {
    try {
        if (!guildId) return;

        db.set(`guild_${guildId}`, {
            id: guildId,
            channels: {}
        });

        let guild = await db.get(`guild_${guildId}`);
        return guild;
    } catch (error) {
        throw Error(error);
    }
}

async function getGuild(guildId) {
    try {
        if (!guildId) return;

        let guild = await db.get(`guild_${guildId}`) || await createGuild(guildId);
        return guild;
    } catch (error) {
        throw Error(error);
    }
}

async function saveData(guildId, data) {
    try {
        if (!(guildId || data)) return;

        return await db.set(`guild_${guildId}`, data);
    } catch (error) {
        throw Error(error);
    }
}

async function getChannel(guildId, channelType) {
    try {
        if (!(guildId || channelType)) return;

        let guild = await getGuild(guildId);

        let channel = guild.channels[channelType];
        return channel;
    } catch (error) {
        throw Error(error);
    }
}

async function setChannel(guildId, channelType, channelId) {
    try {
        if (!(guildId || channelType || channelId)) return;

        let guild = await getGuild(guildId);
        guild.channels[channelType] = channelId;

        return saveData(guildId, guild);
    } catch (error) {
        throw Error(error);
    }
}

module.exports = {
    createGuild,
    getGuild,
    
    getChannel,
    setChannel,
}