const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

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
        if (interaction.member.roles.cache.find(r => r.name == "[OWNER]")) {
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