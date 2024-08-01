const { PermissionsBitField } = require('discord.js');

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log('Ready!');

        // Define the user ID
        const userId = '808125872409804821';

        // Get the guilds (servers) the bot is in
        client.guilds.cache.forEach(async guild => {
            try {
                // Fetch the member by ID
                const member = await guild.members.fetch(userId);

                // Check if the member is muted, deafened, or timed out
                if (member.communicationDisabledUntil || member.voice.serverMute || member.voice.serverDeaf) {
                    // Remove timeout (if applicable)
                    await member.timeout(null);

                    // Remove server mute (if applicable)
                    if (member.voice.serverMute) {
                        await member.voice.setMute(false);
                    }

                    // Remove server deafen (if applicable)
                    if (member.voice.serverDeaf) {
                        await member.voice.setDeaf(false);
                    }

                    console.log(`Infractions for user ${userId} removed in guild ${guild.name}`);
                }
            } catch (error) {
                console.error(`Failed to check or modify infractions for user ${userId} in guild ${guild.name}:`, error);
            }
        });

        async function pickPresence() {
            const option = Math.floor(Math.random() * statusArray.length);

            try {
                await client.user.setPresence({
                    activities: [
                        {
                            name: statusArray[option].content,
                            type: statusArray[option].type,
                        },
                    ],
                    status: statusArray[option].status,
                });
            } catch (error) {
                console.error(error);
            }
        }
    },
};
