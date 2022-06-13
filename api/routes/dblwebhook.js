/*
    *IMPORTING NODE CLASSES
*/
const { Router } = require('express');
const dayjs = require('dayjs');
const router = Router();
const { MessageEmbed } = require('discord.js');
const { Webhook } = require('@top-gg/sdk');

/*
    *IMPORTING FILES
*/
const config = require('../../config.json');
const tokens = require('../../tokens.json');
const messages = require('../../assets/messages');
const client = require('../../app');
const { getColor } = require('../../classes/Embed');
const { addBalance, getBalance, vote, getTotalVotes, getVoteStreak } = require('../../classes/User');

const webhook = new Webhook(tokens[process.env.NODE_ENVIRONMENT].top_gg.webhook);

router.post('/dblwebhook', webhook.listener(async res => {
    let userId = res.user;
    await vote(userId);
    await addBalance(userId, 1250);
    
    client.users.fetch(userId).then(async (user) => {
        let balance = await getBalance(userId);
        let total = (await getTotalVotes(userId)).toString() || '0';
        let streak = (await getVoteStreak(userId)).toString() || '0';

        console.log('Votes', `${user.tag} (${user.id}) voted at ${dayjs().format('HH:mm:ss')}!`);
        let userEmbed = new MessageEmbed()
            .setColor(getColor('accent'))
            .setTitle(messages.VOTE_RECEIVED_USER_TITLE)
            .setFooter({
                text: messages.VOTE_RECEIVED_USER_FOOTER,
            })
            .setDescription(messages.VOTE_RECEIVED_USER_DESCRIPTION.replaceAll('{emoji}', config.bot.emojis.coins).replaceAll('{balance}', balance))
            .addField(messages.VOTE_CURRENT_STREAK, streak, true)
            .addField(messages.VOTE_TOTAL, total, true);

        user.send({ embeds: [userEmbed] }).catch(() => { return });

        let guildEmbed = new MessageEmbed()
            .setColor(getColor('accent'))
            .setImage(config.bot.embed.images.accept_rules)
            .setAuthor({
                name: user.username,
                iconURL: user.avatarURL(),
                url: config.bot.links.vote
            })
            .setDescription(messages.VOTE_SERVER_DESCRIPTION.replaceAll('{user}', user.username).replaceAll('{voteLink}', config.bot.links.vote)
                            .replaceAll('{time}', `<t:${Math.floor((Date.now() + (12 * 60 * 60 * 1000)) / 1000)}:R>`).replaceAll('{voted}', total));

        let server = client.guilds.cache.get(config.bot.support_server.id) || await client.guilds.fetch(config.bot.support_server.id);    
        let channel = server.channels.cache.get(config.bot.support_server.channels.user_votes) || await server.channels.fetch(config.bot.support_server.channels.user_votes);

        return channel.send({ embeds: [guildEmbed] });
    }).catch((error) => {
        if (error.message != 'Unknown User') return console.error(error);
        return console.log('Votes', `${userId} voted at ${dayjs().format('HH:mm:ss')}!`);
    });
}));

module.exports = router;