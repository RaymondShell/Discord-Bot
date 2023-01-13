const { SlashCommandBuilder, PermissionFlagsBits, GuildMember, EmbedBuilder } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
module.exports = {
    data: new SlashCommandBuilder()
    .setName('help')
    .setDescription('Lists All Your Exams'),
    async execute(interaction, client) {
        const embed = new EmbedBuilder()
            .setTitle('Commands')
            .setDescription(`/activate - Activated a Liscence Key\n/getrole - Gives Buyer Role\n/checktime - displays remaining time for key\n/uptime - Time bot has been up for`)
        await interaction.reply({ embeds: [embed]})
    }

}