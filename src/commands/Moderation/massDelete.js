const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE');

module.exports = {
    data: new SlashCommandBuilder()
    .setName('deleteallkeys')
    .setDescription('Deletes every Key and all relevant Data')
    .addStringOption(option => 
      option.setName("deleteallkeys")
        .setDescription("Deletes Every Key")
        .setRequired(true)
        .addChoices(
          { name: "yes", value: 'true' },
          { name: "no", value: 'false' },
    ))
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        if ((interaction.member.roles.cache.find(r => r.name == "Fuhrer")) || (interaction.member.roles.cache.find(r => r.name == "[OWNER]")) || (interaction.member.roles.cache.find(r => r.name == "English"))) {
            const bool = interaction.options.getString("deleteallkeys");
            if (bool === 'true') {
              const { error } = await supabase
              .from('keys')
              .delete()
              .eq('deleteallsafeguard', 1537);
              await interaction.reply(`All the Keys Have Been Deleted`);
            } else if (bool === 'false') {
              await interaction.reply("You are lucky i added this as a failsafe");
            }
        } else {
            await interaction.reply("You Are Not The Owner");
        }
    }

};