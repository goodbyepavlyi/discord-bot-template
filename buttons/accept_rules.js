/*
    *IMPORTING NODE CLASSES
*/
const { MessageEmbed, MessageButton, MessageActionRow, ButtonInteraction, Client, User, GuildMember, Guild, Channel } = require('discord.js');

/*
    *IMPORTING FILES
*/
const config = require('../config.json');
const messages = require('../assets/messages');
const { hasAgreedToRules, agreeToRules } = require('../classes/User.js');
const { getColor } = require('../classes/Embed');

module.exports = {
    id: 'accept_rules',

    /**
     * @param {ButtonInteraction} interaction 
     * @param {Client} client 
     * @param {User} user 
     * @param {GuildMember} guildMember 
     * @param {Guild} guild 
     * @param {Channel} channel 
     */
    async execute(interaction, client, user, guildMember, guild, channel) {
        let agreedToRules = await hasAgreedToRules(user.id);
        if (agreedToRules) {
            let embed = new MessageEmbed()
                .setColor(getColor('accent'))
                .setAuthor({
                    name: messages.BOT_RULES_AUTHOR_NAME,
                    iconURL: client.user.displayAvatarURL()
                })
                .setTitle(messages.BOT_RULES_ALREADY_ACCEPTED_TITLE)
                .setDescription(messages.BOT_RULES_ALREADY_ACCEPTED_DESCRIPTION);

            return interaction.update({ embeds: [embed], components: [] });
        }

        await agreeToRules(user.id);

        let embed = new MessageEmbed()
            .setColor(getColor('accent'))
            .setAuthor({
                name: messages.BOT_RULES_AUTHOR_NAME,
                iconURL: client.user.displayAvatarURL()
            })
            .setImage(config.bot.embed.images.froggie_background_zoomed)
            .setTitle(messages.BOT_RULES_ACCEPTED_TITLE)
            .setDescription(messages.BOT_RULES_ACCEPTED_DESCRIPTION.replaceAll('{supportServerLink}', config.bot.support_server.invite));

        let buttons = new MessageActionRow().addComponents(
            new MessageButton()
                .setCustomId('accept_rules')
                .setLabel(messages.BOT_RULES_ACCEPT_BUTTON)
                .setDisabled(true)
                .setStyle('PRIMARY'),
            new MessageButton()
                .setURL(config.bot.links.privacypolicy)
                .setLabel(messages.BOT_RULES_PRIVACY_BUTTON)
                .setStyle('LINK'));

        return interaction.update({ embeds: [embed], components: [buttons] });
    }
}