const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('disablekey')
    .setDescription('disables key')
    .addStringOption((option) =>
        option
        .setName("userid")
        .setDescription("userid to disable")
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const userid = interaction.options.getString("userid")
        if (interaction.member.roles.cache.find(r => r.name == "[OWNER]")) {
            const disable = await supabase
            .from('keys')
            .update({ out_of_duration: true})
            .eq('user', userid)
            await interaction.reply("The Users Key Has Been Disabled")
        }
    }

}