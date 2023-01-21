const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('disablekey')
    .setDescription('disables key')
    .addUserOption((option) =>
        option
        .setName("user")
        .setDescription("user to disable")
        .setRequired(true)
    ),
    async execute(interaction, client) {
        const userid = interaction.options.getUser("user")
        if ((interaction.member.roles.cache.find(r => r.name == "Fuhrer")) || (interaction.member.roles.cache.find(r => r.name == "[OWNER]"))) {
            const disable = await supabase
            .from('keys')
            .update({ out_of_duration: true})
            .eq('user', userid.id)
            await interaction.reply("The Users Key Has Been Disabled")
        }
    }

}