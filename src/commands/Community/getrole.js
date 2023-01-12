const { SlashCommandBuilder, PermissionFlagsBits, GuildMember } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('getrole')
    .setDescription('Gives Buyer Role'),
    async execute(interaction, client) {
        const user = await supabase
        .from('keys')
        .select('activated')
        .eq('user', interaction.user.id)
        if (user.data[0].activated === true && !(interaction.member.roles.cache.find(r => r.name == "Buyer"))) {
            const role = interaction.guild.roles.cache.find(r => r.name == "Buyer");
            await interaction.member.roles.add(role)
            await interaction.reply(`You Have Been Given The Buyer Role`)
        } else if (interaction.member.roles.cache.find(r => r.name == "Buyer")) {
            await interaction.reply("You Already Have The Role")
        } else {
            await interaction.reply(`You Have Not Redeemed A Key On Your Discord Id`)
        }
    }

}