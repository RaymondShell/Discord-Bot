const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder, DiscordAPIError } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
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
            var userid = interaction.options.getString("userid")
            if (userid.startsWith('<@') && userid.endsWith('>')) {
              userid = userid.slice(2, -1);
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
                    var disabled = obj.out_of_duration
                    entire_data += `\nKey: ${keyss} Length: ${length} UserId: ${user} Activated: ${activated} FinishDate: ${finish} Disabled: ${disabled}`
                };
                await interaction.reply({ content: "```"+entire_data+"```", ephemeral: true })
            }
            } else {
                await interaction.reply("This user does not have a key linked to their id")
            }
        } else {
            await interaction.reply("You Are Not The Owner")
        }
        
    }

}