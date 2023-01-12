const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, DiscordAPIError } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
const supabase = createClient('https://tsxzkbeqghrenfmzcetn.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRzeHprYmVxZ2hyZW5mbXpjZXRuIiwicm9sZSI6ImFub24iLCJpYXQiOjE2Njg2Mzc4NjQsImV4cCI6MTk4NDIxMzg2NH0.LBvpWDdltRu34t3plfGbG-4SGZ6DY0j8EIbdD_J9GDE')

module.exports = {
    data: new SlashCommandBuilder()
    .setName('displaydata')
    .setDescription('Shows all the keys')
    .addStringOption((option) =>
        option
        .setName('userid')
        .setDescription('userid to find all data for')
        .setRequired(true)
        )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        if (interaction.member.roles.cache.find(r => r.name == "[OWNER]")) {
            const userid = interaction.options.getString("userid")
            const keys = await supabase
            .from('keys')
            .select('key')
            var array = []
            keys.data.forEach(key => array.push(key.key))
            const data = await supabase
            .from('keys')
            .select('*')
            .eq('user', userid)
            true_data = data.data
            if (true_data.length > 0) {
                var entire_data = "";
                const Embed = new EmbedBuilder()
                Embed.setTitle('Keys')
                for (const obj of true_data) {
                    var keyss = obj.key
                    var length = obj.length
                    var user = obj.user
                    var finish = obj.finish
                    var activated = obj.activated
                    entire_data += `\nKey: ${keyss} Length: ${length} UserId: ${user} Activated: ${activated} FinishDate: ${finish}`
                };
                await interaction.reply({ content: "```"+entire_data+"```", ephemeral: true })
            } else {
                await interaction.reply("This user does not have a key linked to their id")
            }
        } else {
            await interaction.reply("You Are Not The Owner")
        }
        
    }

}