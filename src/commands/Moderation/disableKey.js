const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

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