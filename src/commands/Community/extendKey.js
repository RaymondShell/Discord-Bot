const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const { createClient } = require('@supabase/supabase-js')
require('dotenv').config();
const supabase = createClient(process.env.dburl, process.env.dbkey)
module.exports = {
    data: new SlashCommandBuilder()
    .setName('extendkey')
    .setDescription('extend a keys duration')
    .addStringOption((option) =>
        option
        .setName("key")
        .setDescription("Key to check remaining time for")
        .setRequired(true)
        )
    .addStringOption((option) =>
        option
        .setName("duration")
        .setDescription("Days to add onto the current time")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers),
    async execute(interaction, client) {
        if (interaction.member.roles.cache.find(r => r.name == "Whitelister") || (interaction.member.roles.cache.find(r => r.name == "Fuhrer")) || (interaction.member.roles.cache.find(r => r.name == "[OWNER]"))) {
            const key = interaction.options.getString("key")
            const extension = interaction.options.getString("duration")
            const date = await supabase
            .from('keys')
            .select('finish')
            .eq('key', key)
            if (date.data.length !== 0) {
                var true_date = date.data[0].finish
                extendedDate = addDays(true_date, extension)
                const { error } = await supabase
                    .from('keys')
                    .update({ finish: extendedDate })
                    .eq('key', key)
                await interaction.reply({ content:"The Key ```"+ key+"``` was extended until "+extendedDate, ephemeral: true })
            } else {
                await interaction.reply({ content:`Either Your Key is Not Activated Or You Put The Wrong Key In Retard`, ephemeral: true })
            }
        } else {
            await interaction.reply("You Do Not Have Whitelister Perms")
        }
        
    }

}

function addDays(date, days) {
    days = Number(days)
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    var newDate = result.toISOString().split("T")[0];
    return newDate;
  }