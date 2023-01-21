const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('deletekey')
    .setDescription('Deletes Key and all relevant Data')
    .addStringOption((option) =>
        option
        .setName("key")
        .setDescription("Key to check userid of")
        .setRequired(true)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        if ((interaction.member.roles.cache.find(r => r.name == "Fuhrer")) || (interaction.member.roles.cache.find(r => r.name == "[OWNER]"))) {
            const key = interaction.options.getString("key")
            const user = await supabase
            .from('keys')
            .delete()
            .eq('key', key)
            await interaction.reply(`The Key ${key} and all relevant data linked to that key has been deleted`)
        } else {
            await interaction.reply("You Are Not The Owner")
        }
    }

}